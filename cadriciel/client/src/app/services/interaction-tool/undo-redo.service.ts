import { Injectable, Renderer2 } from '@angular/core';
import { InteractionTool } from './interactionTool';
import { InteractionService } from '../service-interaction/interaction.service';

@Injectable({
  providedIn: 'root'
})
export class UndoRedoService extends InteractionTool{

  constructor(interact: InteractionService, drawing: HTMLElement, render: Renderer2) {
    super(interact, drawing, render);
   }
}
