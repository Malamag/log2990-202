import { Injectable, Renderer2 } from '@angular/core';
import { ColorPickingService } from '../colorPicker/color-picking.service';
import { InteractionService } from '../service-interaction/interaction.service';
import { Point } from './point';
import { KeyboardHandlerService } from '../keyboard-handler/keyboard-handler.service';
import { ShapeService } from './shape.service';
import { ElementInfo } from './element-info.service';

const OUTLINE_COLOR: string = "0, 102, 204, 0.9";
const FILL_COLOR: string = "0, 102, 204, 0.3";
const INVERTED_OUTLINE_COLOR: string = "204, 0, 102, 0.9";
const INVERTED_FILL_COLOR: string = "204, 0, 102, 0.3";

const NO_MOUSE_MOVEMENT_TOLERANCE: number = 5;
const MIN_OFFSET_FOR_SELECTION: number = 10;

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
  canvas: HTMLElement
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

    this.selectedRef.style.pointerEvents = "none"; // ignore the bounding box on click

    window.addEventListener("newDrawing", (e: Event) => {
      for (let i = 0; i < this.drawing.childElementCount; i++) {
        let el = this.drawing.children[i];
        let status = el.getAttribute("isListening");
        if (status !== "true") {
          this.render.listen(el, "mousedown", () => {
            this.render.setAttribute(el, "isListening", "true");
            if (!this.foundAnItem) {
              this.itemUnderMouse = i;
              this.foundAnItem = true;
            }
          });
        }
      }
    });

    window.addEventListener("toolChange", (e: Event) => {
      for (let i = 0; i < this.drawing.childElementCount; i++) {
        this.selectedItems = [];
        this.selectedRef.innerHTML = this.updateBoundingBox();
      }
      this.selectedItems = [];
      this.cancel();
    });
  }

  updateDown(keyboard: KeyboardHandlerService) {

    //CTRL-A SELECT ALL
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

    let singleLeft = this.arrows[0] && !this.singleUseArrows[0];
    let singleUp = this.arrows[1] && !this.singleUseArrows[1];
    let singleRight = this.arrows[2] && !this.singleUseArrows[2];
    let singleDown = this.arrows[3] && !this.singleUseArrows[3];

    this.moveWithArrowOnce(singleLeft, singleUp, singleRight, singleDown)
  }

  moveWithArrowOnce(left: boolean, up: boolean, right: boolean, down: boolean) {

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

    this.movedSelectionWithArrowsOnce = this.movedSelectionWithArrowsOnce || (xoff != 0 || yoff != 0);

    if (this.selectedItems.length > 0) {
      this.moveSelection(xoff, yoff);
      this.selectedRef.innerHTML = this.updateBoundingBox();
    }
  }

  moveWithArrowsLoop() {

    this.existingLoop = true;

    if (this.arrowTimers.some(el => el >= START_ARROW_DELAY)) {
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
  updateUp(keyCode: number) {

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

  down(position: Point, insideWorkspace: boolean, isRightClick: boolean) {

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
        this.invertedItems[i] = !this.selectedItems[i]
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
  up(position: Point) {

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
          this.invertedItems[i] = !this.selectedItems[i]
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
    this.inProgress.innerHTML = "";
  }

  move(position: Point) {

    // only if the selectionTool is currently affecting the canvas
    if (!this.isDown) {
      return;
    }

    if (this.movingSelection) {
      this.movedSelectionOnce = true;

      let prevMousePosition = this.currentPath[this.currentPath.length - 1];
      let offset = new Point(position.x - prevMousePosition.x, position.y - prevMousePosition.y);

      this.moveSelection(offset.x, offset.y);
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

  updateBoundingBox() {

    if (!this.selected) {
      this.selectedItems = [];
    }

    let canv = this.canvas
    let canvasBox = canv ? canv.getBoundingClientRect() : null;

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

        let current = this.drawing.children[j].children[i] as HTMLElement;

        // ignore the brush filters
        if (current.tagName.toString() == "filter") { continue; }

        // offset due to the stroke width
        let childStrokeWidth = current.getAttribute("stroke-width");
        let currentOffset = childStrokeWidth ? +childStrokeWidth / 2 : 0;

        // item bounding box
        let box = current.getBoundingClientRect();
        let topLeft: Point = new Point(box.left - currentOffset, box.top - currentOffset);
        let bottomRight: Point = new Point(box.right + currentOffset, box.bottom + currentOffset);

        // get smallest rectangle that includes every item
        minX = topLeft.x < minX[0] ? [topLeft.x, true] : [minX[0], minX[1]];
        maxX = bottomRight.x > maxX[0] ? [bottomRight.x, true] : [maxX[0], maxX[1]];
        minY = topLeft.y < minY[0] ? [topLeft.y, true] : [minY[0], minY[1]];
        maxY = bottomRight.y > maxY[0] ? [bottomRight.y, true] : [maxY[0], maxY[1]];
      }
    };

    // convert
    if (canvasBox != null) {
      minX[0] -= canvasBox.left;
      maxX[0] -= canvasBox.left;
      minY[0] -= canvasBox.top;
      maxY[0] -= canvasBox.top;
    }

    this.wrapperDimensions[0] = new Point(minX[0], minY[0]);
    this.wrapperDimensions[1] = new Point(maxX[0], maxY[0]);

    let wrapper = "";
    if (minX[1] && maxX[1] && minY[1] && maxY[1]) {

      let w = maxX[0] - minX[0];
      let h = maxY[0] - minY[0];

      wrapper += `<rect id="selection" x="${minX[0]}" y="${minY[0]}"`;
      wrapper += `width="${w}" height="${h}"`;

      wrapper += `fill="rgba(0,120,215,0.3)"`;
      wrapper += `stroke-width="1" stroke="rgba(0,120,215,0.9)"/>`;

      let controlPoints = "";
      controlPoints += `<circle cx="${minX[0] + w / 2}" cy="${minY[0]}" r="7" fill="rgba(0,120,215)" />`;
      controlPoints += `<circle cx="${minX[0] + w / 2}" cy="${maxY[0]}" r="7" fill="rgba(255,120,215)" />`;
      controlPoints += `<circle cx="${minX[0]}" cy="${minY[0] + h / 2}" r="7" fill="rgba(0,120,215)" />`;
      controlPoints += `<circle cx="${maxX[0]}" cy="${minY[0] + h / 2}" r="7" fill="rgba(0,120,215)" />`;

      controlPoints += `<circle cx="${minX[0] + w / 2}" cy="${minY[0]}" r="5" stroke="white" stroke-width="2" fill="rgba(0,120,215)" />`;
      controlPoints += `<circle cx="${minX[0] + w / 2}" cy="${maxY[0]}" r="5" stroke="white" stroke-width="2" fill="rgba(0,120,215)" />`;
      controlPoints += `<circle cx="${minX[0]}" cy="${minY[0] + h / 2}" r="5" stroke="white" stroke-width="2" fill="rgba(0,120,215)" />`;
      controlPoints += `<circle cx="${maxX[0]}" cy="${minY[0] + h / 2}" r="5" stroke="white" stroke-width="2" fill="rgba(0,120,215)" />`;

      wrapper += controlPoints;
    }

    return wrapper;
  }

  // links the selection rectangle with the current drawing and manages the selected items
  retrieveItemsInRect() {

    let selectionRectangle = this.inProgress.lastElementChild;
    let items = this.drawing.children;

    // selection bounding box
    let selectionBox = selectionRectangle ? selectionRectangle.getBoundingClientRect() : null;
    let boxTopLeft: Point = new Point(selectionBox ? selectionBox.left : -1, selectionBox ? selectionBox.top : -1);
    let boxBottomRight: Point = new Point(selectionBox ? selectionBox.right : -1, selectionBox ? selectionBox.bottom : -1);

    for (let i = 0; i < items.length; i++) {

      // item bounding box
      let itemBox = items[i].getBoundingClientRect();
      let itemTopLeft: Point = new Point(itemBox.left, itemBox.top);
      let itemBottomRight: Point = new Point(itemBox.right, itemBox.bottom);

      // check if the two bounding box are overlapping
      let inside: boolean = Point.rectOverlap(boxTopLeft, boxBottomRight, itemTopLeft, itemBottomRight);

      // item is inside the selection rectangle -> select/unselect accordingly
      if (inside) {
        if (this.inverted) {
          this.selectedItems[i] = this.invertedItems[i] === undefined ? true : this.invertedItems[i];
        } else {
          this.selectedItems[i] = true;
          this.invertedItems[i] = false;
        }
      }
      // item is outside the selection rectangle -> select/unselect accordingly
      else {
        if (this.inverted) {
          this.selectedItems[i] = this.invertedItems[i] === undefined ? false : !this.invertedItems[i];
        } else {
          this.selectedItems[i] = false;
          this.invertedItems[i] = true;
        }
      }
    }
  }

  // Moves the current selection by a number of pixels
  moveSelection(xoff: number, yoff: number) {

    // if there is at least 1 item selected
    if (this.selectedItems.includes(true)) {

      // iterate through all items
      for (let i = 0; i < Math.min(this.selectedItems.length, this.drawing.childElementCount); i++) {

        // ignore those who aren't selected
        if (!this.selectedItems[i]) { continue; }

        // get the current item's translate and add the offsets
        let newX = ElementInfo.translate(this.drawing.children[i]).x + xoff;
        let newY = ElementInfo.translate(this.drawing.children[i]).y + yoff;

        // set the new values
        this.render.setStyle(this.drawing.children[i], "transform", `translate(${newX}px,${newY}px)`);
      }
    }
  }

  // Creates an svg rect that connects the first and last points of currentPath with the rectangle attributes
  createPath(p: Point[]) {

    let s = '';

    //We need at least 2 points
    if (p.length < 2) {
      return s;
    }

    // first and last points
    const p1x = p[0].x;
    const p1y = p[0].y;
    const p2x = p[p.length - 1].x;
    const p2y = p[p.length - 1].y;

    // calculate the width and height of the rectangle
    let w = p2x - p1x;
    let h = p2y - p1y;

    // find top-left corner
    let startX = w > 0 ? p[0].x : p[p.length - 1].x;
    let startY = h > 0 ? p[0].y : p[p.length - 1].y;

    // create a divider
    s = '<g name = "selection-perimeter">';

    // set render attributes for the svg rect
    s += `<rect x="${startX}" y="${startY}"`;
    s += `width="${Math.abs(w)}" height="${Math.abs(h)}"`;

    s += `fill="rgba(${this.inverted ? INVERTED_FILL_COLOR : FILL_COLOR})"`;
    s += `stroke-width="5" stroke="rgba(${this.inverted ? INVERTED_OUTLINE_COLOR : OUTLINE_COLOR})"`;
    s += 'stroke-dasharray="5,5"/>';

    // end the divider
    s += '</g>'

    // can't have rectangle with 0 width or height
    if (w == 0 || h == 0) {
      s = '';
    }

    return s;
  }
}
