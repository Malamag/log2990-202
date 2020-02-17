import { Injectable } from '@angular/core';
import { DrawingTool } from './drawingTool';
import { ColorPickingService } from '../colorPicker/color-picking.service';
import { FormsAttribute } from '../attributes/attribute-form';
import { InteractionService } from '../service-interaction/interaction.service';
import { KeyboardHandlerService } from '../keyboard-handler/keyboard-handler.service';
import { Point } from './point';

@Injectable({
  providedIn: 'root'
})

export class PolygonService extends DrawingTool {
  
  attr: FormsAttribute
  displayPolygon:boolean  //False if polygon is too small

  constructor(inProgess: HTMLElement, drawing: HTMLElement, selected: boolean, interaction: InteractionService, colorPick: ColorPickingService) {
    super(inProgess, drawing, selected, interaction, colorPick);
    this.attr = new FormsAttribute(this.defaultValues.DEFAULTPLOTTYPE, this.defaultValues.DEFAULTLINETHICKNESS, this.defaultValues.DEFAULTNUMBERCORNERS)
    this.updateColors()
    this.updateAttributes()
    this.displayPolygon = false;
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
  // real time update
  if (this.isDown) {
    this.updateProgress();
  }
}

// mouse down with polygon in hand
down(position: Point) {

  // in case we changed tool while the mouse was down
  this.ignoreNextUp = false;

  // the polygon should affect the canvas
  this.isDown = true;

  // adds the same point twice in case the mouse doesn't move
  this.currentPath.push(position);
  this.currentPath.push(position);

  this.updateProgress();
}

  // mouse up with polygon in hand
  up(position: Point) {

    // in case we changed tool while the mouse was down
    if (!this.ignoreNextUp) {

      // the polygon should not affect the canvas
      this.isDown = false;

      // add everything to the canvas
      this.updateDrawing();
    }
  }

  // mouse move with polygon in hand
  move(position: Point) {

    // only if the polygon is currently affecting the canvas
    if (this.isDown) {

      // save mouse position
      this.currentPath.push(position);

      this.updateProgress();
    }
  }

// mouse doubleClick with polygon in hand
doubleClick(position: Point) {
  // since its down -> up -> down -> up -> doubleClick, nothing more happens for the polygon
}

// when we go from inside to outside the canvas
goingOutsideCanvas() {
  // nothing happens since we might want to readjust the polygon once back in
}

// when we go from outside to inside the canvas
goingInsideCanvas() {
  // nothing happens since we just update the preview
}

// Creates an svg polygon that connects the first and last points of currentPath with the rectangle attributes
createPath(p: Point[]) {
  
  let s = '';

  if (p.length >= 2) {

    //Set the polygon's corners
    let corners = this.setCorners(p);
        
    // create a divider
    s = '<g name = "polygon">';

    // set all points used as corners for the polygon
    s += `<polygon points="`;
    for (let i = 0; i < this.attr.numberOfCorners; i++){
      s += ` ${corners[i].x},${corners[i].y}`;
    }

    // get fill and outline stroke attributes from renderMode (outline, fill, outline + fill)
    const stroke = (this.attr.plotType == 0 || this.attr.plotType == 2) ? `${this.chosenColor.secColor}` : 'none';
    const fill = (this.attr.plotType == 1 || this.attr.plotType == 2) ? `${this.chosenColor.primColor}` : 'none';

    s += `" fill="${fill}"`;
    s += `stroke-width="${this.attr.lineThickness}" stroke="${stroke}"/>`;

    // end the divider
    s += '</g>'

    // need to display?
    if (this.displayPolygon == false) {
      s = '';
    }
  }

  return s;
}

setCorners(p:Point[]):Point[]{
  
  // first and last points
  const p1x = p[0].x;
  const p1y = p[0].y;
  const p2x = p[p.length - 1].x;
  const p2y = p[p.length - 1].y;

  // calculate the width and height of the polygon area
  let w = p2x - p1x;
  let h = p2y - p1y;
    
  // we need regular polygons ->
  // get smallest absolute value between the width and the height
  const smallest = Math.abs(w) < Math.abs(h) ? Math.abs(w) : Math.abs(h);

  //Initialize the array of points for the corners of the polygon
  let corners: Point[];
  corners = [];

  //Put the first point inside the array
  corners[0] = new Point(p1x,p1y);

  //Formula for the length of a polygon's side
  const sideLength = smallest*Math.sin(Math.PI/this.attr.numberOfCorners);

  //Initilize values used for determining the other polygon's corners
  let rotateAngle = 0;
  let x;
  let y;
  for (let i = 1; i < this.attr.numberOfCorners; i++){
    //Formula for the outside angles of the polygon
    rotateAngle += (2*Math.PI/this.attr.numberOfCorners);

    //Assigning length for x and y sides depending on the axis
    if(w>0){
      x = corners[i-1].x - sideLength*Math.cos(rotateAngle);
    }
    else{
      x = corners[i-1].x + sideLength*Math.cos(rotateAngle);
    }
    if(h>0){
      y = corners[i-1].y + sideLength*Math.sin(rotateAngle);
    }
    else{
      y = corners[i-1].y - sideLength*Math.sin(rotateAngle);
    }
    //Put new point in the array of corners
    corners[i] = new Point(x,y);
  }

  //can't have rectangle with 0 width or height
  if (w == 0 || h == 0) {
    this.displayPolygon = false;
  }
  else{
    this.displayPolygon = true;
  }

  // Return the array of all the corners of the polygon
  return corners;
  }

}
