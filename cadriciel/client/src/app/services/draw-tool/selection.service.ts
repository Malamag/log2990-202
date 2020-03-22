import { Injectable, Renderer2 } from '@angular/core';
import { ColorPickingService } from '../colorPicker/color-picking.service';
import { KeyboardHandlerService } from '../keyboard-handler/keyboard-handler.service';
import { InteractionService } from '../service-interaction/interaction.service';
import { Point } from './point';
import { ShapeService } from './shape.service';

const OUTLINE_COLOR = '0, 102, 204, 0.9';
const FILL_COLOR = '0, 102, 204, 0.3';
const INVERTED_OUTLINE_COLOR = '204, 0, 102, 0.9';
const INVERTED_FILL_COLOR = '204, 0, 102, 0.3';

const NO_MOUSE_MOVEMENT_TOLERANCE = 5;
const MIN_OFFSET_FOR_SELECTION = 10;

const START_ARROW_DELAY = 500;
const ARROW_MOVEMENT_DELAY = 100;

@Injectable({
  providedIn: 'root'
})

export class SelectionService extends ShapeService {

  render: Renderer2;
  selectedRef: HTMLElement;

  itemUnderMouse: any;
  canMoveSelection: boolean;
  foundAnItem: boolean;
  selectedItems: boolean[];
  invertedItems: boolean[];
  movingSelection: boolean;
  canvas: HTMLElement;
  movedSelectionOnce: boolean;
  movedMouseOnce: boolean;
  inverted: boolean;
  wrapperDimensions: [Point, Point];

  arrows: [boolean, boolean, boolean, boolean];
  arrowTimers: [number, number, number, number];
  singleUseArrows: [boolean, boolean, boolean, boolean];
  existingLoop: boolean;
  timeCount: number;
  movedSelectionWithArrowsOnce: boolean;

  constructor(inProgess: HTMLElement, drawing: HTMLElement, selected: boolean, interaction: InteractionService,
              colorPick: ColorPickingService, render: Renderer2, selection: HTMLElement, canvas: HTMLElement) {
    super(inProgess, drawing, selected, interaction, colorPick);

    this.selectedItems = [];
    this.invertedItems = [];
    this.movingSelection = false;
    this.canMoveSelection = true;
    this.render = render;
    this.foundAnItem = false;
    this.selectedRef = selection;
    this.canvas = canvas;
    this.movedSelectionOnce = false;
    this.movedMouseOnce = false;
    this.inverted = false;

    this.arrows = [false, false, false, false];
    this.singleUseArrows = [false, false, false, false];
    this.arrowTimers = [0, 0, 0, 0];
    this.timeCount = 0;
    this.existingLoop = false;
    this.moveWithArrowsLoop();
    this.movedSelectionWithArrowsOnce = false;

    this.wrapperDimensions = [new Point(-1, -1), new Point(-1, -1)];

    this.selectedRef.style.pointerEvents = 'none'; // ignore the bounding box on click

    window.addEventListener('newDrawing', (e: Event) => {
      for (let i = 0; i < this.drawing.childElementCount; i++) {
        const EL = this.drawing.children[i];
        const STATUS = EL.getAttribute('isListening');
        if (STATUS !== 'true') {
          this.render.listen(EL, 'mousedown', () => {
            this.render.setAttribute(EL, 'isListening', 'true');
            if (!this.foundAnItem) {
              this.itemUnderMouse = i;
              this.foundAnItem = true;
            }
          });
        }
      }
    });

    window.addEventListener('toolChange', (e: Event) => {
      for (let i = 0; i < this.drawing.childElementCount; i++) {
        this.selectedItems = [];
        this.selectedRef.innerHTML = this.updateBoundingBox();
      }
      this.selectedItems = [];
      this.cancel();
    });
  }

