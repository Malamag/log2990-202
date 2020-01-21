import { Injectable } from '@angular/core';
import { FormControl, ValidatorFn } from '@angular/forms';
//import { Canvas } from '../../../models/Canvas.model';

@Injectable({
  providedIn: 'root'
})
export class CanvasBuilderService {

  defWidth: number;
  defHeight: number;
  readonly hexaRegExp: string = "";

  constructor() {}

  setDefaultSize() {

    this.defWidth = window.innerWidth; // peut être divisée ou prise par component. 
    this.defHeight = window.innerHeight; // Ici on set pour le full window
  }

  numberValidation(size: FormControl): {[key: string]:boolean} | null {
    if(size.value != undefined && isNaN(size.value)) { //comme dans les notes de cours...
      return {"isNumber" : true}; // demander si c'est ok de faire ça
    }
    return null;

  }

  isNumberValidator(): ValidatorFn{
    return this.numberValidation;
  }

  hexaColorValidation(hexColor: FormControl): {[key: string]: boolean} | null {
    if(hexColor.value != undefined) {
      return {"isHexaColor" : true};
    }
    return null;
  }

  isHexaColorValidator() {

  }
}
