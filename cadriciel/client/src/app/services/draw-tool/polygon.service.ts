import { Injectable } from '@angular/core';
import { ColorPickingService } from '../colorPicker/color-picking.service';
import { InteractionService } from '../service-interaction/interaction.service';
import { Point } from './point';
import { ShapeService } from './shape.service';

@Injectable({
  providedIn: 'root'
})

export class PolygonService extends ShapeService {

  private displayPolygon: boolean  // False if polygon is too small

  // Point for the middle of the perimeter
  private middleX: number;
  private middleY: number;
  // min and max values for x
  private leftPoint: number;
  private rightPoint: number;
  // All corners of the polygon
  private corners: Point[];

  constructor(inProgess: HTMLElement, drawing: HTMLElement, selected: boolean,
              interaction: InteractionService, colorPick: ColorPickingService) {
    super(inProgess, drawing, selected, interaction, colorPick);
    this.displayPolygon = false;
    this.leftPoint = 0;
    this.rightPoint = 0;
    this.corners = [];
  }

  // Creates an svg polygon that connects the first and last points of currentPath with the rectangle attributes
  createPath(p: Point[], removePerimeter: boolean) {

    // We need at least 2 points
    if (p.length < 2) {
      return this.svgString;
    }
    
    // Set the polygon's corners
    this.setCorners(p);

    // create a divider
    this.svgString = '<g name = "polygon">';

    // set all points used as corners for the polygon
    this.svgString += '<polygon points="';
    for (let i = 0; i < this.attr.numberOfCorners; i++){
      this.svgString += ` ${this.corners[i].x},${this.corners[i].y}`;
    }

    this.setAttributesToPath();
    // get fill and outline stroke attributes from renderMode (outline, fill, outline + fill)
    //this.stroke = (this.attr.plotType === 0 || this.attr.plotType === 2) ? `${this.chosenColor.secColor}` : 'none';
    //this.fill = (this.attr.plotType === 1 || this.attr.plotType === 2) ? `${this.chosenColor.primColor}` : 'none';

    //this.svgString += `" fill="${this.fill}"`;
    //this.svgString += `stroke-width="${this.attr.lineThickness}" stroke="${this.stroke}"/>`;

    this.createPerimeter(removePerimeter);

    // end the divider
    this.svgString += '</g>'

    // need to display?
    if (!this.displayPolygon) {
      this.svgString = '';
    }
    

    return this.svgString;
  }

  setdimensions(p: Point[]) {

    super.setdimensions(p);

    this.startX = p[0].x;
    this.startY = p[0].y;

    // we need regular polygons ->
    // get smallest absolute value between the width and the height
    this.smallest = Math.abs(this.width) < Math.abs(this.height) ? Math.abs(this.width) : Math.abs(this.height);

    if (this.width > 0) {
      this.middleX = this.startX + this.smallest / 2;
    }
    else {
      this.middleX = this.startX - this.smallest / 2;
    }
    if (this.height > 0) {
      this.middleY = this.startY + this.smallest / 2;
    }
    else {
      this.middleY = this.startY - this.smallest / 2;
    }
  }

  setCorners(p: Point[]) {

    this.setdimensions(p);

    // Initilize values used for determining the other polygon's corners
    let rotateAngle = 3 * Math.PI / 2;
    let x;
    let y;
    this.leftPoint = this.middleX;
    this.rightPoint = this.middleX;
    for (let i = 0; i < this.attr.numberOfCorners; i++){
      // Formula for the outside angles of the polygon : 2*PI/n
      // Assigning length for x and y sides depending on the axis
      if (this.width > 0) {
        x = this.middleX - this.smallest * Math.cos(rotateAngle) / 2;
      }
      else {
        x = this.middleX + this.smallest * Math.cos(rotateAngle) / 2;
      }
      if (this.height > 0) {
        y = this.middleY + this.smallest * Math.sin(rotateAngle) / 2;
      }
      else {
        y = this.middleY - this.smallest * Math.sin(rotateAngle) / 2;
      }

      // Assigning max and min for x
      if (this.leftPoint > x) {
        this.leftPoint = x;
      }
      else if (this.rightPoint < x) {
        this.rightPoint = x;
      }

      // Put new point in the array of corners
      this.corners[i] = new Point(x, y);
      rotateAngle += (2 * Math.PI / this.attr.numberOfCorners);
    }

    // can't have rectangle with 0 width or height
    if (this.width === 0 || this.height === 0) {
      this.displayPolygon = false;
    }
    else {
      this.displayPolygon = true;
    }

    this.alignCorners();
  }

  createPerimeter(removePerimeter: boolean) {
    const WIDTH_PERIMETER = this.rightPoint - this.leftPoint;
    const END_Y_POINT = Math.floor(this.attr.numberOfCorners / 2);
    const HEIGHT_PERIMETER = this.startY - this.corners[END_Y_POINT].y;

    const PER_START_X = this.width > 0 ? this.startX : this.startX - WIDTH_PERIMETER;
    const PER_START_Y = this.height > 0 ? this.startY : this.startY - HEIGHT_PERIMETER;
    if (!removePerimeter) {
    this.svgString += `<rect x="${PER_START_X}" y="${PER_START_Y}"`;
    this.svgString += `width="${Math.abs(WIDTH_PERIMETER)}" height="${Math.abs(HEIGHT_PERIMETER)}"`;
    this.svgString += 'style="stroke:lightgrey;stroke-width:2;fill-opacity:0.0;stroke-opacity:0.9"';
    this.svgString += `stroke-width="${this.attr.lineThickness}" stroke-dasharray="4"/>`;
    }
  }

  alignCorners() {
    if (this.leftPoint > this.startX) {
      const SUBSTACTION_X = this.leftPoint - this.startX;
      for (const corner of this.corners) {
        corner.x -= SUBSTACTION_X;
      }
    }
    if (this.rightPoint < this.startX) {
      const ADDITION_X = this.startX - this.rightPoint;
      for (const corner of this.corners) {
        corner.x += ADDITION_X;
      }
    }
  }

}
