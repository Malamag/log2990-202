import { InteractionService } from './../service-interaction/interaction.service';
import { Renderer2 } from '@angular/core';

export abstract class InteractionTool{
    // Parameters I need is: interactionService??, HTMLELement, Rendrer2: maybe for undo redo only?, colorPickingService?
    done: Element[];
    undone: Element[];
    constructor(public interact: InteractionService, public drawing: HTMLElement, public render: Renderer2) {
        this.done= [];
        this.undone = [];
    }

   
}