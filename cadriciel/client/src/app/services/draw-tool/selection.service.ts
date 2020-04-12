import { Injectable, Renderer2 } from '@angular/core';
import { ColorPickingService } from '../colorPicker/color-picking.service';
import { KeyboardHandlerService } from '../keyboard-handler/keyboard-handler.service';
import { InteractionService } from '../service-interaction/interaction.service';
import { CanvasInteraction } from './canvas-interaction.service';
import { HtmlSvgFactory } from './html-svg-factory.service';
import { MoveWithArrows } from './move-with-arrows.service';
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
const LEFT_ARROW = 37;
const UP_ARROW = 38;
const RIGHT_ARROW = 39;
const DOWN_ARROW = 40;
const INIT_VALUE = -1;
@Injectable({
    providedIn: 'root',
})
export class SelectionService extends ShapeService {
    render: Renderer2;
    selectedRef: HTMLElement;

    itemUnderMouse: number | null;
    canMoveSelection: boolean;
    foundAnItem: boolean;
    selectedItems: boolean[] = [];
    invertedItems: boolean[] = [];
    movingSelection: boolean;
    canvas: HTMLElement;
    movedSelectionOnce: boolean;
    movedMouseOnce: boolean;
    inverted: boolean;
    wrapperDimensions: [Point, Point] = [new Point(INIT_VALUE, INIT_VALUE), new Point(INIT_VALUE, INIT_VALUE)];

    arrows: [boolean, boolean, boolean, boolean] = [false, false, false, false];
    arrowTimers: [number, number, number, number] = [0, 0, 0, 0];
    singleUseArrows: [boolean, boolean, boolean, boolean] = [false, false, false, false];
    existingLoop: boolean;
    timeCount: number;
    movedSelectionWithArrowsOnce: boolean;

    ARROW_KEY_CODES: [number, number, number, number] = [LEFT_ARROW, UP_ARROW, RIGHT_ARROW, DOWN_ARROW];

    constructor(
        inProgess: HTMLElement,
        drawing: HTMLElement,
        selected: boolean,
        interaction: InteractionService,
        colorPick: ColorPickingService,
        render: Renderer2,
        selection: HTMLElement,
        canvas: HTMLElement,
    ) {
        super(inProgess, drawing, selected, interaction, colorPick);

        this.render = render;
        this.selectedRef = selection;
        this.canvas = canvas;
        this.canMoveSelection = true;
        this.foundAnItem = false;
        this.movingSelection = false;
        this.movedSelectionOnce = false;
        this.movedMouseOnce = false;
        this.inverted = false;
        this.existingLoop = false;
        this.timeCount = 0;
        this.movedSelectionWithArrowsOnce = false;
        MoveWithArrows.loop(this, START_ARROW_DELAY, ARROW_MOVEMENT_DELAY);
        this.selectedRef.style.pointerEvents = 'none'; // ignore the selection bounding box on click

        // whenever a new item is added, link it to a mousedown event to handle single click
        window.addEventListener('newDrawing', (e: Event) => {
            for (let i = 0; i < this.drawing.childElementCount; i++) {
                const EL: Element = this.drawing.children[i];
                let status: string | null;

                try { // in case the getAttribute method is not implemented for the selected item
                    status = EL.getAttribute('isListening');
                } catch (err) {
                    status = null;
                }

                if (status !== 'true') {
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

        // reset on tool change
        window.addEventListener('toolChange', (e: Event) => {
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

    // when a key is pressed
    updateDown(keyboard: KeyboardHandlerService): void {
        // CTRL-A to select all
        const CTRL_A = 65;
        if (keyboard.keyCode === CTRL_A && keyboard.ctrlDown) {
            this.selectedItems = [];
            for (let i = 0; i < this.drawing.children.length; i++) {
                this.selectedItems[i] = true;
            }
            this.selectedRef.innerHTML = CanvasInteraction.createBoundingBox(this);
        }

        // only if a key has not been released
        if (!keyboard.released) {
            for (let i = 0; i < this.ARROW_KEY_CODES.length; i++) {
                this.arrows[i] = keyboard.keyCode === this.ARROW_KEY_CODES[i] ? true : this.arrows[i];
            }
        }
        const POS = 3;
        // to handle single 'click' on arrow keys
        const SINGLE_LEFT = this.arrows[0] && !this.singleUseArrows[0];
        const SINGLE_UP = this.arrows[1] && !this.singleUseArrows[1];
        const SINGLE_RIGHT = this.arrows[2] && !this.singleUseArrows[2];
        const SINGLE_DOWN = this.arrows[POS] && !this.singleUseArrows[POS];

        MoveWithArrows.once(SINGLE_LEFT, SINGLE_UP, SINGLE_RIGHT, SINGLE_DOWN, this);
    }

    // updating on key up
    updateUp(keyCode: number): void {
        // turn off arrows that are no longer pressed and reset their timer for constant movement
        for (let i = 0; i < this.ARROW_KEY_CODES.length; i++) {
            if (keyCode === this.ARROW_KEY_CODES[i]) {
                this.arrows[i] = false;
                this.arrowTimers[i] = 0;
                this.singleUseArrows[i] = false;
            }
        }

        // can only move selection if there is at least one arrow pressed
        this.canMoveSelection = this.arrows.includes(true);

        // save current state for undo-redo if we are done moving the selection
        if (this.movedSelectionWithArrowsOnce && !this.arrows.includes(true)) {
            this.movedSelectionWithArrowsOnce = false;
            this.interaction.emitDrawingDone();
        }
    }

    wheelMove(average : boolean, precise : boolean, clockwise:boolean) : void{
        CanvasInteraction.rotateElements((precise? 1 : 15) * (clockwise? 1 : -1), this, average);
        this.selectedRef.innerHTML = CanvasInteraction.createBoundingBox(this);
        this.interaction.emitDrawingDone();
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
        this.inProgress.innerHTML = '';
    }

    move(position: Point): void {
        // only if the selectionTool is currently affecting the canvas
        if (!this.isDown) {
            return;
        }

        // if we want to move the selection
        if (this.movingSelection) {
            // used for undo-redo
            this.movedSelectionOnce = true;

            const PREVIOUS_MOUSE_POSITION = this.currentPath[this.currentPath.length - 1];
            const OFFSET = new Point(position.x - PREVIOUS_MOUSE_POSITION.x, position.y - PREVIOUS_MOUSE_POSITION.y);

            CanvasInteraction.moveElements(OFFSET.x, OFFSET.y, this);
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
        const START_X = W > 0 ? p[0].x : p[p.length - 1].x;
        const START_Y = H > 0 ? p[0].y : p[p.length - 1].y;

        // create a divider
        s = '<g name = "selection-perimeter">';

        // set render attributes for the svg rect
        const NUM = 5;
        s += HtmlSvgFactory.svgRectangle(
            null,
            null,
            START_X,
            START_Y,
            Math.abs(W),
            Math.abs(H),
            this.inverted ? INVERTED_FILL_COLOR : FILL_COLOR,
            this.inverted ? INVERTED_OUTLINE_COLOR : OUTLINE_COLOR,
            NUM,
            NUM,
        );

        // end the divider
        s += '</g>';

        // can't have rectangle with 0 width or height
        if (W === 0 || H === 0) {
            s = '';
        }

        return s;
    }
}
