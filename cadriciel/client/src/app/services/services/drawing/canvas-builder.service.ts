import { Injectable } from '@angular/core';

import { Canvas } from '../../../models/Canvas.model';

import { Subject } from 'rxjs';

// import { Canvas } from '../../../models/Canvas.model';

@Injectable({
  providedIn: 'root'
})
export class CanvasBuilderService {

  newCanvas: Canvas;
  canvSubject = new Subject<Canvas>(); // using rxjs to emit the created canvas to another component


  getDefWidth(): number {
    return window.innerWidth;
  }

  getDefHeight(): number {
    return window.innerHeight;
  }

  getDefColor(): string {
    const DEFCOLOR = "ffffff";
    return DEFCOLOR;
  }

  getCanvasFromForm(widthInput: number, heightInput: number, colorInput: string): Canvas {

    if (widthInput === 0) { // a 0 value means no input by the user
      widthInput = this.getDefWidth();
    }

    if (heightInput === 0) {
      heightInput = this.getDefHeight();
    }

    if (colorInput === '') {
      colorInput = this.getDefColor();
    }

    colorInput = '#' + colorInput;
    return new Canvas(widthInput, heightInput, colorInput);
  }

  getCanvSubscription() {
    return this.canvSubject.subscribe((canvas: Canvas) => {
      this.newCanvas = canvas;
    });
  }

  emitCanvas() {
    return this.canvSubject.next(this.newCanvas);
  }

}
