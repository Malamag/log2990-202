import { Injectable } from '@angular/core';
import { FormsAttribute } from '../attributes/attribute-form';
import { ColorPickingService } from '../colorPicker/color-picking.service';
import { InteractionService } from '../service-interaction/interaction.service';
import { RectangleService } from './rectangle.service'
import { Point } from './point';

@Injectable({
  providedIn: 'root'
})
export class EllipseService extends RectangleService {

  isSquare: boolean;

  attr: FormsAttribute

  constructor(inProgess: HTMLElement, drawing: HTMLElement, selected: boolean, interaction: InteractionService, colorPick: ColorPickingService) {

    super(inProgess, drawing, selected, interaction, colorPick);
    this.attr = new FormsAttribute(this.defaultValues.DEFAULTPLOTTYPE, this.defaultValues.DEFAULTLINETHICKNESS, this.defaultValues.DEFAULTNUMBERCORNERS)
    this.isSquare = false;
    this.updateColors()
    this.updateAttributes()
  }



  // mouse up with ellipse in hand
  up(position: Point) {

    // in case we changed tool while the mouse was down
    if (!this.ignoreNextUp) {

      // the pencil should not affect the canvas
      this.isDown = false;

      // add everything to the canvas
      this.updateDrawing(true);
    }
  }



  // Creates an svg rect that connects the first and last points of currentPath with the ellipse attributes and a perimeter
  createPath(p: Point[], removePerimeter: boolean) {

    let s = '';
    
    //We need at least 2 points
    if(p.length < 2){
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



    // if we need to make it square (perimeter = square => ellipse = circle)
    if (this.isSquare) {
      // get smallest absolute value between the width and the height
      const smallest = Math.abs(w) < Math.abs(h) ? Math.abs(w) : Math.abs(h);
      // adjust width and height (keep corresponding sign)
      w = smallest * Math.sign(w);
      h = smallest * Math.sign(h);

      // recalculate top-left corner
      startX = w > 0 ? p[0].x : p[0].x - smallest;
      startY = h > 0 ? p[0].y : p[0].y - smallest;
    }

    
    // create a divider for the ellipse
    s += '<g name = "ellipse">';

    // get fill and outline stroke attributes from renderMode (outline, fill, outline + fill)
    const stroke = (this.attr.plotType == 0 || this.attr.plotType == 2) ? `${this.chosenColor.secColor}` : 'none';
    const fill = (this.attr.plotType == 1 || this.attr.plotType == 2) ? `${this.chosenColor.primColor}` : 'none';

    // set render attributes for the svg ellipse
    s += `<ellipse cx="${startX + Math.abs(w / 2)}" cy="${startY + Math.abs(h / 2)}" rx="${Math.abs(w / 2)}" ry="${Math.abs(h / 2)}"`;
    s += `fill="${fill}"`;
    s += `stroke-width="${this.attr.lineThickness}" stroke="${stroke}"/>`;

    if (!removePerimeter) {
      // create a perimeter 
      s += `<rect x="${startX}" y="${startY}"`;
      s += `width="${Math.abs(w)}" height="${Math.abs(h)}"`;
      s += `style="stroke:lightgrey;stroke-width:2;fill-opacity:0.0;stroke-opacity:0.9"`;
      s += `stroke-width="${this.attr.lineThickness}" stroke-dasharray="4"/>`;
    }

    // end the divider
    s += '</g>'

    // can't have ellipse with 0 width or height
    if (w == 0 || h == 0) {
      s = '';
    }

    return s;
  }
}
