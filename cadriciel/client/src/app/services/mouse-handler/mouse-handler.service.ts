import { Injectable } from '@angular/core';
import { Point } from '../draw-tool/point';
import { InputObserver } from '../draw-tool/input-observer';

@Injectable({
  providedIn: 'root'
})
export class MouseHandlerService {

  mouseWindowPosition:Point;
  mouseCanvasPosition:Point;
  startedInsideWorkspace:boolean;
  insideWorkspace:boolean;
  svgCanvas:HTMLElement | null;
  workingSpace:HTMLElement | null;
  svgBox:ClientRect;
  observers:InputObserver[];

  numberOfClicks:number;
  isFirstClick:boolean;
  upFromDoubleClick:boolean;

  constructor(svgCanvas:HTMLElement, workingSpace:HTMLElement) {

    this.observers = [];

    this.svgCanvas = svgCanvas;
    this.workingSpace = workingSpace;

    this.updateWindowSize();

    this.mouseWindowPosition = new Point(0,0);
    this.mouseCanvasPosition = this.windowToCanvas(this.mouseWindowPosition);
    this.startedInsideWorkspace = this.validPoint(this.mouseCanvasPosition);
    this.insideWorkspace = this.validPoint(this.mouseCanvasPosition);

    this.numberOfClicks = 0;
    this.isFirstClick = true;
    this.upFromDoubleClick = false;
  }

  updateWindowSize(){
    if(this.svgCanvas != null){
      this.svgBox = this.svgCanvas.getBoundingClientRect();
    }
  }

  windowToCanvas(windowPosition:Point){
    let canvasX:number = windowPosition.x - this.svgBox.left + (this.workingSpace? this.workingSpace.scrollLeft : 0);
    let canvasY:number = windowPosition.y - this.svgBox.top + (this.workingSpace? this.workingSpace.scrollTop : 0);

    return new Point(canvasX, canvasY);
  }

  validPoint(clickedPoint:Point){
    let validX:boolean = (clickedPoint.x + this.svgBox.left >= this.svgBox.left) && (clickedPoint.x + this.svgBox.left <= this.svgBox.right);
    let validY:boolean = (clickedPoint.y + this.svgBox.top >= this.svgBox.top) && (clickedPoint.y + this.svgBox.top <= this.svgBox.bottom);

    return validX && validY;
  }

  addObserver(newObserver:InputObserver){
    this.observers.push(newObserver);
  }

  updatePosition(x:number, y:number){
    this.mouseWindowPosition = new Point(x,y);
    this.mouseCanvasPosition = this.windowToCanvas(this.mouseWindowPosition);
  }

  down(e:MouseEvent){
    this.updatePosition(e.x,e.y);
    this.startedInsideWorkspace = this.validPoint(this.mouseCanvasPosition);
    this.insideWorkspace = this.validPoint(this.mouseCanvasPosition);

    if(this.startedInsideWorkspace){
      this.callObserverDown();
    }
  }
  
  up(e:MouseEvent){
    this.updatePosition(e.x,e.y);

    this.insideWorkspace = this.validPoint(this.mouseCanvasPosition);

    if(this.startedInsideWorkspace){
      this.callObserverUp();
      this.startedInsideWorkspace = false;
    }

    this.numberOfClicks++;

    if(this.isFirstClick){
      this.isFirstClick = false;
      setTimeout(() => {
        if(this.numberOfClicks > 1){
          this.callObserverDoubleClick();
        }
        this.numberOfClicks = 0;
        this.isFirstClick = true;
      }, 200);
    }
  }
  move(e:MouseEvent){
    this.updatePosition(e.x,e.y);

    let wasInside:boolean = this.insideWorkspace;
    this.insideWorkspace = this.validPoint(this.mouseCanvasPosition);

    if(this.insideWorkspace){
      if(wasInside){
        this.callObserverMove();
      }else{
        this.callObserverInsideCanvas()
      }
    }else{
      if(wasInside){
        this.callObserverOutsideCanvas();
      }
    }
  }

  callObserverMove(){
    //console.log("MOVING");
    this.observers.forEach(element => {
      if(element.selected){
        element.move(this.mouseCanvasPosition);
      }
    });
  }

  callObserverDown(){
    //console.log("DOWN");
    this.observers.forEach(element => {
      if(element.selected){
        element.down(this.mouseCanvasPosition,this.insideWorkspace);
      }
    });
  }

  callObserverOutsideCanvas(){
    //console.log("OutsideCanvas");
    this.observers.forEach(element => {
      if(element.selected){
        element.goingOutsideCanvas(this.mouseCanvasPosition);
      }
    });
  }

  callObserverInsideCanvas(){
    //console.log("InsideCanvas");
    this.observers.forEach(element => {
      if(element.selected){
        element.goingInsideCanvas(this.mouseCanvasPosition);
      }
    });
  }

  callObserverUp(){
    //console.log("UP");
    this.observers.forEach(element => {
      if(element.selected){
        element.up(this.mouseCanvasPosition,this.insideWorkspace);
      }
    });
  }

  callObserverDoubleClick(){
    //console.log("DOUBLECLICK");
    this.observers.forEach(element => {
      if(element.selected){
        element.doubleClick(this.mouseCanvasPosition,this.insideWorkspace);
       
      }
    });
  }
}
