import { Injectable, ElementRef, Renderer2 } from '@angular/core';
import { DrawingTool } from './drawingTool';
import { Point } from './point';
import { KeyboardHandlerService } from '../keyboard-handler/keyboard-handler.service';

@Injectable({
  providedIn: 'root'
})
export class LineService extends DrawingTool {

  showJunctions:boolean;
  forcedAngle:boolean;
  currentPos:Point;

  constructor(svg:HTMLElement | null, workingSpace:HTMLElement | null,selected:boolean, width:number, primary_color:string, showJunctions:boolean, renderer: Renderer2, 
    inProgressRef:ElementRef, doneRef:ElementRef){
    super(svg,workingSpace,selected,width,primary_color, renderer, inProgressRef, doneRef);
    this.showJunctions = showJunctions;
    this.forcedAngle = false;
  }

  update(keyboard:KeyboardHandlerService){

    if(this.currentPath.length >= 2){

      if((this.forcedAngle != keyboard.shiftDown) && this.isDown){
        this.forcedAngle = keyboard.shiftDown;
        console.log("redraw with forced");
        let d : string = "";
        d+= this.createPath(this.currentPath,false);
        document.getElementsByName("in-progress")[0].innerHTML = d;
      }
    }



    if(keyboard.keyCode == 8){
      if(this.currentPath.length > 2){
        this.currentPath[this.currentPath.length-2] = this.currentPath[this.currentPath.length-1];
        this.currentPath.pop();

        console.log("delete");

        let d : string = "";
        d+= this.createPath(this.currentPath,false);
        document.getElementsByName("in-progress")[0].innerHTML = d;
      }
    }

    if(keyboard.keyCode == 27){

      this.isDown = false;
      document.getElementsByName("in-progress")[0].innerHTML = "";
      this.currentPath = [];
    }
  }

  down(position:Point, mouseInsideWorkspace:boolean){

    this.clickedInside = mouseInsideWorkspace;
    let x = position.x;
    let y = position.y;

    this.currentPos = position;

    this.currentPath.push(new Point(x,y));
    console.log(mouseInsideWorkspace);
    let d : string = "";

    d+= this.createPath(this.currentPath,false);

    document.getElementsByName("in-progress")[0].innerHTML = d;

    this.isDown = true;
  }
  up(position:Point){
    console.log("up line");
    //mouse up with line in hand
  }
  move(position:Point){
    //mouse move with line in hand
    console.log("move line");

    if(this.isDown){

      this.currentPos = position;

      if(this.currentPath.length < 2){
        this.currentPath.push(position);
      }else{
        this.currentPath[this.currentPath.length-1] = position;
      }
       
      let d : string = "";
      d+= this.createPath(this.currentPath,false);

      document.getElementsByName("in-progress")[0].innerHTML = d;
    }
  }
  doubleClick(position:Point, mouseInsideWorkspace:boolean){
    //mouse doubleClick with line in hand
    if(this.currentPath.length > 1){
      if(mouseInsideWorkspace){

        this.isDown = false;
  
        if(this.currentPath.length >= 2){
          //Down is called twice before we get here
          this.currentPath.pop();
          this.currentPath.pop();
        }
  
        let d : string = "";
        d+= this.createPath(this.currentPath, true);
  
        document.getElementsByName("drawing")[0].innerHTML += "<g name=\"line-segments\">" + d + "</g>";
        document.getElementsByName("in-progress")[0].innerHTML = "";

        this.currentPath = [];

        this.forcedAngle = false;
      }
    }
  }
  createPath(p:Point[], wasDoubleClick:boolean){

    if(this.forcedAngle){

      let x1 = p[p.length-2].x;
      let y1 = p[p.length-2].y;

      let x2 = p[p.length-1].x;
      let y2 = p[p.length-1].y;

      let xDelta = x2-x1;
      let yDelta= y2-y1;

      let angle = Math.atan(Math.abs(yDelta)/Math.abs(xDelta));
      angle = 360 * angle/(2*Math.PI);

      if(xDelta<0){
        angle = 180-angle;
      }
      if(yDelta>0){
        angle =360-angle;
      }

      angle = 45*(Math.round(angle/45));
      if(angle == 360){
        angle = 0;
      }

      if(angle == 180 || angle == 0){
        yDelta = 0;
      }

      if(angle == 90 || angle == 270){
        xDelta = 0;
      }

      if(angle == 45 || angle == 135){
        yDelta = -Math.abs(xDelta);
      }

      if(angle == 225 || angle == 315){
        yDelta = Math.abs(xDelta);
      }

      p[p.length-1] = new Point(x1 + xDelta, y1 + yDelta);
    }else{
      p[p.length-1] = this.currentPos;
    }

    if(wasDoubleClick){
      let dist = Math.sqrt(Math.pow(p[p.length-1].x - p[0].x,2) + Math.pow(p[p.length-1].y - p[0].y,2));

      if(dist <= Math.sqrt(Math.pow(3,2) + Math.pow(3,2))){
        p[p.length -1] = p[0];
      }
    }

    let closeIt : boolean = false;

    if(wasDoubleClick){
      let dist = Math.sqrt(Math.pow(p[p.length-1].x - p[0].x,2) + Math.pow(p[p.length-1].y - p[0].y,2));

      if(dist <= Math.sqrt(Math.pow(3,2) + Math.pow(3,2))){
        closeIt = true;
        //p[p.length -1] = p[0];
      }
    }

    let s = "<path d=\"";
    s+= `M ${p[0].x} ${p[0].y} `;
    for(let i = 1; i < p.length - (closeIt? 1 : 0);i++){
      s+= `L ${p[i].x} ${p[i].y} `;
    }

    if(closeIt){
      s+= "Z";
    }

    s+="\" stroke=\"#" + this.primary_color + "\" stroke-width=\"1\" fill=\"none\" stroke-linecap=\"round\" stroke-linejoin=\"round\" />";

    if(this.showJunctions){
      for(let i = 0; i < p.length - (closeIt? 1 : 0);i++){
        s+=`<circle cx=\"${p[i].x}\" cy=\"${p[i].y}\" r=\"3\" stroke=\"black\" stroke-width=\"0\" fill=\"#${this.primary_color}\" />`;
      }
    }
  
    return s;
  }
}
