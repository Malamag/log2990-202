import { Injectable, ElementRef} from '@angular/core';

import { Canvas } from '../../models/Canvas.model';

import { Subject } from 'rxjs';
import { colorCircles } from '../../palette';


@Injectable({
  providedIn: 'root'
})
export class CanvasBuilderService {

  defWidht: number;
  defHeight: number;

  newCanvas: Canvas;
  canvSubject = new Subject<Canvas>(); // using rxjs to emit the created canvas to another component

  onGoing: boolean;

  constructor() { }
  
  getDefWidth(): number {
    return Math.round(window.innerWidth); //évite d'avoir des fractions de pixels
  }

  getDefHeight(): number {
    const DIV = 1.11; // adjusts after the top bar size
    return Math.round(window.innerHeight/DIV);
  }

  getDefColor(): string {
    const DEFCOLOR = "ffffff";
    return DEFCOLOR;
  }

  setCanvasFromForm(widthInput: number, heightInput: number, colorInput: string): void {
    colorInput = '#' + colorInput;
    this.newCanvas= new Canvas(widthInput, heightInput, colorInput); // a fresh draw is always clean
  }

  getDefCanvas(): Canvas {
    return new Canvas(this.getDefWidth(), this.getDefHeight(), this.getDefColor());
  }

  emitCanvas() {
    return this.canvSubject.next(this.newCanvas);
  }

  getPalleteAttributes() {
    const CENTERX = 30; // Centre cx, defines spaces between color palette dots
    let space = CENTERX;
    for(let i = 0; i < colorCircles.length; ++i){
    
      colorCircles[i].cx = space; // modifies palette array containing only 0 values
      space += CENTERX;
    }
    return colorCircles;
  }

  whipeDraw(myDoodle: ElementRef) {
    if(myDoodle){ // element is defined
      myDoodle.nativeElement.innerHTML = "";
    }
  }

}
