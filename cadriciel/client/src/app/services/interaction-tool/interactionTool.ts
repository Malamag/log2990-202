import { InteractionService } from './../service-interaction/interaction.service';
import { Renderer2 } from '@angular/core';

export abstract class InteractionTool{
    // Parameters I need is: interactionService??, HTMLELement, Rendrer2: maybe for undo redo only?, colorPickingService?
    done: Element[];
    undone: Element[];
    interact: InteractionService;
    drawing: HTMLElement;
    render:Renderer2
    constructor(interact: InteractionService, drawing: HTMLElement, render: Renderer2) {
        this.done= [];
        this.undone = [];
        this.interact = interact;
        this.drawing = drawing;
        this.render =render;
    }

}