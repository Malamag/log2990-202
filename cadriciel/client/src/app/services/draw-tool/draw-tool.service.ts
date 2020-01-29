import { Injectable} from '@angular/core';
import { KeyboardHandlerService } from '../keyboard-handler/keyboard-handler.service';

@Injectable({
  providedIn: 'root'
})
export class DrawToolService {

  keyboard:KeyboardHandlerService;

  constructor() { 

  }

  CreatePencil(_svg:HTMLElement | null,_workingSpace:HTMLElement | null, mouseX:number, mouseY:number,selected:boolean, width:number, primary_color:number){
    return new PencilTool(_svg,_workingSpace,mouseX,mouseY,selected,width,primary_color);
  }

  CreateRectangle(_svg:HTMLElement | null,_workingSpace:HTMLElement | null, mouseX:number, mouseY:number,selected:boolean, width:number, primary_color:number, secondary_color:number){
    return new RectangleTool(_svg,_workingSpace,mouseX,mouseY,selected,width,primary_color,secondary_color);
  }

  CreateLine(_svg:HTMLElement | null,_workingSpace:HTMLElement | null, mouseX:number, mouseY:number,selected:boolean, width:number, primary_color:number,showJunctions:boolean){
    return new LineTool(_svg,_workingSpace,mouseX,mouseY,selected,width,primary_color, showJunctions);
  }

  CreateBrush(_svg:HTMLElement | null,_workingSpace:HTMLElement | null, mouseX:number, mouseY:number,selected:boolean, width:number, primary_color:number){
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
  primary_color:number;

  constructor(_svg:HTMLElement | null, _workingSpace:HTMLElement | null,mouseX:number,mouseY:number,selected:boolean, width:number, primary_color:number){
    
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

  constructor(_svg:HTMLElement | null, _workingSpace:HTMLElement | null,mouseX:number,mouseY:number,selected:boolean, width:number, primary_color:number){
    super(_svg, _workingSpace, mouseX, mouseY,selected,width,primary_color);
  }

  update(keyboard:KeyboardHandlerService){
    console.log("update on pencil");
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
    this.down();
    this.up();
    this.down();
    this.up();
  }
  createPath(p:Point[]){
    let s = "<path d=\"";
    s+= `M ${p[0].x} ${p[0].y} `;
    for(let i = 1; i < p.length;i++){
      s+= `L ${p[i].x} ${p[i].y} `;
    }
    s+="\" stroke=\"red\" stroke-width=\"10\" fill=\"none\" stroke-linecap=\"round\" stroke-linejoin=\"round\" />";
  
    return s;
  }
}

class RectangleTool extends DrawingTool{
  secondary_color:number;
  isSquare:boolean;

  constructor(_svg:HTMLElement | null, _workingSpace:HTMLElement | null,mouseX:number,mouseY:number,selected:boolean, width:number, primary_color:number,secondary_color:number){
    super(_svg,_workingSpace, mouseX, mouseY,selected,width,primary_color);
    this.secondary_color = secondary_color;
    this.isSquare = false;
  }

  update(keyboard:KeyboardHandlerService){
    console.log("update on rectangle");

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
    _s += `<rect x=\"${startX}\" y=\"${startY}\" width=\"${Math.abs(w)}\" height=\"${Math.abs(h)}\" fill="blue"/>`;
    _s+= "</g>"
    if(w == 0 || h == 0){
      _s = "";
    }
    return _s;
  }
}

class LineTool extends DrawingTool{
  showJunctions:boolean;

  constructor(_svg:HTMLElement | null, _workingSpace:HTMLElement | null,mouseX:number,mouseY:number,selected:boolean, width:number, primary_color:number, showJunctions:boolean){
    super(_svg,_workingSpace, mouseX, mouseY,selected,width,primary_color);
    this.showJunctions = showJunctions;
  }

  update(keyboard:KeyboardHandlerService){
    console.log("update on line");
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

      d+= this.createPath(this.currentPath);

      if(this.showJunctions){
        this.currentPath.forEach(element => {
          d+=`<circle cx=\"${element.x}\" cy=\"${element.y}\" r=\"3\" stroke=\"black\" stroke-width=\"0\" fill=\"red\" />`;
        });
      }

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
      d+= this.createPath(this.currentPath);

      if(this.showJunctions){
        this.currentPath.forEach(element => {
          d+=`<circle cx=\"${element.x}\" cy=\"${element.y}\" r=\"3\" stroke=\"black\" stroke-width=\"0\" fill=\"red\" />`;
        });
      }

      document.getElementsByName("in-progress")[0].innerHTML = d;
    }
  }
  doubleClick(){
    //mouse doubleClick with line in hand
      console.log("DOUBLE CLICK LINE");
      if(this.currentPath.length > 1){
        if(this.clickedInside){

          this.isDown = false;
  
        if(this.currentPath.length > 2){
          this.currentPath.pop();
        }
  
        let deltaX : number = Math.abs(this.currentPath[this.currentPath.length-1].x - this.currentPath[0].x);
        let deltaY : number = Math.abs(this.currentPath[this.currentPath.length-1].y - this.currentPath[0].y);
  
        let d : string = "";
  
        if(deltaX <= 3 || deltaY <= 3){
          this.currentPath[this.currentPath.length -1] = this.currentPath[0];
        }
  
        d+= this.createPath(this.currentPath);
  
        if(this.showJunctions){
          this.currentPath.forEach(element => {
            d+=`<circle cx=\"${element.x}\" cy=\"${element.y}\" r=\"3\" stroke=\"black\" stroke-width=\"0\" fill=\"red\" />`;
          });
        }
  
  
        document.getElementsByName("drawing")[0].innerHTML += "<g name=\"line-segments\">" + d + "</g>";
        document.getElementsByName("in-progress")[0].innerHTML = "";
        this.currentPath = [];
  
        }
      }
    
  }
  createPath(p:Point[]){

    let s = "<path d=\"";
    s+= `M ${p[0].x} ${p[0].y} `;
    for(let i = 1; i < p.length;i++){
      s+= `L ${p[i].x} ${p[i].y} `;
    }
    s+="\" stroke=\"red\" stroke-width=\"1\" fill=\"none\" stroke-linecap=\"round\" stroke-linejoin=\"round\" />";
  
    return s;
  }
}

class BrushTool extends DrawingTool{
  
