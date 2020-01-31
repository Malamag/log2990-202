import {InputObserver } from './input-observer';
import { Point } from './point';

export abstract class DrawingTool extends InputObserver{
    _svg:HTMLElement | null;
    _workingSpace:HTMLElement | null;
    _svgBox:ClientRect;
    startedInsideWorkSpace:boolean;
    isDown:boolean;
    clickedInside:boolean;
    currentPath:Point[];
    selected:boolean;
    width:number;
    primary_color:string;

    abstract down(position:Point, insideWorkspace?:boolean):void;
    abstract up(position:Point):void;
    abstract move(position:Point):void;
    abstract doubleClick(position:Point, insideWorkspace?:boolean):void;
    abstract createPath(path:Point[], doubleClickCheck?:boolean):void;
  
    constructor(_svg:HTMLElement | null, _workingSpace:HTMLElement | null,selected:boolean, width:number, primary_color:string){
      
      super();
      
      this._svg = _svg;
      this._workingSpace = _workingSpace
      if(_svg != null){
        this._svgBox = _svg.getBoundingClientRect();
      }
      this.startedInsideWorkSpace = false;
      this.isDown = false;
      this.clickedInside = false;
      this.selected = selected;
      this.width = width;
      this.primary_color = primary_color;
  
      this.currentPath = [];
    }
  
  }