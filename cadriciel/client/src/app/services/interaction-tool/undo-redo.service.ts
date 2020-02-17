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
         console.log(this.drawing.lastElementChild);
         this.done.push(this.drawing.lastElementChild);
       }
     })
   }

}
