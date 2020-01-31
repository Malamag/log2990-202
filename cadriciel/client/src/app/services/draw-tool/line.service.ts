import { Injectable } from '@angular/core';
import { DrawingTool } from './drawingTool';
import { Point } from './point';
import { KeyboardHandlerService } from '../keyboard-handler/keyboard-handler.service';

@Injectable({
  providedIn: 'root'
})
export class LineService extends DrawingTool {

  showJunctions:boolean;
  forcedAngle:boolean;

  constructor(_svg:HTMLElement | null, _workingSpace:HTMLElement | null,mouseX:number,mouseY:number,selected:boolean, width:number, primary_color:string, showJunctions:boolean){
    super(_svg,_workingSpace, mouseX, mouseY,selected,width,primary_color);
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

  down(){
    //mouse down with line in hand



    if(this.mouseX - this._svgBox.left + (this._workingSpace? this._workingSpace.scrollLeft : 0) >= this._svgBox.left && this.mouseY - this._svgBox.top + (this._workingSpace? this._workingSpace.scrollTop : 0) >= this._svgBox.top){
      this.clickedInside = true;
      console.log("-----CLICKED WITH LINE-----");
      this.currentX = this.mouseX - this._svgBox.left + (this._workingSpace? this._workingSpace.scrollLeft : 0);
      this.currentY = this.mouseY - this._svgBox.top + (this._workingSpace? this._workingSpace.scrollTop : 0);
      this.currentPath.push(new Point(this.currentX,this.currentY));
      let d : string = "";

      d+= this.createPath(this.currentPath,false);

      /*
      if(this._svg){
        
      }*/

      document.getElementsByName("in-progress")[0].innerHTML = d;

      console.log(this.currentPath);

      this.isDown = true;

    }else{
      this.clickedInside = false;
    }
  }
  up(){
    //mouse up with line in hand
  }
  move(){
    //mouse move with line in hand

    if(this.isDown){
      this.currentX = this.mouseX - this._svgBox.left + (this._workingSpace? this._workingSpace.scrollLeft : 0);
      this.currentY = this.mouseY - this._svgBox.top + (this._workingSpace? this._workingSpace.scrollTop : 0);
  
      if(this.currentPath.length < 2){
        this.currentPath.push(new Point(this.currentX, this.currentY));
      }else{
        this.currentPath[this.currentPath.length-1] = new Point(this.currentX, this.currentY);
      }
       
      let d : string = "";
      d+= this.createPath(this.currentPath,false);

      document.getElementsByName("in-progress")[0].innerHTML = d;
    }
  }
  doubleClick(){
    //mouse doubleClick with line in hand

      console.log("DOUBLE CLICK LINE");
      if(this.currentPath.length > 1){
        if(this.clickedInside){

          this.isDown = false;
  
        if(this.currentPath.length >= 2){
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
      p[p.length-1] = new Point(this.currentX, this.currentY);
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
