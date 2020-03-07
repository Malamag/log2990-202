import { Injectable } from '@angular/core';
import { FormsAttribute } from '../attributes/attribute-form';
import { ColorPickingService } from '../colorPicker/color-picking.service';
import { KeyboardHandlerService } from '../keyboard-handler/keyboard-handler.service';
import { InteractionService } from '../service-interaction/interaction.service';
import { Point } from './point';
import { ShapeService } from './shape.service';

@Injectable({
  providedIn: 'root'
})

export class EllipseService extends ShapeService {

  isSquare: boolean;

  attr: FormsAttribute
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

  // updating on key up
  updateUp(keyCode : number) {
      // nothing happens for ellipse tool
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

  // updating on key change
  /*update(keyboard: KeyboardHandlerService) {

    // rectangle becomes square when shift is pressed
    this.isSquare = keyboard.shiftDown;

    super.update(keyboard);
  }*/


  // Creates an svg rect that connects the first and last points of currentPath with the ellipse attributes and a perimeter
  createPath(p: Point[], removePerimeter: boolean) {

    this.svgString = '';

    this.setdimensions(p);

    //The Ellipse won't display if smaller than 10 -> minValue chosen by ergonomy
    let MinValue = 10;
    if (Math.abs(this.width) < MinValue && Math.abs(this.height) < MinValue) {
      return '';
    } 
    //For eliminating bug with large lineThickness and small area
    MinValue = this.attr.lineThickness;
    if ((this.attr.plotType !== 1) && Math.abs(this.width) < MinValue && Math.abs(this.height) < MinValue) {
      return '';
    }   
    
    // create a divider for the ellipse
    this.svgString += '<g name = "ellipse" style="transform: translate(0px, 0px);">';

    // set render attributes for the svg ellipse
    this.svgString += `<ellipse cx="${this.startX + Math.abs(this.width / 2)}" cy="${this.startY + Math.abs(this.height / 2)}" rx="${Math.abs(this.width / 2)}" ry="${Math.abs(this.height / 2)}"`;
    
    this.setAttributesToPath();    

    if (!removePerimeter) {
      // create a perimeter
      let perStartX = this.startX;
      let perStartY = this.startY;
      let perWidth = Math.abs(this.width);
      let perHeight = Math.abs(this.height);
      if(this.attr.plotType !== 1){
        perStartX -= this.attr.lineThickness/2;
        perStartY -= this.attr.lineThickness/2;
        perWidth += this.attr.lineThickness;
        perHeight += this.attr.lineThickness;
      }
      this.svgString += `<rect x="${perStartX}" y="${perStartY}"`;
      this.svgString += `width="${perWidth}" height="${perHeight}"`;
      this.svgString += 'style="stroke:lightgrey;stroke-width:2;fill-opacity:0.0;stroke-opacity:0.9"';
      this.svgString += `stroke-width="${this.attr.lineThickness}" stroke-dasharray="4"/>`;
    }

    // end the divider
    this.svgString += '</g>'

    // can't have ellipse with 0 width or height
    if (this.width === 0 || this.height === 0) {
      this.svgString = '';
    }

    return this.svgString;
  }
}
