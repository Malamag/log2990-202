import { Observer } from './observer';
import { Point } from './point';

export abstract class DrawingTool extends Observer{
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