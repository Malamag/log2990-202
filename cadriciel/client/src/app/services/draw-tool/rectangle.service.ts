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

  constructor(_svg:HTMLElement | null, _workingSpace:HTMLElement | null,mouseX:number,mouseY:number,selected:boolean, width:number, primary_color:string,secondary_color:string){
    super(_svg,_workingSpace, mouseX, mouseY,selected,width,primary_color);
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

  down(){
    //mouse down with pencil in hand
    if(this.mouseX - this._svgBox.left + (this._workingSpace? this._workingSpace.scrollLeft : 0) >= this._svgBox.left && this.mouseY - this._svgBox.top + (this._workingSpace? this._workingSpace.scrollTop : 0) >= this._svgBox.top){
      this.startedInsideWorkSpace = true;
    }else{
      this.startedInsideWorkSpace = false;
    }
    if(this.startedInsideWorkSpace){
      console.log("-----CLICKED WITH RECTANGLE-----");
      this.isDown = true;
      this.currentX = this.mouseX - this._svgBox.left + (this._workingSpace? this._workingSpace.scrollLeft : 0);
      this.currentY = this.mouseY - this._svgBox.top + (this._workingSpace? this._workingSpace.scrollTop : 0);
      this.currentPath.push(new Point(this.currentX,this.currentY));
      this.currentPath.push(new Point(this.currentX,this.currentY));
      let d : string = "";
      d+= this.createPath(this.currentPath);
      /*
      if(this._svg){
        
      }*/
      document.getElementsByName("in-progress")[0].innerHTML = d;
    }
  }
  up(){
    //mouse up with pencil in hand
    if(this.startedInsideWorkSpace){
      console.log("-----RELEASED RECTANGLE-----");
      this.isDown = false;
      let d : string = "";
      d+= this.createPath(this.currentPath);
      document.getElementsByName("drawing")[0].innerHTML += d;
      document.getElementsByName("in-progress")[0].innerHTML = "";
      this.currentPath = [];
    }
  }
  move(){
    //mouse move with pencil in hand
    if(this.startedInsideWorkSpace){
      this.currentX = this.mouseX - this._svgBox.left + (this._workingSpace? this._workingSpace.scrollLeft : 0);
      this.currentY = this.mouseY - this._svgBox.top + (this._workingSpace? this._workingSpace.scrollTop : 0);

      if(this.isDown){
        this.currentPath.push(new Point(this.currentX, this.currentY));
        let d : string = "";
        d+= this.createPath(this.currentPath);
        document.getElementsByName("in-progress")[0].innerHTML = d;
      }
    }
  }
  doubleClick(){
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