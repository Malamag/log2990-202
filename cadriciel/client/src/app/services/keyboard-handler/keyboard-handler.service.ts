import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class KeyboardHandlerService {

  keyString:string;
  keyCode:number;
  ctrlDown:boolean
  shiftDown:boolean;
  observers:any[];
  old:KeyboardEvent;

  constructor() {

    this.keyString = "";
    this.keyCode = -1;
    this.observers = [];
  }

  addObserver(newObserver:any){
    this.observers.push(newObserver);
  }

  updateObservers(){
    this.observers.forEach(element => {
      element.update();
    });
  }

  logkey(e:KeyboardEvent){
    if(this.old != e){
      this.keyString = e.key;
      this.keyCode = e.keyCode;
      this.ctrlDown = e.ctrlKey;
      this.shiftDown = e.shiftKey;
      this.updateObservers();
    }
  }

  reset(e:KeyboardEvent){
    this.old = e;

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
