import { Injectable} from '@angular/core';

import { Canvas } from '../../../models/Canvas.model';

import { Subject } from 'rxjs';


// import { Canvas } from '../../../models/Canvas.model';

@Injectable({
  providedIn: 'root'
})
export class CanvasBuilderService {

  defWidht: number;
  defHeight: number;

  newCanvas: Canvas;
  canvSubject = new Subject<Canvas>(); // using rxjs to emit the created canvas to another component

  constructor() {
    this.defWidht = this.getDefWidth();
    this.defHeight = this.getDefHeight();
  }
  
  getDefWidth(): number {
    const DIV = 1.042; // permet d'égaliser avec les dimensions de l'espace de travail
    return Math.round(window.innerWidth/DIV); //évite d'avoir des fractions de pixels
  }

  getDefHeight(): number {
    const DIV = 1.11; // idem, mais pour la hauteur
    return Math.round(window.innerHeight/DIV);
  }

  getDefColor(): string {
    const DEFCOLOR = "ffffff";
    return DEFCOLOR;
  }

  setCanvasFromForm(widthInput: number, heightInput: number, colorInput: string) {

    if (widthInput === 0) { // a 0 value means no input by the user
      widthInput = this.defWidht;
    }

    if (heightInput === 0) {
      heightInput = this.defHeight;
    }

    if (colorInput === '') {
      colorInput = this.getDefColor();
    }

    colorInput = '#' + colorInput;
    this.newCanvas= new Canvas(widthInput, heightInput, colorInput);

  }

  getDefCanvas() {
    return new Canvas(this.getDefWidth(), this.getDefHeight(), this.getDefColor());
  }

  emitCanvas() {
    return this.canvSubject.next(this.newCanvas);
  }

}