  updateDown(keyboard: KeyboardHandlerService): void {

    // CTRL-A SELECT ALL
    if (keyboard.keyCode == 65 && keyboard.ctrlDown) {
      this.selectedItems = [];
      for (let i = 0; i < this.drawing.children.length; i++) {
        this.selectedItems[i] = true;
      }
      this.selectedRef.innerHTML = this.updateBoundingBox();
    }

    if (!keyboard.released) {
      this.arrows[0] = keyboard.keyCode === 37 ? true : this.arrows[0];
      this.arrows[1] = keyboard.keyCode === 38 ? true : this.arrows[1];
      this.arrows[2] = keyboard.keyCode === 39 ? true : this.arrows[2];
      this.arrows[3] = keyboard.keyCode === 40 ? true : this.arrows[3];
    }

    const SINGLE_LEFT = this.arrows[0] && !this.singleUseArrows[0];
    const SINGLE_UP = this.arrows[1] && !this.singleUseArrows[1];
    const SINGLE_RIGHT = this.arrows[2] && !this.singleUseArrows[2];
    const SINGLE_DOWN = this.arrows[3] && !this.singleUseArrows[3];

    this.moveWithArrowOnce(SINGLE_LEFT, SINGLE_UP, SINGLE_RIGHT, SINGLE_DOWN);
  }

  moveWithArrowOnce(left: boolean, up: boolean, right: boolean, down: boolean): void {

    this.singleUseArrows[0] = left ? true : this.singleUseArrows[0];
    this.singleUseArrows[1] = up ? true : this.singleUseArrows[1];
    this.singleUseArrows[2] = right ? true : this.singleUseArrows[2];
    this.singleUseArrows[3] = down ? true : this.singleUseArrows[3];

    let xoff = 0;
    let yoff = 0;
    if (right) {
      xoff += 3;
    }
    if (left) {
      xoff += -3;
    }
    if (up) {
      yoff += -3;
    }
    if (down) {
      yoff += 3;
    }

    this.movedSelectionWithArrowsOnce = this.movedSelectionWithArrowsOnce || (xoff !== 0 || yoff !== 0);

    if (this.selectedItems.length > 0) {
      this.moveSelection(xoff, yoff);
      this.selectedRef.innerHTML = this.updateBoundingBox();
    }
  }

  moveWithArrowsLoop(): void {

    this.existingLoop = true;

    if (this.arrowTimers.some((el) => el >= START_ARROW_DELAY)) {
      let xoff = 0;
      let yoff = 0;
      if (this.arrows[2]) {
        xoff += 3;
      }
      if (this.arrows[0]) {
        xoff += -3;
      }
      if (this.arrows[1]) {
        yoff += -3;
      }
      if (this.arrows[3]) {
        yoff += 3;
      }

      this.movedSelectionWithArrowsOnce = this.movedSelectionWithArrowsOnce || (xoff !== 0 || yoff !== 0);

      if (this.selectedItems.length > 0) {
        this.moveSelection(xoff, yoff);
        this.selectedRef.innerHTML = this.updateBoundingBox();
      }
    }
    setTimeout(() => {
      this.moveWithArrowsLoop();
      for (let i = 0; i < this.arrowTimers.length; i++) {
        this.arrowTimers[i] = this.arrows[i] ? this.arrowTimers[i] + ARROW_MOVEMENT_DELAY : this.arrowTimers[i];
      }
    }, ARROW_MOVEMENT_DELAY);
  }

  // updating on key up
  updateUp(keyCode: number): void {

    if (keyCode === 37) {
      this.arrows[0] = false;
      this.arrowTimers[0] = 0;
      this.singleUseArrows[0] = false;
    }
    if (keyCode === 38) {
      this.arrows[1] = false;
      this.arrowTimers[1] = 0;
      this.singleUseArrows[1] = false;
    }
    if (keyCode === 39) {
      this.arrows[2] = false;
      this.arrowTimers[2] = 0;
      this.singleUseArrows[2] = false;
    }
    if (keyCode === 40) {
      this.arrows[3] = false;
      this.arrowTimers[3] = 0;
      this.singleUseArrows[3] = false;
    }

    this.canMoveSelection = this.arrows.includes(true);

    if (this.movedSelectionWithArrowsOnce && !this.arrows.includes(true)) {
      this.movedSelectionWithArrowsOnce = false;
      this.interaction.emitDrawingDone();
    }
  }

