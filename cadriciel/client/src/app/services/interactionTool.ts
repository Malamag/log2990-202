import { DrawingTool } from './draw-tool/drawingTool';
import { InteractionService } from './service-interaction/interaction.service';
import { ColorPickingService } from './colorPicker/color-picking.service';
import { ColorConvertingService } from './colorPicker/color-converting.service';

export abstract class InteractionTool extends DrawingTool{
    constructor(
        inProg: HTMLElement, 
        drawing: HTMLElement, 
        selected: boolean,
        shortcut: number,
        interact: InteractionService) {
            
        super(
            inProg, 
            drawing, 
            selected, 
            shortcut, 
            interact, 
            new ColorPickingService(new ColorConvertingService()) //no need to create this service everytime we call a child class
        );
    }

    /*
    how to access parent methods/attributes:

    method(){ 
        super.maMethode() //just like in Java :)
    }*/

}