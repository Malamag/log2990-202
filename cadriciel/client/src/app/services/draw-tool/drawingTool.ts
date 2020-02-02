import {InputObserver } from './input-observer';
import { Point } from './point';

export abstract class DrawingTool extends InputObserver{
    startedInsideWorkSpace:boolean;
    isDown:boolean;
    clickedInside:boolean;
    currentPath:Point[];
    selected:boolean;
    width:number;
    primary_color:string;
    ignoreNextUp:boolean;


    abstract down(position:Point, insideWorkspace?:boolean):void;
    abstract up(position:Point):void;
    abstract move(position:Point):void;
    abstract doubleClick(position:Point, insideWorkspace?:boolean):void;
    abstract createPath(path:Point[], doubleClickCheck?:boolean):void;
  
    constructor(selected:boolean, width:number, primary_color:string,shortcut:number){
      
      super(shortcut,selected);

      this.startedInsideWorkSpace = false;
      this.isDown = false;
      this.clickedInside = false;
      this.selected = selected;
      this.width = width;
      this.primary_color = primary_color;
  
      this.currentPath = [];

      this.ignoreNextUp = false;
    }

    cancel(){
      this.currentPath = [];
      this.ignoreNextUp = true;
      this.isDown = false;
      console.log("cancel");
      document.getElementsByName("in-progress")[0].innerHTML = "";
    }

    updateProgress(){
      let d : string = "";
      d+= this.createPath(this.currentPath);
      document.getElementsByName("in-progress")[0].innerHTML = d;
    }

    updateDrawing(){
      let d : string = "";
      d+= this.createPath(this.currentPath);

      document.getElementsByName("drawing")[0].innerHTML += d;
      document.getElementsByName("in-progress")[0].innerHTML = "";

      this.currentPath = [];
    }
  
  }