  down(position: Point, insideWorkspace: boolean, isRightClick: boolean): void {

    // in case we changed tool while the mouse was down
    this.ignoreNextUp = false;

    // the rectangleTool should affect the canvas
    this.isDown = true;

    // add the same point twice in case the mouse doesnt move
    this.currentPath.push(position);
    this.currentPath.push(position);

    // inverting selection with right-click
    this.inverted = isRightClick;

    // we need to know if we clicked in the bounding box to make sure we can move it accordingly
    this.movingSelection = !this.inverted && Point.insideRectangle(position, this.wrapperDimensions[0], this.wrapperDimensions[1]);

    // on right-click, save the inverted selection state of each item
    if (this.inverted) {
      for (let i = 0; i < this.selectedItems.length; i++) {
        this.invertedItems[i] = !this.selectedItems[i];
      }
    }

    // if there is an object under the click that is not already selected
    if (this.itemUnderMouse != null && !this.selectedItems[this.itemUnderMouse] && !this.inverted) {
      // unselect all items
      this.selectedItems = [];
      // select the focused one
      this.selectedItems[this.itemUnderMouse] = true;
      // enable moving
      this.movingSelection = true;
    }

    this.updateProgress();
  }

  // mouse up with selection in hand
  up(position: Point): void {

    // in case we changed tool while the mouse was down
    if (this.ignoreNextUp) {
      return;
    }
    // the selection should not affect the canvas
    this.isDown = false;

    // check for small offset to make single item selection more permissive
    if (Point.distance(this.currentPath[0], this.currentPath[this.currentPath.length - 1]) < NO_MOUSE_MOVEMENT_TOLERANCE) {

      if (!this.inverted) {
        // new selection, empty selection status
        this.selectedItems = [];
        this.invertedItems = [];
      } else {
        // we're inverting, save the inverted selection status of each item
        for (let i = 0; i < this.selectedItems.length; i++) {
          this.invertedItems[i] = !this.selectedItems[i];
        }
      }

      // adjust the focused item's selection status
      if (this.itemUnderMouse != null) {
        this.selectedItems[this.itemUnderMouse] = this.inverted ? !this.selectedItems[this.itemUnderMouse] : true;
      }
    }

    // reset focused item
    this.itemUnderMouse = null;
    this.foundAnItem = false;

    this.selectedRef.innerHTML = this.updateBoundingBox();

    // if we moved a selection, emit the drawing for undo-redo
    if (this.selectedItems.includes(true) && this.movingSelection && this.movedSelectionOnce) {
      this.interaction.emitDrawingDone();
    }

    // reset mouse offset status
    this.movedSelectionOnce = false;
    this.movedMouseOnce = false;
    this.movingSelection = false;

    // clear selection rectangle
    this.currentPath = [];
    this.inProgress.innerHTML = '';
  }

  move(position: Point): void {

    // only if the selectionTool is currently affecting the canvas
    if (this.isDown) {

      if (this.movingSelection) {
        this.movedSelectionOnce = true;

        const PREV_MOUSE_POSITION = this.currentPath[this.currentPath.length - 1];
        const OFFSET = new Point(position.x - PREV_MOUSE_POSITION.x, position.y - PREV_MOUSE_POSITION.y);

        this.moveSelection(OFFSET.x, OFFSET.y);
      }

      // save mouse position
      this.currentPath.push(position);

      // if we're not trying to move an existing selection, we want to make a selection rectangle
      if (!this.movingSelection) {
        // check for small offset to make single item selection more permissive
        if (Point.distance(this.currentPath[0], this.currentPath[this.currentPath.length - 1]) > MIN_OFFSET_FOR_SELECTION) {
          // only on a normal selection
          if (!this.inverted) {
            // we first need to empty the current selection
            this.selectedItems = [];
          }
          // get every item that intersects with the selection rectangle
          this.retrieveItemsInRect();
        }

        this.updateProgress();
      }

      this.selectedRef.innerHTML = this.updateBoundingBox();
    }
  }

