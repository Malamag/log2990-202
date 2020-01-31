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
    
    document.getElementsByName("drawing")[0].innerHTML += "<g name=\"pencil-stroke\">" + d + "</g>";
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
