import { Injectable } from '@angular/core';
import { DrawingTool } from './drawingTool';
import { Point } from './point';
import { KeyboardHandlerService } from '../keyboard-handler/keyboard-handler.service';

@Injectable({
  providedIn: 'root'
})
export class PencilService extends DrawingTool {

  constructor(_svg:HTMLElement | null, _workingSpace:HTMLElement | null,mouseX:number,mouseY:number,selected:boolean, width:number, primary_color:string){
    super(_svg, _workingSpace, mouseX, mouseY,selected,width,primary_color);
  }

  update(keyboard:KeyboardHandlerService){
  }

  down(){
    //mouse down with pencil in hand
    if(this.mouseX + (this._workingSpace? this._workingSpace.scrollLeft : 0) >= this._svgBox.left && this.mouseY + (this._workingSpace? this._workingSpace.scrollTop : 0) >= this._svgBox.top){
      this.startedInsideWorkSpace = true;
    }else{
      this.startedInsideWorkSpace = false;
    }
    if(this.startedInsideWorkSpace){
      console.log("-----CLICKED WITH PENCIL-----");
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
      console.log("-----RELEASED PENCIL-----");
      this.isDown = false;
      let d : string = "";
      d+= this.createPath(this.currentPath);
      document.getElementsByName("drawing")[0].innerHTML += "<g name=\"pencil-stroke\">" + d + "</g>";
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
    //mouse doubleClick with pencil in hand
  }
  createPath(p:Point[]){
    let s = "<path d=\"";
    s+= `M ${p[0].x} ${p[0].y} `;
    for(let i = 1; i < p.length;i++){
      s+= `L ${p[i].x} ${p[i].y} `;
    }
    s+="\" stroke=\"#"+ this.primary_color +"\" stroke-width=\"10\" fill=\"none\" stroke-linecap=\"round\" stroke-linejoin=\"round\" />";
  
    return s;
  }
}
