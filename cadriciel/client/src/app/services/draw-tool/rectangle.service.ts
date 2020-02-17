import { Injectable } from '@angular/core';
import { FormsAttribute } from '../attributes/attribute-form';
import { ColorPickingService } from '../colorPicker/color-picking.service';
import { KeyboardHandlerService } from '../keyboard-handler/keyboard-handler.service';
import { InteractionService } from '../service-interaction/interaction.service';
import { DrawingTool } from './drawingTool';
import { Point } from './point';

@Injectable({
  providedIn: 'root'
})
export class RectangleService extends DrawingTool {

  isSquare: boolean;
  
  attr: FormsAttribute

  constructor(inProgess: HTMLElement, drawing: HTMLElement, selected: boolean, interaction: InteractionService, colorPick: ColorPickingService) {

    super(inProgess, drawing, selected, interaction, colorPick);
    this.attr = new FormsAttribute(this.defaultValues.DEFAULTPLOTTYPE, this.defaultValues.DEFAULTLINETHICKNESS, this.defaultValues.DEFAULTNUMBERCORNERS)
    this.isSquare = false;
    this.updateColors()
    this.updateAttributes()
  }
  updateAttributes() {
    this.interaction.$formsAttributes.subscribe((obj) => {
      if (obj) {
        this.attr = new FormsAttribute(obj.plotType, obj.lineThickness, obj.numberOfCorners)
      }

    });
  }
  // updating on key change
  update(keyboard: KeyboardHandlerService) {

    // rectangle becomes square when shift is pressed
    this.isSquare = keyboard.shiftDown;

    // real time update
    if (this.isDown) {
      this.updateProgress();
    }
  }

  // mouse down with rectangle in hand
  down(position: Point) {

    // in case we changed tool while the mouse was down
    this.ignoreNextUp = false;

    // the rectangleTool should affect the canvas
    this.isDown = true;

    // add the same point twice in case the mouse doesnt move
    this.currentPath.push(position);
    this.currentPath.push(position);

    this.updateProgress();
  }

  // mouse up with rectangle in hand
  up(position: Point) {

    // in case we changed tool while the mouse was down
    if (!this.ignoreNextUp) {

      // the rectangle should not affect the canvas
      this.isDown = false;

      // add everything to the canvas
      this.updateDrawing();
    }
  }

  // mouse move with rectangle in hand
  move(position: Point) {

    // only if the rectangleTool is currently affecting the canvas
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
    // nothing happens since we might want to readjust the rectangle once back in
  }

  // when we go from outside to inside the canvas
  goingInsideCanvas() {
    // nothing happens since we just update the preview
  }

  // Creates an svg rect that connects the first and last points of currentPath with the rectangle attributes
  createPath(p: Point[]) {

    let s = '';

    if (p.length >= 2) {
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

      // if we need to make it square
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

      // create a divider
      s = '<g name = "rectangle">';

      // get fill and outline stroke attributes from renderMode (outline, fill, outline + fill)
      const stroke = (this.attr.plotType == 0 || this.attr.plotType == 2) ? `${this.chosenColor.secColor}` : 'none';
      const fill = (this.attr.plotType == 1 || this.attr.plotType == 2) ? `${this.chosenColor.primColor}` : 'none';

      // set render attributes for the svg rect
      s += `<rect x="${startX}" y="${startY}"`;
      s += `width="${Math.abs(w)}" height="${Math.abs(h)}"`;

      s += `fill="${fill}"`;
      s += `stroke-width="${this.attr.lineThickness}" stroke="${stroke}"/>`;

      // end the divider
      s += '</g>'

      // can't have rectangle with 0 width or height
      if (w == 0 || h == 0) {
        s = '';
      }
    }

    return s;
  }
}
