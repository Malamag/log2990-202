import { InteractionService } from './service-interaction/interaction.service';
import { Renderer2 } from '@angular/core';


export abstract class InteractionTool {
    constructor(public interact: InteractionService, public drawing: HTMLElement, public render: Renderer2) {    
    }

    /*
    how to access parent methods/attributes:

    method(){ 
        super.maMethode() //just like in Java :)
    }*/

}