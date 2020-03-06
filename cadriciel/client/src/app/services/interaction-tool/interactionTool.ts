import { Renderer2 } from '@angular/core';
import { InteractionService } from './../service-interaction/interaction.service';

export abstract class InteractionTool {
    // Parameters I need is: interactionService??, HTMLELement, Rendrer2: maybe for undo redo only?, colorPickingService?
    done: string[];
    undone: string[];
    interact: InteractionService;
    drawing: HTMLElement;
    render: Renderer2;
    constructor(interact: InteractionService, drawing: HTMLElement, render: Renderer2) {
        this.done = [];
        this.undone = [];
        this.interact = interact;
        this.drawing = drawing;
        this.render = render;
    }
}
