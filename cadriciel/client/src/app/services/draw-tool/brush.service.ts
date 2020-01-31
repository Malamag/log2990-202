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

  down(){
    //mouse down with brush in hand
    if(this.mouseX + (this._workingSpace? this._workingSpace.scrollLeft : 0) >= this._svgBox.left && this.mouseY + (this._workingSpace? this._workingSpace.scrollTop : 0) >= this._svgBox.top){
      this.startedInsideWorkSpace = true;
      console.log("yes");
    }else{
      this.startedInsideWorkSpace = false;
    }
    if(this.startedInsideWorkSpace){
      console.log("-----CLICKED WITH BRUSH-----");
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
    //mouse up with brush in hand
    if(this.startedInsideWorkSpace){
      console.log("-----RELEASED BRUSH-----");
      this.isDown = false;
      let d : string = "";
      d+= this.createPath(this.currentPath);
      document.getElementsByName("drawing")[0].innerHTML += "<g name=\"brush-stroke\">" + d + "</g>";
      document.getElementsByName("in-progress")[0].innerHTML = "";
      this.currentPath = [];
    }
  }
  move(){
    //mouse move with brush in hand
    if(this.startedInsideWorkSpace){
      this.currentX = this.mouseX - this._svgBox.left + (this._workingSpace? this._workingSpace.scrollLeft : 0);
      this.currentY = this.mouseY - this._svgBox.top + (this._workingSpace? this._workingSpace.scrollTop : 0);

      if(this.isDown){
        if(this.currentPath[this.currentPath.length-1].x != this.currentX || this.currentPath[this.currentPath.length-1].y != this.currentY){
          this.currentPath.push(new Point(this.currentX, this.currentY));
        }

       // if(this.currentPath[this.currentPath.length-1].x == this.currentPath[this.currentPath.length-2].x || this.currentPath[this.currentPath.length-1].y == this.currentPath[this.currentPath.length-2].y){
         // this.currentPath[this.currentPath.length-2] = this.currentPath[this.currentPath.length-1];
         // this.currentPath.pop();
        //}

        let d : string = "";
        d+= this.createPath(this.currentPath);
        document.getElementsByName("in-progress")[0].innerHTML = d;
      }
    }
  }
  doubleClick(){
    //mouse doubleClick with brush in hand
  }
  createPath(p:Point[]){

    //p = this.Wrap(p,40);

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

  Wrap(p:Point[], width:number){

    let wrap : Point[] = [];

    p.forEach(element => {
      
    });
  
    return wrap;
  }
}
