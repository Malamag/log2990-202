import {InputObserver } from './input-observer';
import { Point } from './point';

export abstract class DrawingTool extends InputObserver{
    isDown:boolean;
    currentPath:Point[];
    selected:boolean;
    width:number;
    primary_color:string;
    ignoreNextUp:boolean;
    inProgress:HTMLElement;
    drawing:HTMLElement;

    abstract createPath(path:Point[], doubleClickCheck?:boolean):void;
  
    constructor(inProgress:HTMLElement, drawing:HTMLElement, selected:boolean, width:number, primary_color:string,shortcut:number){

      console.log(inProgress);
      console.log(drawing)

      super(shortcut,selected);

      this.inProgress = inProgress;
      this.drawing = drawing;

      this.width = width;
      this.primary_color = primary_color;
  
      this.isDown = false;
      this.currentPath = [];

      this.ignoreNextUp = false;
    }

    //cancel the current progress
    cancel(){
      //empty path
      this.currentPath = [];
      //if we cancel while mouse down we need to ignore the next up
      this.ignoreNextUp = true;
      //the tool should not affect the canvas
      this.isDown = false;
      //clear the progress renderer
      this.inProgress.innerHTML = "";
    }

    //render the current progress
    updateProgress(wasDoubleClick?:boolean){

      //create an svg element from the current path
      let d : string = "";
      d+= this.createPath(this.currentPath,wasDoubleClick);
      //add it to the progress renderer
      this.inProgress.innerHTML = d;
    }

    //add the progress to the main drawing
    updateDrawing(wasDoubleClick?:boolean){

      //create the final svg element
      let d : string = "";
      d+= this.createPath(this.currentPath,wasDoubleClick);

      //add it to the main drawing
      this.drawing.innerHTML += d;
      //clear current progress
      this.inProgress.innerHTML = "";

      this.currentPath = [];
    }

    //when we go from inside to outside the canvas
    goingOutsideCanvas(position:Point){
      //if currently affecting the canvas
      if(this.isDown){
        //push to drawing and end stroke
        this.updateDrawing();
      }
    }

    //when we go from outside to inside the canvas
    goingInsideCanvas(position:Point){
      //if currently affecting the canvas
      if(this.isDown){
        //start new drawing
        this.down(position);
      }
    }
  
  }