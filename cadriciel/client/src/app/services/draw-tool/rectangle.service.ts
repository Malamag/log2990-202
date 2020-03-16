import { Injectable } from '@angular/core';
import { ColorPickingService } from '../colorPicker/color-picking.service';
import { KeyboardHandlerService } from '../keyboard-handler/keyboard-handler.service';
import { InteractionService } from '../service-interaction/interaction.service';
import { Point } from './point';
import { ShapeService } from './shape.service';

@Injectable({
    providedIn: 'root'
})

export class RectangleService extends ShapeService {

    private isSquare: boolean;

    constructor(inProgess: HTMLElement, drawing: HTMLElement, selected: boolean,
        interaction: InteractionService, colorPick: ColorPickingService) {

        super(inProgess, drawing, selected, interaction, colorPick);
        this.isSquare = false;

    }
    // updating on key change
    updateDown(keyboard: KeyboardHandlerService): void {

        // rectangle becomes square when shift is pressed
        this.isSquare = keyboard.shiftDown;

        super.updateDown(keyboard);
    }

    setdimensions(p: Point[]): void {
        // if we need to make it square
        // find top-left corner

        super.setdimensions(p);

        if (this.isSquare) {
            // get smallest absolute value between the width and the height
            this.smallest = Math.abs(this.width) < Math.abs(this.height) ? Math.abs(this.width) : Math.abs(this.height);
            // adjust width and height (keep corresponding sign)
            this.width = this.smallest * Math.sign(this.width);
            this.height = this.smallest * Math.sign(this.height);

            // recalculate top-left corner
            this.startX = this.width > 0 ? p[0].x : p[0].x - this.smallest;
            this.startY = this.height > 0 ? p[0].y : p[0].y - this.smallest;
        } else {  // Rectangle
            this.startX = this.width > 0 ? p[0].x : p[p.length - 1].x;
            this.startY = this.height > 0 ? p[0].y : p[p.length - 1].y;
        }
    }

    // Creates an svg rect that connects the first and last points of currentPath with the rectangle attributes
    createPath(p: Point[], removePerimeter?: boolean): string {

        this.setdimensions(p);

        if (p.length <= 2) {
            return '';
        }

        // The Rectangle won't display if smaller than 10 -> minValue chosen by ergonomy
        // let MinValue = 10;
        // if (Math.abs(this.width) < MinValue && Math.abs(this.height) < MinValue) {
        //   return '';
        // }

        // create a divider
        this.svgString = '<g name = "rectangle" style="transform: translate(0px, 0px);">';

        // set render attributes for the svg rect
        this.svgString += `<rect x="${this.startX}" y="${this.startY}"`;
        this.svgString += `width="${Math.abs(this.width)}" height="${Math.abs(this.height)}"`;

        this.setAttributesToPath();

        // end the divider
        this.svgString += '</g>';

        // can't have rectangle with 0 width or height
        if (this.width === 0 || this.height === 0) {
            this.svgString = '';
        }

        return this.svgString;
    }
}
