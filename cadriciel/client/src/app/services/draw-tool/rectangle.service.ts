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

  constructor(svg:HTMLElement | null, workingSpace:HTMLElement | null,selected:boolean, width:number, primary_color:string,secondary_color:string, renderer: Renderer2, 
    inProgressRef:ElementRef, doneRef:ElementRef){
    super(svg,workingSpace,selected,width,primary_color, renderer, inProgressRef, doneRef);
    this.secondary_color = secondary_color;
    this.isSquare = false;
  }

  update(keyboard:KeyboardHandlerService){

    this.isSquare = keyboard.shiftDown;

    if(this.isDown){
      let d : string = "";
      d+= this.createPath(this.currentPath);
      document.getElementsByName("in-progress")[0].innerHTML = d;
    }
  }

  down(position:Point){
    //mouse down with pencil in hand
    this.isDown = true;

    this.currentPath.push(position);
    this.currentPath.push(position);

    let d : string = "";
    d+= this.createPath(this.currentPath);

    document.getElementsByName("in-progress")[0].innerHTML = d;
  }
  up(position:Point){
    //mouse up with pencil in hand
    this.isDown = false;

    let d : string = "";
    d+= this.createPath(this.currentPath);

    document.getElementsByName("drawing")[0].innerHTML += d;
    document.getElementsByName("in-progress")[0].innerHTML = "";

    this.currentPath = [];
  }
  move(position:Point){
    //mouse move with pencil in hand
    if(this.isDown){
      this.currentPath.push(position);

      let d : string = "";
      d+= this.createPath(this.currentPath);
      
      document.getElementsByName("in-progress")[0].innerHTML = d;
    }
  }
  doubleClick(position:Point){
    //mouse doubleClick with rectangle in hand
  }
  createPath(p:Point[]){

    let p1x = p[0].x;
    let p1y = p[0].y;
    let p2x = p[p.length-1].x;
    let p2y = p[p.length-1].y;

    let w = p2x - p1x;
    let h = p2y - p1y;
    
    let startX = w > 0 ? p[0].x : p[p.length-1].x;
    let startY = h > 0 ? p[0].y : p[p.length-1].y;

    if(this.isSquare){
      let smallest = Math.abs(w) < Math.abs(h)? Math.abs(w) : Math.abs(h);
      w = smallest * Math.sign(w);
      h = smallest * Math.sign(h);

      startX = w > 0 ? p[0].x : p[0].x - smallest;
      startY = h > 0 ? p[0].y : p[0].y - smallest;
    }
    let _s = "<g name = \"rectangle\">";
    _s += `<rect x=\"${startX}\" y=\"${startY}\" width=\"${Math.abs(w)}\" height=\"${Math.abs(h)}\" fill="#${this.primary_color}" stroke-width="3" stroke="#${this.secondary_color}"/>`;
    _s+= "</g>"
    if(w == 0 || h == 0){
      _s = "";
    }
    return _s;
  }
}