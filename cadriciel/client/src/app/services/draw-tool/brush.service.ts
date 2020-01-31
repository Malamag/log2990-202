import { Injectable } from '@angular/core';
import { DrawingTool } from './drawingTool';
import { Point } from './point';
import { KeyboardHandlerService } from '../keyboard-handler/keyboard-handler.service';

@Injectable({
  providedIn: 'root'
})
export class BrushService extends DrawingTool {

  constructor(_svg:HTMLElement | null, _workingSpace:HTMLElement | null,mouseX:number,mouseY:number,selected:boolean, width:number, primary_color:string){
    super(_svg, _workingSpace, mouseX, mouseY,selected,width,primary_color);
  }

  update(keyboard:KeyboardHandlerService){
  }

  down(position:Point){
    //mouse down with brush in hand
    this.isDown = true;

    this.currentPath.push(position);
    this.currentPath.push(position);

    let d : string = "";
    d+= this.createPath(this.currentPath);
    document.getElementsByName("in-progress")[0].innerHTML = d;
  }
  up(position:Point){
    //mouse up with brush in hand
    this.isDown = false;

    let d : string = "";
    d+= this.createPath(this.currentPath);

    document.getElementsByName("drawing")[0].innerHTML += "<g name=\"brush-stroke\">" + d + "</g>";
    document.getElementsByName("in-progress")[0].innerHTML = "";

    this.currentPath = [];
  }
  move(position:Point){
    //mouse move with brush in hand
    if(this.isDown){
      let xDelta = this.currentPath[this.currentPath.length-1].x;
      let yDelta = this.currentPath[this.currentPath.length-1].y;
      if(xDelta != this.currentX || yDelta != this.currentY){
        this.currentPath.push(position);
      }

      let d : string = "";
      d+= this.createPath(this.currentPath);
      document.getElementsByName("in-progress")[0].innerHTML = d;
    }
  }
  doubleClick(position:Point){
    //mouse doubleClick with brush in hand (nothing happens)
  }
  createPath(p:Point[]){

    let width = 75;
    let scale = width/((100/0.5) / (100/width));
    let octave = scale/(width/10) * 0.5;

    //let s = "<filter id=\"blurMe\" filterUnits=\"userSpaceOnUse\"><feGaussianBlur in=\"SourceGraphic\" stdDeviation=\"5\"/></filter>";
    let s = "<filter id=\"displacementFilter\" x=\"-100%\" y=\"-100%\" width=\"300%\" height=\"300%\" filterUnits=\"userSpaceOnUse\"><feTurbulence type=\"turbulence\" baseFrequency=\""+octave+"\"numOctaves=\"2\" result=\"turbulence\"/><feDisplacementMap in2=\"turbulence\" in=\"SourceGraphic\"scale=\""+(width*scale)+"\" xChannelSelector=\"R\" yChannelSelector=\"G\" result=\"first\"/><feOffset in=\"first\" dx=\""+((-width*scale)/4)+"\" dy=\""+((-width*scale)/4)+"\" /></filter>";
    s += "<path d=\"";
      s+= `M ${p[0].x} ${p[0].y} `;

      for(let i = 1; i < p.length;i++){
        s+= `L ${p[i].x} ${p[i].y} `;
      }

      s+="\" stroke=\"#" + this.primary_color + "\" stroke-width=\""+(width-(width*scale)/2)+"\" fill=\"none\" stroke-linecap=\"round\" stroke-linejoin=\"round\" filter=\"url(#displacementFilter)\"/>";

    return s;
  }
}
