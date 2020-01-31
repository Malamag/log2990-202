import { Injectable } from '@angular/core';
import { Point } from '../draw-tool/point';
import { InputObserver } from '../draw-tool/input-observer';

@Injectable({
  providedIn: 'root'
})
export class MouseHandlerService {

  mouseWindowPosition:Point;
  mouseCanvasPosition:Point;
  mouseInsideWorkspace:Boolean;
  svgCanvas:HTMLElement | null;
  workingSpace:HTMLElement | null;
  svgBox:ClientRect;
  observers:InputObserver[];

  numberOfClicks:number;
  upFromSingleClick:boolean;
  isFirstClick:boolean;

  constructor(svgCanvas:HTMLElement | null, workingSpace:HTMLElement | null) {

    this.observers = [];

    this.svgCanvas = svgCanvas;
    this.workingSpace = workingSpace;

    if(this.svgCanvas != null){
      this.svgBox = this.svgCanvas.getBoundingClientRect();
    }

    this.mouseWindowPosition = new Point(0,0);
    this.mouseCanvasPosition = this.windowToCanvas(this.mouseWindowPosition);
    this.mouseInsideWorkspace = this.checkIfValidClick(this.mouseCanvasPosition);

    this.numberOfClicks = 0;
    this.isFirstClick = true;
    this.upFromSingleClick = false;
  }

  windowToCanvas(windowPosition:Point){
    let canvasX:number = windowPosition.x - this.svgBox.left + (this.workingSpace? this.workingSpace.scrollLeft : 0);
    let canvasY:number = windowPosition.y - this.svgBox.top + (this.workingSpace? this.workingSpace.scrollTop : 0);
    return new Point(canvasX, canvasY);
  }

  checkIfValidClick(clickedPoint:Point){
    return (clickedPoint.x >= this.svgBox.left) && (clickedPoint.y >= this.svgBox.top);
  }

  addObserver(newObserver:any){
    this.observers.push(newObserver);
  }

  updatePosition(x:number, y:number){
    this.mouseWindowPosition = new Point(x,y);
    this.mouseCanvasPosition = this.windowToCanvas(this.mouseWindowPosition);
  }

  down(e:MouseEvent){
    this.updatePosition(e.x,e.y);
    this.numberOfClicks++;
    if(this.isFirstClick){
      this.isFirstClick = false;
      setTimeout(() => {
        if(this.numberOfClicks == 1){
          this.callObserverDown();
          this.upFromSingleClick = true;
        }else{
          this.callObserverDoubleClick();
          this.upFromSingleClick = false;
        }
        this.numberOfClicks = 0;
        this.isFirstClick = true;
      }, 200);
    }
  }
  up(e:MouseEvent){
    this.updatePosition(e.x,e.y);
    setTimeout(() => {
      if(this.upFromSingleClick){
        this.callObserverUp();
      }
    }, 201);
  }
  move(e:MouseEvent){
    this.updatePosition(e.x,e.y);
    this.callObserverMove();
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
        element.down(this.mouseCanvasPosition);
      }
    });
  }

  callObserverUp(){
    //console.log("UP");
    this.observers.forEach(element => {
      if(element.selected){
        element.up(this.mouseCanvasPosition);
      }
    });
  }

  callObserverDoubleClick(){
    //console.log("DOUBLECLICK");
    this.observers.forEach(element => {
      if(element.selected){
        element.doubleClick(this.mouseCanvasPosition);
      }
    });
  }
}