  constructor(_svg:HTMLElement | null, _workingSpace:HTMLElement | null,mouseX:number,mouseY:number,selected:boolean, width:number, primary_color:number){
    super(_svg, _workingSpace, mouseX, mouseY,selected,width,primary_color);
  }

  update(keyboard:KeyboardHandlerService){
    console.log("update on brush");
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
    this.down();
    this.up();
    this.down();
    this.up();
  }
  createPath(p:Point[]){

    //p = this.Wrap(p,40);

    let s = "<filter id=\"blurMe\" filterUnits=\"userSpaceOnUse\"><feGaussianBlur in=\"SourceGraphic\" stdDeviation=\"10\"/></filter>";
    //let s = "<filter id=\"displacementFilter\" x=\"-100%\" y=\"-100%\" width=\"200%\" height=\"200%\" filterUnits=\"userSpaceOnUse\"><feTurbulence type=\"turbulence\" baseFrequency=\"0.05\"numOctaves=\"2\" result=\"turbulence\"/><feDisplacementMap in2=\"turbulence\" in=\"SourceGraphic\"scale=\"50\" xChannelSelector=\"B\" yChannelSelector=\"R\"/></filter>";

    s += "<path d=\"";
      s+= `M ${p[0].x-0/4} ${p[0].y-0/4} `;

      for(let i = 1; i < p.length;i++){


        s+= `L ${p[i].x-0/4} ${p[i].y-0/4} `;
      }

      s+="\" stroke=\"red\" stroke-width=\"10\" fill=\"none\" stroke-linecap=\"round\" stroke-linejoin=\"round\" filter=\"url(#blurMe)\" />";

    return s;
  }

  Wrap(p:Point[], width:number){

    let wrap : Point[] = [];

    p.forEach(element => {
      
    });
  
    return wrap;
  }
}