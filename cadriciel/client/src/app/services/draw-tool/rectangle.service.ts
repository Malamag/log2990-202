import { Injectable } from '@angular/core';
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

  constructor(selected:boolean, width:number, primary_color:string,secondary_color:string, renderMode:number,shortcut:number){
    super(selected,width,primary_color,shortcut);
    this.secondary_color = secondary_color;
    this.isSquare = false;
    this.renderMode = renderMode;
  }

  update(keyboard:KeyboardHandlerService){

    this.isSquare = keyboard.shiftDown;

    if(this.isDown){
      this.updateProgress();
    }
  }

  down(position:Point){
    //mouse down with rectangle in hand

    this.ignoreNextUp = false;

    this.isDown = true;

    this.currentPath.push(position);
    this.currentPath.push(position);

    this.updateProgress();
  }
  up(position:Point){
    //mouse up with rectangle in hand
    
    if(!this.ignoreNextUp){
      this.isDown = false;

      this.updateDrawing();
    }
  }
  move(position:Point){
    //mouse move with rectangle in hand

    if(this.isDown){
      this.currentPath.push(position);
      
      this.updateProgress();
    }
  }
  doubleClick(position:Point){
    //mouse doubleClick with rectangle in hand -> nothing happens
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

    let stroke = (this.renderMode == 0 || this.renderMode == 2) ? `#${this.secondary_color}` : "none";
    let fill = (this.renderMode == 1 || this.renderMode == 2)?  `#${this.primary_color}`: "none";

    _s += `<rect x=\"${startX}\" y=\"${startY}\" width=\"${Math.abs(w)}\" height=\"${Math.abs(h)}\" fill="${fill}" stroke-width="${this.width}" stroke="${stroke}"/>`;
    _s+= "</g>"
    if(w == 0 || h == 0){
      _s = "";
    }
    return _s;
  }
}