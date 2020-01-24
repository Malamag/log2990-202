import { Injectable } from '@angular/core';
import { FormControl, ValidatorFn } from '@angular/forms';
import { Canvas } from '../../../models/Canvas.model';

// import { Canvas } from '../../../models/Canvas.model';

@Injectable({
  providedIn: 'root'
})
export class CanvasBuilderService {

  defWidth: number;
  defHeight: number;
  defColor: string;

  setDefaultSize() {

    this.defWidth = window.innerWidth; // peut être divisée ou prise par component.
    this.defHeight = window.innerHeight; // Ici on set pour le full window
  }

  numberValidation(size: FormControl): {[key: string]: boolean} | null {
    const userInput: any = size.value; // size.value returns a string
    if (userInput !== undefined && (isNaN(userInput) || userInput.includes('.'))) { // avoids float entries

      return {isNumber : true}; // demander si c'est ok de faire ça
    }
    return null;
  }

  isNumberValidator(): ValidatorFn {
    return this.numberValidation;
  }

  makeNewCanvas(widthInput: string, heightInput: string, colorInput: string) {
    if (widthInput !== '') {
      this.defWidth  = +widthInput; // le + devant un attribut de type string le convertit en nombre
    }

    if (heightInput !== '') {
      this.defHeight = +heightInput;
    }

    if (colorInput !== '') {
      this.defColor = colorInput;
    } else {
      this.defColor = 'ffffff';
    }

    this.defColor = '#' + this.defColor; // concat pour donner un attribut css valide

    return new Canvas(this.defWidth, this.defHeight, this.defColor);
  }
}
