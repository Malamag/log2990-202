import { Injectable } from '@angular/core';
//import { DrawingTool } from './drawingTool';
import { ColorPickingService } from '../colorPicker/color-picking.service';
import { FormsAttribute } from '../attributes/attribute-form';
import { InteractionService } from '../service-interaction/interaction.service';
import { KeyboardHandlerService } from '../keyboard-handler/keyboard-handler.service';
import { Point } from './point';
import { RectangleService } from './rectangle.service';

@Injectable({
  providedIn: 'root'
})

export class PolygonService extends RectangleService {
  
  attr: FormsAttribute
  private displayPolygon:boolean  //False if polygon is too small
  private width:number;
  private height:number;
  private smallest:number;
  private startX:number;
  private startY:number;
  private corners:Point[];

  constructor(inProgess: HTMLElement, drawing: HTMLElement, selected: boolean, interaction: InteractionService, colorPick: ColorPickingService) {
    super(inProgess, drawing, selected, interaction, colorPick);
    this.attr = new FormsAttribute(this.defaultValues.DEFAULTPLOTTYPE, this.defaultValues.DEFAULTLINETHICKNESS, this.defaultValues.DEFAULTNUMBERCORNERS)
    this.updateColors()
    this.updateAttributes()
    this.displayPolygon = false;
    this.width = 0;
    this.height = 0;
    this.smallest = 0;
    this.startX = 0;
    this.startY = 0;
    this.corners = [];
  }
  
  // updating on key change
  update(keyboard: KeyboardHandlerService) {
    // real time update
    if (this.isDown) {
      this.updateProgress();
    }
  }

  // Creates an svg polygon that connects the first and last points of currentPath with the rectangle attributes
  createPath(p: Point[]) {
    
    let s = '';

    if (p.length >= 2) {

      //Set the polygon's corners
      this.setCorners(p);
          
      // create a divider
      s = '<g name = "polygon">';
      
      // set all points used as corners for the polygon
      s += `<polygon points="`;
      for (let i = 0; i < this.attr.numberOfCorners; i++){
        s += ` ${this.corners[i].x},${this.corners[i].y}`;
      }

      // get fill and outline stroke attributes from renderMode (outline, fill, outline + fill)
      const stroke = (this.attr.plotType == 0 || this.attr.plotType == 2) ? `${this.chosenColor.secColor}` : 'none';
      const fill = (this.attr.plotType == 1 || this.attr.plotType == 2) ? `${this.chosenColor.primColor}` : 'none';

      s += `" fill="${fill}"`;
      s += `stroke-width="${this.attr.lineThickness}" stroke="${stroke}"/>`;

      s += this.createPerimeter();

      // end the divider
      s += '</g>'

      // need to display?
      if (this.displayPolygon == false) {
        s = '';
      }
    }

    return s;
  }

  setCorners(p:Point[]){
    
    // first and last points
    this.startX = p[0].x;
    this.startY = p[0].y;
    const endX = p[p.length - 1].x;
    const endY = p[p.length - 1].y;

    // calculate the width and height of the polygon area
    this.width = endX - this.startX;
    this.height = endY - this.startY;

    // we need regular polygons ->
    // get smallest absolute value between the width and the height
    this.smallest = Math.abs(this.width) < Math.abs(this.height) ? Math.abs(this.width) : Math.abs(this.height);

    //Put the first point inside the array
    this.corners[0] = new Point(this.startX,this.startY);

    //Calculating the circle area diameter outside the square perimeter
    //const diameter = Math.sqrt((this.smallest*this.smallest)+(this.smallest*this.smallest));
    //const diameter = this.smallest*(Math.sqrt(this.attr.numberOfCorners));
    //const diameter = this.smallest*Math.cos(Math.PI/this.attr.numberOfCorners);
    //Formula for the length of a polygon's side
    //const sideLength = this.smallest*Math.tan(Math.PI/this.attr.numberOfCorners);
    const sideLength = this.smallest*Math.sin(Math.PI/this.attr.numberOfCorners);

    //Initilize values used for determining the other polygon's corners
    let rotateAngle = 0;
    let x;
    let y;
    for (let i = 1; i < this.attr.numberOfCorners; i++){
      //Formula for the outside angles of the polygon
      rotateAngle += (2*Math.PI/this.attr.numberOfCorners);

      //Assigning length for x and y sides depending on the axis
      if(this.width > 0){
        x = this.corners[i-1].x - sideLength*Math.cos(rotateAngle);
      }
      else{
        x = this.corners[i-1].x + sideLength*Math.cos(rotateAngle);
      }
      if(this.height > 0){
        y = this.corners[i-1].y + sideLength*Math.sin(rotateAngle);
      }
      else{
        y = this.corners[i-1].y - sideLength*Math.sin(rotateAngle);
      }
      //Put new point in the array of corners
      this.corners[i] = new Point(x,y);
    }

    //can't have rectangle with 0 width or height
    if (this.width == 0 || this.height == 0) {
      this.displayPolygon = false;
    }
    else{
      this.displayPolygon = true;
    }

    this.alignCorners();
  }

  createPerimeter():string{
    let sPerimeter = "";
    //if (!removePerimeter) {
    // create a perimeter 
    let perStartX = this.width > 0 ? this.startX : this.startX - this.smallest;
    let perStartY = this.height > 0 ? this.startY : this.startY - this.smallest;

    sPerimeter += `<rect x="${perStartX}" y="${perStartY}"`;
    sPerimeter += `width="${Math.abs(this.smallest)}" height="${Math.abs(this.smallest)}"`;
    sPerimeter += `style="stroke:lightgrey;stroke-width:2;fill-opacity:0.0;stroke-opacity:0.9"`;
    sPerimeter += `stroke-width="${this.attr.lineThickness}" stroke-dasharray="4"/>`;
  //}
    return sPerimeter;
  }

  alignCorners(){
    if (this.width > 0){
      let leftCorner = this.startX;
      for(let i = 0; i < this.corners.length; i++){
        if (this.corners[i].x < leftCorner){
          leftCorner = this.corners[i].x;
        }
      }
      for(let i = 0; i < this.corners.length; i++){
        this.corners[i].x += this.startX - leftCorner;
      }
    }
    else{
      let rightCorner = this.startX;
      for(let i = 0; i < this.corners.length; i++){
        if (this.corners[i].x > rightCorner){
          rightCorner = this.corners[i].x;
        }
      }
      for(let i = 0; i < this.corners.length; i++){
        this.corners[i].x += this.startX - rightCorner;
      }
    }
    return this.corners;
  }
}