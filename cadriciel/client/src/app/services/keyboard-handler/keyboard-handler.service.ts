import { Injectable } from '@angular/core';
import { InputObserver } from '../draw-tool/input-observer';

@Injectable({
  providedIn: 'root'
})
export class KeyboardHandlerService {

  keyString:string;
  keyCode:number;
  ctrlDown:boolean
  shiftDown:boolean;
  observers:InputObserver[];

  constructor() {
    this.keyString = "";
    this.keyCode = -1;
    this.observers = [];
  }

  addObserver(newObserver:InputObserver){
    this.observers.push(newObserver);
  }

  updateObservers(){
    this.observers.forEach(element => {
      element.update(this);
    });
  }

  logkey(e:KeyboardEvent){
    this.keyString = e.key;
    this.keyCode = e.keyCode;
    this.ctrlDown = e.ctrlKey;
    this.shiftDown = e.shiftKey;
    this.updateObservers();
  }

  reset(e:KeyboardEvent){
    if(e.keyCode == 17){
      this.ctrlDown = false;
    }
    if(e.keyCode == 16){
      this.shiftDown = false;
    }
    this.keyString = "";
    this.keyCode = -1;
    this.updateObservers();
  }

}
