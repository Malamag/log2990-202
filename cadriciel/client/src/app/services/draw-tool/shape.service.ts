import { Injectable } from '@angular/core';
import { FormsAttribute } from '../attributes/attribute-form';
import { ColorPickingService } from '../colorPicker/color-picking.service';
import { KeyboardHandlerService } from '../keyboard-handler/keyboard-handler.service';
import { InteractionService } from '../service-interaction/interaction.service';
import { DrawingTool } from './drawingTool';
import { Point } from './point';

const DEFAULTPLOTTYPE = 2;
const DEFAULTNUMBERCORNERS = 3;
const DEFAULTLINETHICKNESS = 5;
@Injectable({
    providedIn: 'root',
})
export class ShapeService extends DrawingTool {
    attr: FormsAttribute;

    // Shape's dimensions
    width: number;
    height: number;
    smallest: number; // used for getting the smallest value between height and width

    // First point in x and y when first clicked
    startX: number;
    startY: number;

    constructor(inProgess: HTMLElement, drawing: HTMLElement, selected: boolean, interaction: InteractionService, colorPick: ColorPickingService) {
        super(inProgess, drawing, selected, interaction, colorPick);
        this.attr = {plotType: DEFAULTPLOTTYPE, lineThickness: DEFAULTLINETHICKNESS, numberOfCorners: DEFAULTNUMBERCORNERS}
        this.updateColors();
        this.updateAttributes();
        this.width = 0;
        this.height = 0;
        this.smallest = 0;
        this.startX = 0;
        this.startY = 0;
    }

    updateAttributes() {
        this.interaction.$formsAttributes.subscribe( (obj) => {
            if (obj) {
                // Getting attributes for a shape
                this.attr = {plotType: obj.plotType, lineThickness: obj.lineThickness, numberOfCorners: obj.numberOfCorners};
            }
        });
    }

    // updating on key change
    updateDown(keyboard: KeyboardHandlerService) {
        // real time update
        if (this.isDown) {
            this.updateProgress();
        }
    }

    // updating on key up
    updateUp(keyCode : number) {
        // nothing happens for global shape
    }

    // mouse down with shape in hand
    down(position: Point, insideWorkspace?:boolean, isRightClick? : boolean) {
        // in case we changed tool while the mouse was down
        this.ignoreNextUp = false;

        // the shape should affect the canvas
        this.isDown = true;

        // add the same point twice in case the mouse doesnt move
        this.currentPath.push(position);
        this.currentPath.push(position);

        this.updateProgress();
    }

    // mouse up with shape in hand
    up(position: Point) {
        // in case we changed tool while the mouse was down
        if (!this.ignoreNextUp) {
            // the shape should not affect the canvas
            this.isDown = false;

            // add everything to the canvas
            this.updateDrawing(true);
        }
    }

    // mouse move with shape in hand
    move(position: Point) {
        // only if the shapeTool is currently affecting the canvas
        if (this.isDown) {
            // save mouse position
            this.currentPath.push(position);

            this.updateProgress();
        }
    }

    // mouse doubleClick with rectangle in hand
    doubleClick(position: Point) {
        // since its down -> up -> down -> up -> doubleClick, nothing more happens for the rectangle
    }

    // when we go from inside to outside the canvas
    goingOutsideCanvas() {
        // nothing happens since we might want to readjust the shape once back in
    }

    // when we go from outside to inside the canvas
    goingInsideCanvas() {
        // nothing happens since we just update the preview
    }

    setdimensions(p: Point[]) {
        // first and last points
        const P1X = p[0].x;
        const P1Y = p[0].y;
        const P2X = p[p.length - 1].x;
        const P2Y = p[p.length - 1].y;

        // calculate the width and height of the rectangle
        this.width = P2X - P1X;
        this.height = P2Y - P1Y;
    }

    // Creates an svg shape
    createPath(p: Point[], removePerimeter?: boolean) {
        // Shape is only virtual, so we do not create a path
    }
}
