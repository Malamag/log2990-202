import { Injectable } from '@angular/core';
import { ColorPickingService } from '../colorPicker/color-picking.service';
import { InteractionService } from '../service-interaction/interaction.service';
import { Point } from './point';
import { ShapeService } from './shape.service';

@Injectable({
    providedIn: 'root',
})
export class PolygonService extends ShapeService {
    // All corners of the polygon
    private corners: Point[];

    // Point for the middle of the perimeter
    private middleX: number;
    private middleY: number;
    // min and max values for x
    private leftPoint: number;
    private rightPoint: number;

    constructor(
        inProgess: HTMLElement,
        drawing: HTMLElement,
        selected: boolean,
        interaction: InteractionService,
        colorPick: ColorPickingService,
    ) {
        super(inProgess, drawing, selected, interaction, colorPick);
        this.leftPoint = 0;
        this.rightPoint = 0;
        this.corners = [];
    }

    // Creates an svg polygon that connects the first and last points of currentPath with the rectangle attributes
    createPath(p: Point[], removePerimeter: boolean): string {
        // We need at least 2 points
        if (p.length < 2) {
            return '';
        }

        this.setdimensions(p);

        // Set the polygon's corners
        this.setCorners(p);

        // create a divider
        this.svgString = '<g name = "polygon" style="transform: translate(0px, 0px);" >';

        // set all points used as corners for the polygon
        this.svgString += '<polygon points="';
        for (let i = 0; i < this.attr.numberOfCorners; i++) {
            this.svgString += ` ${this.corners[i].x},${this.corners[i].y}`;
        }
        // Finish svg string for the points of the polygon
        this.svgString += '"';

        this.setAttributesToPath();

        this.createPerimeter(removePerimeter);

        // end the divider
        this.svgString += '</g>';

        if (this.width === 0 || this.height === 0) {
            return '';
        }

        return this.svgString;
    }

    setdimensions(p: Point[]): void {
        super.setdimensions(p);

        // Assign values of the first mouse down
        this.startX = p[0].x;
        this.startY = p[0].y;

        // we need regular polygons ->
        // get smallest absolute value between the width and the height
        this.smallest = Math.abs(this.width) < Math.abs(this.height) ? Math.abs(this.width) : Math.abs(this.height);

        // Assign the middle point for the polygon
        if (this.width > 0) {
            this.middleX = this.startX + this.smallest / 2;
        } else {
            this.middleX = this.startX - this.smallest / 2;
        }
        if (this.height > 0) {
            this.middleY = this.startY + this.smallest / 2;
        } else {
            this.middleY = this.startY - this.smallest / 2;
        }
    }

    setCorners(p: Point[]): void {
        // Initilize values used for determining the other polygon's corners
        // tslint:disable-next-line: no-magic-numbers
        let rotateAngle = (3 * Math.PI) / 2; // 3PI/2
        let x;
        let y;
        this.leftPoint = this.middleX;
        this.rightPoint = this.middleX;

        for (let i = 0; i < this.attr.numberOfCorners; i++) {
            // Assigning all points of the polygon depending on the axis (where the mouse is dragged)
            if (this.width > 0) {
                x = this.middleX - (this.smallest * Math.cos(rotateAngle)) / 2;
            } else {
                x = this.middleX + (this.smallest * Math.cos(rotateAngle)) / 2;
            }
            if (this.height > 0) {
                y = this.middleY + (this.smallest * Math.sin(rotateAngle)) / 2;
            } else {
                y = this.middleY - (this.smallest * Math.sin(rotateAngle)) / 2;
            }

            // Assigning max and min for x
            if (this.leftPoint < x) {
                this.leftPoint = x;
            } else if (this.rightPoint > x) {
                this.rightPoint = x;
            }

            // Put new point in the array of corners
            this.corners[i] = new Point(x, y);
            rotateAngle += (2 * Math.PI) / this.attr.numberOfCorners;
        }

        this.alignCorners();
    }

    createPerimeter(removePerimeter: boolean): void {
        // width between the max and min values of the points in x
        const WIDTH_PERIMETER = this.leftPoint - this.rightPoint;

        // the lowest point in the canvas in y
        const END_Y_POINT = Math.floor(this.attr.numberOfCorners / 2);
        // height between min and max value of the points in y
        const HEIGHT_PERIMETER = this.startY - this.corners[END_Y_POINT].y;

        // Assign start values of the rectangle depending on where we drag the mouse
        const PER_START_X = this.width > 0 ? this.startX : this.startX - WIDTH_PERIMETER;
        const PER_START_Y = this.height > 0 ? this.startY : this.startY - HEIGHT_PERIMETER;
        if (!removePerimeter) {
            // Create perimeter if mouse is still down
            this.svgString += `<rect x="${PER_START_X}" y="${PER_START_Y}"`;
            this.svgString += `width="${Math.abs(WIDTH_PERIMETER)}" height="${Math.abs(HEIGHT_PERIMETER)}"`;
            this.svgString += 'style="stroke:lightgrey;stroke-width:2;fill-opacity:0.0;stroke-opacity:0.9"';
            this.svgString += `stroke-width="${this.attr.lineThickness}" stroke-dasharray="4"/>`;
        }
    }

    // Align points of the polygon with the area where we drag the mouse
    alignCorners(): void {
        // If the the left point value is smaller than the initial point where the mouse was down,
        // Adjust the position of all the polygon's points
        if (this.leftPoint < this.startX) {
            const OFFSET =  this.startX - this.leftPoint;
            for (const CORNER of this.corners) {
                CORNER.x += OFFSET;
            }
        }
        // If the the right point value is greater than the initial point where the mouse was down,
        // Adjust the position of all the polygon's points
        if (this.rightPoint > this.startX) {
            const OFFSET = this.startX - this.rightPoint;
            for (const CORNER of this.corners) {
                CORNER.x += OFFSET;
            }
        }
    }
}
