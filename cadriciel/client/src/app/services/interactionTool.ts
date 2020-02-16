import { DrawingTool } from './draw-tool/drawingTool';
import { InteractionService } from './service-interaction/interaction.service';
import { ColorPickingService } from './colorPicker/color-picking.service';

export abstract class InteractionTool extends DrawingTool{
    constructor(
        inProg: HTMLElement, 
        drawing: HTMLElement, 
        selected: boolean,
        shortcut: number,
        interact: InteractionService,
        colPick: ColorPickingService) {
        super(inProg, drawing, selected, shortcut, interact, colPick);
    }

    /*
    how to access parent methods/attributes:

    method(){ 
        super.maMethode() //just like in Java :)
    }*/

}