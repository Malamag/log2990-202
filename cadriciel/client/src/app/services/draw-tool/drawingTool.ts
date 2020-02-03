import {InputObserver } from './input-observer';
import { Point } from './point';

export abstract class DrawingTool extends InputObserver{
    isDown:boolean;
    currentPath:Point[];
    selected:boolean;
    width:number;
    primary_color:string;
    ignoreNextUp:boolean;

    abstract createPath(path:Point[], doubleClickCheck?:boolean):void;
  
    constructor(selected:boolean, width:number, primary_color:string,shortcut:number){
      
      super(shortcut,selected);

      this.isDown = false;
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

    updateProgress(wasDoubleClick?:boolean){
      let d : string = "";
      d+= this.createPath(this.currentPath,wasDoubleClick);
      document.getElementsByName("in-progress")[0].innerHTML = d;
    }

    updateDrawing(wasDoubleClick?:boolean){
      let d : string = "";
      d+= this.createPath(this.currentPath,wasDoubleClick);

      document.getElementsByName("drawing")[0].innerHTML += d;
      document.getElementsByName("in-progress")[0].innerHTML = "";

      this.currentPath = [];
    }
  
  }