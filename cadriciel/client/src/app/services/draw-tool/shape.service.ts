import { Injectable } from '@angular/core';
import { FormsAttribute } from '../attributes/attribute-form';
import { ColorPickingService } from '../colorPicker/color-picking.service';
import { KeyboardHandlerService } from '../keyboard-handler/keyboard-handler.service';
import { InteractionService } from '../service-interaction/interaction.service';
import { DrawingTool } from './drawing-tool';
import { Point } from './point';

// Default attributes of shapes
const DEFAULTPLOTTYPE = 2;
const DEFAULTNUMBERCORNERS = 3;
const DEFAULTLINETHICKNESS = 5;

@Injectable({
    providedIn: 'root'
})

export class ShapeService extends DrawingTool {

    protected attr: FormsAttribute;

    // Shape's dimensions
    protected width: number;
    protected height: number;
    protected smallest: number;  // used for getting the smallest value between height and width

    // First point in x and y when first clicked
    protected startX: number;
    protected startY: number;

    // String for createPath
    protected svgString: string;

    // Attribute for createPath
    protected stroke: string;
    protected fill: string;

    constructor(inProgess: HTMLElement, drawing: HTMLElement, selected: boolean,
        interaction: InteractionService, colorPick: ColorPickingService) {

        super(inProgess, drawing, selected, interaction, colorPick);
        this.attr = { plotType: DEFAULTPLOTTYPE, lineThickness: DEFAULTLINETHICKNESS, numberOfCorners: DEFAULTNUMBERCORNERS };
        this.updateColors();
        this.updateAttributes();
        this.width = 0;
        this.height = 0;
        this.smallest = 0;
        this.startX = 0;
        this.startY = 0;
        this.svgString = '';
        this.stroke = '';
        this.fill = '';
    }

    updateAttributes(): void {
        this.interaction.$formsAttributes.subscribe((obj: FormsAttribute) => {
            if (obj) {
                // Getting attributes for a shape
                this.attr = { plotType: obj.plotType, lineThickness: obj.lineThickness, numberOfCorners: obj.numberOfCorners };
            }
        });
    }

    // updating on key down
    updateDown(keyboard: KeyboardHandlerService): void {
        // real time update
        if (this.isDown) {
            this.updateProgress();
        }
    }

    // updating on key up
    updateUp(keyCode: number): void {
        // nothing happens for global shape
    }

    // mouse down with shape in hand
    down(position: Point, insideWorkspace?: boolean, isRightClick?: boolean): void {

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
    up(position: Point): void {

        // in case we changed tool while the mouse was down
        if (!this.ignoreNextUp) {

            // the shape should not affect the canvas
            this.isDown = false;

            // add everything to the canvas
            this.updateDrawing(true);
        }
    }

    // mouse move with shape in hand
    move(position: Point): void {

        // only if the shapeTool is currently affecting the canvas
        if (this.isDown) {

            // save mouse position
            this.currentPath.push(position);

            this.updateProgress();
        }
    }

    // mouse doubleClick with rectangle in hand
    doubleClick(position: Point): void {
        // since its down -> up -> down -> up -> doubleClick, nothing more happens for the rectangle
    }

    // when we go from inside to outside the canvas
    goingOutsideCanvas(): void {
        // nothing happens since we might want to readjust the shape once back in
    }

    // when we go from outside to inside the canvas
    goingInsideCanvas(): void {
        // nothing happens since we just update the preview
    }

    setdimensions(p: Point[]): void {
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
    createPath(p: Point[], removePerimeter?: boolean): void {
        // Shape is only virtual, so we do not create a path
    }

    setAttributesToPath(): void {
        // get fill and outline stroke attributes from renderMode (outline, fill, outline + fill)
        this.stroke = (this.attr.plotType === 0 || this.attr.plotType === 2) ? `${this.chosenColor.secColor}` : 'none';
        this.fill = (this.attr.plotType === 1 || this.attr.plotType === 2) ? `${this.chosenColor.primColor}` : 'none';

        this.svgString += ` fill="${this.fill}"`;
        this.svgString += ` stroke-width="${this.attr.lineThickness}" stroke="${this.stroke}"/>`;

    }

}
