import { Injectable, ElementRef, Renderer2 } from '@angular/core';
import { DrawingTool } from './drawingTool';
import { Point } from './point';
import { KeyboardHandlerService } from '../keyboard-handler/keyboard-handler.service';

@Injectable({
  providedIn: 'root'
})
export class RectangleService extends DrawingTool {

  secondary_color:string;
  isSquare:boolean;
  renderMode:number;

  constructor(selected:boolean, width:number, primary_color:string,secondary_color:string, renderMode:number,shortcut:number, inProgressRef: ElementRef, drawingRef: ElementRef, renderer: Renderer2){

    super(selected,width,primary_color,shortcut, inProgressRef, drawingRef, renderer);

    this.secondary_color = secondary_color;
    this.isSquare = false;
    this.renderMode = renderMode;
  }

  //updating on key change
  update(keyboard:KeyboardHandlerService){

    //rectangle becomes square when shift is pressed
    this.isSquare = keyboard.shiftDown;

    //real time update
    if(this.isDown){
      this.updateProgress();
    }
  }

  //mouse down with rectangle in hand
  down(position:Point){

    //in case we changed tool while the mouse was down
    this.ignoreNextUp = false;

    //the rectangleTool should affect the canvas
    this.isDown = true;

    //add the same point twice in case the mouse doesnt move
    this.currentPath.push(position);
    this.currentPath.push(position);

    this.updateProgress();
  }

  //mouse up with rectangle in hand
  up(position:Point){
    
    //in case we changed tool while the mouse was down
    if(!this.ignoreNextUp){

      //the pencil should not affect the canvas
      this.isDown = false;

      //add everything to the canvas
      this.updateDrawing();
    }
  }

  //mouse move with rectangle in hand
  move(position:Point){

    //only if the rectangleTool is currently affecting the canvas
    if(this.isDown){

      //save mouse position
      this.currentPath.push(position);
      
      this.updateProgress();
    }
  }

  //mouse doubleClick with pencil in hand
  doubleClick(position:Point){
    //since its down -> up -> down -> up -> doubleClick, nothing more happens for the renctangle
  }

  //Creates an svg rect that connects the first and last points of currentPath with the rectangle attributes
  createPath(p:Point[]){

    //first and last points
    let p1x = p[0].x;
    let p1y = p[0].y;
    let p2x = p[p.length-1].x;
    let p2y = p[p.length-1].y;

    //calculate the width and height of the rectangle
    let w = p2x - p1x;
    let h = p2y - p1y;
    
    //find top-left corner
    let startX = w > 0 ? p[0].x : p[p.length-1].x;
    let startY = h > 0 ? p[0].y : p[p.length-1].y;

    //if we need to make it square
    if(this.isSquare){
      //get smallest absolute value between the width and the height
      let smallest = Math.abs(w) < Math.abs(h)? Math.abs(w) : Math.abs(h);
      //adjust width and height (keep corresponding sign)
      w = smallest * Math.sign(w);
      h = smallest * Math.sign(h);

      //recalculate top-left corner
      startX = w > 0 ? p[0].x : p[0].x - smallest;
      startY = h > 0 ? p[0].y : p[0].y - smallest;
    }

    //create a divider
    let s : string = '<g name = "rectangle">';

    //get fill and outline stroke attributes from renderMode (outline, fill, outline + fill)
    let stroke = (this.renderMode == 0 || this.renderMode == 2) ? `#${this.secondary_color}` : "none";
    let fill = (this.renderMode == 1 || this.renderMode == 2) ? `#${this.primary_color}`: "none";

    //set render attributes for the svg rect
    s += `<rect x="${startX}" y="${startY}"`;
    s += `width="${Math.abs(w)}" height="${Math.abs(h)}"`;
    s += `fill="${fill}"`;
    s += `stroke-width="${this.width}" stroke="${stroke}"/>`;

    //end the divider
    s += "</g>"

    return s;
  }
}