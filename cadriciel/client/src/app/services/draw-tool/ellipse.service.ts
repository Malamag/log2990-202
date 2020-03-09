import { Injectable } from '@angular/core';
import { FormsAttribute } from '../attributes/attribute-form';
import { ColorPickingService } from '../colorPicker/color-picking.service';
import { KeyboardHandlerService } from '../keyboard-handler/keyboard-handler.service';
import { InteractionService } from '../service-interaction/interaction.service';
import { Point } from './point';
import { ShapeService } from './shape.service';

@Injectable({
    providedIn: 'root',
})
export class EllipseService extends ShapeService {
    isSquare: boolean;

    attr: FormsAttribute;

    constructor(inProgess: HTMLElement, drawing: HTMLElement, selected: boolean, interaction: InteractionService, colorPick: ColorPickingService) {
        super(inProgess, drawing, selected, interaction, colorPick);
        this.isSquare = false;
    }

    // updating on key change
    updateDown(keyboard: KeyboardHandlerService) {
        // rectangle becomes square when shift is pressed
        this.isSquare = keyboard.shiftDown;

        super.updateDown(keyboard);
    }

    setdimensions(p: Point[]) {
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
        } else {
            // Rectangle
            this.startX = this.width > 0 ? p[0].x : p[p.length - 1].x;
            this.startY = this.height > 0 ? p[0].y : p[p.length - 1].y;
        }
    }

    // Creates an svg rect that connects the first and last points of currentPath with the ellipse attributes and a perimeter
    createPath(p: Point[], removePerimeter: boolean) {
        let s = '';

        // We need at least 2 points
        if (p.length < 2) {
            return s;
        }

        this.setdimensions(p);

        // create a divider for the ellipse
        s += '<g style="transform: translate(0px, 0px);" name = "ellipse">';

        // get fill and outline stroke attributes from renderMode (outline, fill, outline + fill)
        const stroke = this.attr.plotType == 0 || this.attr.plotType == 2 ? `${this.chosenColor.secColor}` : 'none';
        const fill = this.attr.plotType == 1 || this.attr.plotType == 2 ? `${this.chosenColor.primColor}` : 'none';

        // set render attributes for the svg ellipse
        s += `<ellipse cx="${this.startX + Math.abs(this.width / 2)}" cy="${this.startY + Math.abs(this.height / 2)}" rx="${Math.abs(
            this.width / 2,
        )}" ry="${Math.abs(this.height / 2)}"`;
        s += `fill="${fill}"`;
        s += `stroke-width="${this.attr.lineThickness}" stroke="${stroke}"/>`;

        if (!removePerimeter) {
            // create a perimeter
            s += `<rect x="${this.startX}" y="${this.startY}"`;
            s += `width="${Math.abs(this.width)}" height="${Math.abs(this.height)}"`;
            s += 'style="stroke:lightgrey;stroke-width:2;fill-opacity:0.0;stroke-opacity:0.9"';
            s += `stroke-width="${this.attr.lineThickness}" stroke-dasharray="4"/>`;
        }

        // end the divider
        s += '</g>';

        // can't have ellipse with 0 width or height
        if (this.width == 0 || this.height == 0) {
            s = '';
        }

        return s;
    }
}