  updateBoundingBox() {

    if (!this.selected) {
      this.selectedItems = [];
    }

    const CANV = this.canvas;
    const CANVAS_BOX = CANV ? CANV.getBoundingClientRect() : null;

    // default values, is the value valid?
    let minX: [number, boolean] = [1000000000, false];
    let maxX: [number, boolean] = [-1, false];
    let minY: [number, boolean] = [1000000000, false];
    let maxY: [number, boolean] = [-1, false];

    // iterate through all items
    for (let j = 0; j < Math.min(this.selectedItems.length, this.drawing.childElementCount); j++) {

      // ignore those who aren't selected
      if (!this.selectedItems[j]) { continue; }

      // iterate through every svg element
      for (let i = 0; i < this.drawing.children[j].childElementCount; i++) {

        const CURRENT = this.drawing.children[j].children[i] as HTMLElement;

        // ignore the brush filters
        if (CURRENT.tagName.toString() == 'filter') { continue; }

        // offset due to the stroke width
        const CHILD_STROKE_WIDTH = CURRENT.getAttribute('stroke-width');
        const CURRENT_OFFSET = CHILD_STROKE_WIDTH ? + CHILD_STROKE_WIDTH / 2 : 0;

        // item bounding box
        const BOX = CURRENT.getBoundingClientRect();
        const TOP_LEFT: Point = new Point(BOX.left - CURRENT_OFFSET, BOX.top - CURRENT_OFFSET);
        const BOTTOM_RIGHT: Point = new Point(BOX.right + CURRENT_OFFSET, BOX.bottom + CURRENT_OFFSET);

        // get smallest rectangle that includes every item
        minX = TOP_LEFT.x < minX[0] ? [TOP_LEFT.x, true] : [minX[0], minX[1]];
        maxX = BOTTOM_RIGHT.x > maxX[0] ? [BOTTOM_RIGHT.x, true] : [maxX[0], maxX[1]];
        minY = TOP_LEFT.y < minY[0] ? [TOP_LEFT.y, true] : [minY[0], minY[1]];
        maxY = BOTTOM_RIGHT.y > maxY[0] ? [BOTTOM_RIGHT.y, true] : [maxY[0], maxY[1]];
      }
    }

    // convert
    if (CANVAS_BOX != null) {
      minX[0] -= CANVAS_BOX.left;
      maxX[0] -= CANVAS_BOX.left;
      minY[0] -= CANVAS_BOX.top;
      maxY[0] -= CANVAS_BOX.top;
    }

    this.wrapperDimensions[0] = new Point(minX[0], minY[0]);
    this.wrapperDimensions[1] = new Point(maxX[0], maxY[0]);

    let wrapper = '';
    if (minX[1] && maxX[1] && minY[1] && maxY[1]) {
      wrapper += `<rect id="selection" x="${minX[0]}" y="${minY[0]}"`;
      wrapper += `width="${maxX[0] - minX[0]}" height="${maxY[0] - minY[0]}"`;

      wrapper += 'fill="rgba(0,120,215,0.3)"';
      wrapper += 'stroke-width="1" stroke="rgba(0,120,215,0.9)"/>';
    }

    return wrapper;
  }

