import {InputObserver } from './input-observer';
import { Point } from './point';
import { ElementRef, /*Renderer2*/ } from '@angular/core';

export abstract class DrawingTool extends InputObserver{
    inProgressRef: ElementRef;
    drawingRef: ElementRef;
    //renderer: Renderer2;
    isDown:boolean;
    currentPath:Point[];
    selected:boolean;
    width:number;
    primary_color:string;
    ignoreNextUp:boolean;

    abstract createPath(path:Point[], doubleClickCheck?:boolean):void;
  
    constructor(selected:boolean, width:number, primary_color:string,shortcut:number, /*inProgressRef: ElementRef, drawingRef: ElementRef,private renderer: Renderer2*/){
      
      super(shortcut,selected);
      //this.inProgressRef = inProgressRef;
      //this.drawingRef = drawingRef; 
      //this.renderer = renderer;
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
      //this.renderer.appendChild(this.inProgressRef, " ");
      document.getElementsByName("in-progress")[0].innerHTML = "";
    }

    updateProgress(wasDoubleClick?:boolean){
      let d : string = "";
      d+= this.createPath(this.currentPath,wasDoubleClick);
      //this.renderer.appendChild(this.inProgressRef, d);
      document.getElementsByName("in-progress")[0].innerHTML = d;
    }

    updateDrawing(wasDoubleClick?:boolean){
      let d : string = "";
      d+= this.createPath(this.currentPath,wasDoubleClick);

      //this.renderer.appendChild(this.drawingRef, d);
      //this.renderer.appendChild(this.inProgressRef, "");
      document.getElementsByName("drawing")[0].innerHTML += d;
      document.getElementsByName("in-progress")[0].innerHTML = "";

      this.currentPath = [];
    }
  
  }