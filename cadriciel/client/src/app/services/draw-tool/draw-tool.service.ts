import { Injectable} from '@angular/core';
import { KeyboardHandlerService } from '../keyboard-handler/keyboard-handler.service';

@Injectable({
  providedIn: 'root'
})
export class DrawToolService {

  keyboard:KeyboardHandlerService;

  constructor() { 
    //_ -> private
  }

  CreatePencil(_svg:HTMLElement | null,_workingSpace:HTMLElement | null, mouseX:number, mouseY:number,selected:boolean, width:number, primary_color:string){
    return new PencilTool(_svg,_workingSpace,mouseX,mouseY,selected,width,primary_color);
  }

  CreateRectangle(_svg:HTMLElement | null,_workingSpace:HTMLElement | null, mouseX:number, mouseY:number,selected:boolean, width:number, primary_color:string, secondary_color:string){
    return new RectangleTool(_svg,_workingSpace,mouseX,mouseY,selected,width,primary_color,secondary_color);
  }

  CreateLine(_svg:HTMLElement | null,_workingSpace:HTMLElement | null, mouseX:number, mouseY:number,selected:boolean, width:number, primary_color:string,showJunctions:boolean){
    return new LineTool(_svg,_workingSpace,mouseX,mouseY,selected,width,primary_color, showJunctions);
  }

  CreateBrush(_svg:HTMLElement | null,_workingSpace:HTMLElement | null, mouseX:number, mouseY:number,selected:boolean, width:number, primary_color:string){
    return new BrushTool(_svg,_workingSpace,mouseX,mouseY,selected,width,primary_color);
  }
}

abstract class Observer{
  abstract update(keyboard:KeyboardHandlerService):void;
}

class Point{
  x:number;
  y:number;
  constructor(x:number, y:number){
    this.x = x;
    this.y = y;
  }
}

abstract class DrawingTool extends Observer{
  _svg:HTMLElement | null;
  _workingSpace:HTMLElement | null;
  _svgBox:ClientRect;
  startedInsideWorkSpace:boolean;
  isDown:boolean;
  clickedInside:boolean;
  currentX:number;
  currentY:number;
  currentPath:Point[];
  mouseX:number;
  mouseY:number;
  selected:boolean;
  width:number;
  primary_color:string;

  constructor(_svg:HTMLElement | null, _workingSpace:HTMLElement | null,mouseX:number,mouseY:number,selected:boolean, width:number, primary_color:string){
    
    super();
    
    this._svg = _svg;
    this._workingSpace = _workingSpace
    if(_svg != null){
      this._svgBox = _svg.getBoundingClientRect();
    }
    this.startedInsideWorkSpace = false;
    this.isDown = false;
    this.clickedInside = false;
    this.mouseX = mouseX;
    this.mouseY = mouseY;
    this.selected = selected;
    this.width = width;
    this.primary_color = primary_color;

    this.currentX = mouseX;
    this.currentY = mouseY;

    this.currentPath = [];
  }

}

class PencilTool extends DrawingTool{

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

class RectangleTool extends DrawingTool{
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

class LineTool extends DrawingTool{
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

class BrushTool extends DrawingTool{
  
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