  // links the selection rectangle with the current drawing and manages the selected items
  retrieveItemsInRect(): void {

    const SELECTION_RECTANGLE = this.inProgress.lastElementChild;
    const ITEMS = this.drawing.children;

    // selection bounding box
    const SELECTION_BOX = SELECTION_RECTANGLE ? SELECTION_RECTANGLE.getBoundingClientRect() : null;
    const BOX_TOP_LEFT: Point = new Point(SELECTION_BOX ? SELECTION_BOX.left : -1, SELECTION_BOX ? SELECTION_BOX.top : -1);
    const BOX_BOTTOM_RIGHT: Point = new Point(SELECTION_BOX ? SELECTION_BOX.right : -1, SELECTION_BOX ? SELECTION_BOX.bottom : -1);

    for (let i = 0; i < ITEMS.length; i++) {

      // item bounding box
      const ITEM_BOX = ITEMS[i].getBoundingClientRect();
      const ITEM_TOP_LEFT: Point = new Point(ITEM_BOX.left, ITEM_BOX.top);
      const ITEM_BOTTOM_RIGHT: Point = new Point(ITEM_BOX.right, ITEM_BOX.bottom);

      // check if the two bounding box are overlapping
      const INSIDE: boolean = Point.rectOverlap(BOX_TOP_LEFT, BOX_BOTTOM_RIGHT, ITEM_TOP_LEFT, ITEM_BOTTOM_RIGHT);

      // item is inside the selection rectangle -> select/unselect accordingly
      if (INSIDE) {
        if (this.inverted) {
          this.selectedItems[i] = this.invertedItems[i] == undefined ? true : this.invertedItems[i];
        } else {
          this.selectedItems[i] = true;
          this.invertedItems[i] = false;
        }
      } else {
        if (this.inverted) {
          this.selectedItems[i] = this.invertedItems[i] == undefined ? false : !this.invertedItems[i];
        } else {
          this.selectedItems[i] = false;
          this.invertedItems[i] = true;
        }
      }
    }
  }

  // Moves the current selection by a number of pixels
  moveSelection(xoff: number, yoff: number): void {

    // if there is at least 1 item selected
    if (this.selectedItems.includes(true)) {

      // iterate through all items
      for (let i = 0; i < Math.min(this.selectedItems.length, this.drawing.childElementCount); i++) {

        // ignore those who aren't selected
        if (!this.selectedItems[i]) { continue; }

        // get the current item's translate and add the offsets
        const CURRENT = (this.drawing.children[i] as HTMLElement).style.transform;
        const S = CURRENT ? CURRENT.split(',') : '';
        const NEW_X = +(S[0].replace(/[^\d.-]/g, '')) + xoff;
        const NEW_Y = +(S[1].replace(/[^\d.-]/g, '')) + yoff;

        // set the new values
        this.render.setStyle(this.drawing.children[i], 'transform', `translate(${NEW_X}px,${NEW_Y}px)`);
      }
    }
  }

  // Creates an svg rect that connects the first and last points of currentPath with the rectangle attributes
  createPath(p: Point[]): string {

    let s = '';

    // We need at least 2 points
    if (p.length < 2) {
      return s;
    }

    // first and last points
    const P1_X = p[0].x;
    const P1_Y = p[0].y;
    const P2_X = p[p.length - 1].x;
    const P2_Y = p[p.length - 1].y;

    // calculate the width and height of the rectangle
    const W = P2_X - P1_X;
    const H = P2_Y - P1_Y;

    // find top-left corner
    const startX = W > 0 ? p[0].x : p[p.length - 1].x;
    const startY = H > 0 ? p[0].y : p[p.length - 1].y;

    // create a divider
    s = '<g name = "selection-perimeter">';

    // set render attributes for the svg rect
    s += `<rect x="${startX}" y="${startY}"`;
    s += `width="${Math.abs(W)}" height="${Math.abs(H)}"`;

    s += `fill="rgba(${this.inverted ? INVERTED_FILL_COLOR : FILL_COLOR})"`;
    s += `stroke-width="5" stroke="rgba(${this.inverted ? INVERTED_OUTLINE_COLOR : OUTLINE_COLOR})"`;
    s += 'stroke-dasharray="5,5"/>';

    // end the divider
    s += '</g>';

    // can't have rectangle with 0 width or height
    if (W === 0 || H === 0) {
      s = '';
    }

    return s;
  }
}
