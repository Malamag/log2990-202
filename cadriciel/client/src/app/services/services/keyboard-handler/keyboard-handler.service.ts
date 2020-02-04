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
  toolObservers:InputObserver[];
  toolshortcuts:number[];

  //viewObservers:any[];

  constructor() {
    this.keyString = "";
    this.keyCode = -1;
    this.toolObservers = [];
    this.toolshortcuts = [];
  }

  addToolObserver(newObserver:InputObserver){
    this.toolObservers.push(newObserver);
    this.toolshortcuts.push(newObserver.shortcut);
  }

  updateToolObservers(){
    this.toolObservers.forEach(element => {
      element.update(this);
    });
  }

  checkForToolChange(){
    if(this.toolshortcuts.includes(this.keyCode)){
      this.toolObservers.forEach(element => {
        element.cancel();
        element.selected = false;
      });
      this.toolObservers[this.toolshortcuts.indexOf(this.keyCode)].selected = true;
    }
  }

  logkey(e:KeyboardEvent){
    this.keyString = e.key;
    this.keyCode = e.keyCode;
    this.ctrlDown = e.ctrlKey;
    this.shiftDown = e.shiftKey;
    this.checkForToolChange();
    this.updateToolObservers();
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
    this.updateToolObservers();
  }

}
