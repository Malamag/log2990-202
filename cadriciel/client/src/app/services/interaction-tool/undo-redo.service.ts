import { Injectable, Renderer2 } from '@angular/core';
import { InteractionTool } from './interactionTool';
import { InteractionService } from '../service-interaction/interaction.service';

@Injectable({
  providedIn: 'root'
})
export class UndoRedoService extends InteractionTool{

  constructor(interact: InteractionService, drawing: HTMLElement, render: Renderer2) {
    super(interact, drawing, render);
    this.updateContainer();
  }
  updateContainer(){
    this.interact.$drawingDone.subscribe(sig=>{
      if(sig && this.drawing.lastElementChild!== null){
        if(this.undone.length> 0){
          this.undone = [];
        }
        this.done.push(this.drawing.lastElementChild);
      }
    })
  }
  undo(){
    if(this.done.length && this.done[length-1]!== null){
      let elem = this.done.pop();
      this.drawing.innerHTML="";
      this.done.forEach(elem=>{
        this.render.appendChild(this.drawing, elem);
      })
      this.undone.push(elem);
    }
  }
  redo(){
    if(this.undone.length){
      let elem = this.undone.pop();
      this.render.appendChild(this.drawing, elem);
      this.done.push(elem);
    }
  }
  apply(name: string){
    if(name === 'Annuler'){
      this.undo();
    }
    if(name === 'Refaire'){
      this.redo();
    }
  }
}
