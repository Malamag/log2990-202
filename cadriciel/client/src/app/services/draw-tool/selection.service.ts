import { Injectable, Renderer2 } from '@angular/core';
import { ColorPickingService } from '../colorPicker/color-picking.service';
import { InteractionService } from '../service-interaction/interaction.service';
import { Point } from './point';
import { KeyboardHandlerService } from '../keyboard-handler/keyboard-handler.service';
import { ShapeService } from './shape.service';
import { HtmlSvgFactory } from './html-svg-factory.service';
import { CanvasInteraction } from './canvas-interaction.service';
import { MoveWithArrows } from './move-with-arrows.service';

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

  itemUnderMouse: number | null;
  canMoveSelection: boolean = true;
  foundAnItem: boolean = false;
  selectedItems: boolean[] = [];
  invertedItems: boolean[] = [];
  movingSelection: boolean = false;
  canvas: HTMLElement
  movedSelectionOnce: boolean = false;
  movedMouseOnce: boolean = false;
  inverted: boolean = false;
  wrapperDimensions: [Point, Point] = [new Point(-1, -1), new Point(-1, -1)];

  arrows: [boolean, boolean, boolean, boolean] = [false, false, false, false];
  arrowTimers: [number, number, number, number] = [0, 0, 0, 0];
  singleUseArrows: [boolean, boolean, boolean, boolean] = [false, false, false, false];
  existingLoop: boolean = false;
  timeCount: number = 0;
  movedSelectionWithArrowsOnce: boolean = false;

  ARROW_KEY_CODES: [number, number, number, number] = [37, 38, 39, 40];

  constructor(inProgess: HTMLElement, drawing: HTMLElement, selected: boolean, interaction: InteractionService,
    colorPick: ColorPickingService, render: Renderer2, selection: HTMLElement, canvas: HTMLElement) {
    super(inProgess, drawing, selected, interaction, colorPick);

    this.render = render;
    this.selectedRef = selection;
    this.canvas = canvas;

    MoveWithArrows.loop(this, START_ARROW_DELAY, ARROW_MOVEMENT_DELAY);
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
        this.selectedRef.innerHTML = CanvasInteraction.createBoundingBox(this);
      }
      this.selectedItems = [];
      this.invertedItems = [];
      this.itemUnderMouse = null;
      this.foundAnItem = false;
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
      this.selectedRef.innerHTML = CanvasInteraction.createBoundingBox(this);
    }

    if (!keyboard.released) {
      for (let i = 0; i < this.ARROW_KEY_CODES.length; i++) {
        this.arrows[i] = keyboard.keyCode === this.ARROW_KEY_CODES[i] ? true : this.arrows[i];
      }
    }

    let singleLeft = this.arrows[0] && !this.singleUseArrows[0];
    let singleUp = this.arrows[1] && !this.singleUseArrows[1];
    let singleRight = this.arrows[2] && !this.singleUseArrows[2];
    let singleDown = this.arrows[3] && !this.singleUseArrows[3];

    MoveWithArrows.once(singleLeft, singleUp, singleRight, singleDown, this);
  }

  // updating on key up
  updateUp(keyCode: number) {

    for (let i = 0; i < this.ARROW_KEY_CODES.length; i++) {
      if (keyCode == this.ARROW_KEY_CODES[i]) {
        this.arrows[i] = false;
        this.arrowTimers[i] = 0;
        this.singleUseArrows[i] = false;
      }
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

    this.selectedRef.innerHTML = CanvasInteraction.createBoundingBox(this);

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

      CanvasInteraction.moveElements(offset.x, offset.y, this);
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
        CanvasInteraction.retrieveItemsInRect(this.inProgress, this.drawing, this.selectedItems, this.invertedItems, this.inverted);
      }

      this.updateProgress();
    }

    this.selectedRef.innerHTML = CanvasInteraction.createBoundingBox(this);
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
    s += HtmlSvgFactory.svgRectangle(null, null, startX, startY, Math.abs(w), Math.abs(h),
      this.inverted ? INVERTED_FILL_COLOR : FILL_COLOR,
      this.inverted ? INVERTED_OUTLINE_COLOR : OUTLINE_COLOR, 5, 5);

    // end the divider
    s += '</g>'

    // can't have rectangle with 0 width or height
    if (w == 0 || h == 0) {
      s = '';
    }

    return s;
  }
}
