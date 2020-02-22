import { Injectable } from '@angular/core';
import { DrawingTool } from './drawingTool';
import { FormsAttribute } from '../attributes/attribute-form';
import { InteractionService } from '../service-interaction/interaction.service';
import { ColorPickingService } from '../colorPicker/color-picking.service';
import { KeyboardHandlerService } from '../keyboard-handler/keyboard-handler.service';
import { Point } from './point';

@Injectable({
  providedIn: 'root'
})
export class ShapeService extends DrawingTool {

  protected attr: FormsAttribute;

  //Shape's dimensions
  protected width:number;
  protected height:number;
  protected smallest:number;  //used for getting the smallest value between height and width

  //First point in x and y when first clicked
  protected startX:number;
  protected startY:number;

  constructor(inProgess: HTMLElement, drawing: HTMLElement, selected: boolean, interaction: InteractionService, colorPick: ColorPickingService) {

    super(inProgess, drawing, selected, interaction, colorPick);
    this.attr = new FormsAttribute(this.defaultValues.DEFAULTPLOTTYPE, this.defaultValues.DEFAULTLINETHICKNESS, this.defaultValues.DEFAULTNUMBERCORNERS);
    this.updateColors();
    this.updateAttributes();
    this.width = 0;
    this.height = 0;
    this.smallest = 0;
    this.startX = 0;
    this.startY = 0;
  }

  updateAttributes() {
    this.interaction.$formsAttributes.subscribe((obj) => {
      if (obj) {  //Getting attributes for a shape
        this.attr = new FormsAttribute(obj.plotType, obj.lineThickness, obj.numberOfCorners);
      }
    });
  }

  // updating on key change
  update(keyboard: KeyboardHandlerService) {

    // real time update
    if (this.isDown) {
      this.updateProgress();
    }
  }

  // mouse down with shape in hand
  down(position: Point) {

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
      this.updateDrawing();
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

  setdimensions(p: Point[]){
    // first and last points
    const p1x = p[0].x;
    const p1y = p[0].y;
    const p2x = p[p.length - 1].x;
    const p2y = p[p.length - 1].y;

    // calculate the width and height of the rectangle
    this.width = p2x - p1x;
    this.height = p2y - p1y;
  }

   // Creates an svg shape
   createPath(p: Point[]) {
      //Shape is only virtual, so we do not create a path
   }

}
