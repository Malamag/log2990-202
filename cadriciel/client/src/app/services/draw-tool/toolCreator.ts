import { Injectable} from '@angular/core';
import { RectangleService } from './rectangle.service';
import { PencilService } from './pencil.service';
import { LineService } from './line.service';
import { BrushService } from './brush.service';
import { InteractionService } from '../service-interaction/interaction.service';
import { ColorPickingService } from '../colorPicker/color-picking.service';

@Injectable({
  providedIn: 'root'
  
})
export class ToolCreator {

  inProgress:HTMLElement;
  drawing:HTMLElement;

  constructor(inProgess:HTMLElement, drawing:HTMLElement){
    this.inProgress = inProgess;
    this.drawing = drawing;
  }

  CreatePencil(selected:boolean, width:number, primary_color:string,shortcut:number, interaction: InteractionService, colorPick:ColorPickingService): PencilService{
    return new PencilService(this.inProgress, this.drawing, selected,width,primary_color,shortcut, interaction, colorPick);
  }

  CreateRectangle(selected:boolean, width:number, primary_color:string, secondary_color:string,mode:number,shortcut:number, interaction: InteractionService, colorPick: ColorPickingService): RectangleService{
    return new RectangleService(this.inProgress, this.drawing, selected,width,primary_color,secondary_color,mode,shortcut, interaction, colorPick);
  }

  CreateLine(selected:boolean, width:number, primary_color:string,showJunctions:boolean,junctionWidth:number,shortcut:number, interaction: InteractionService, colorPick: ColorPickingService): LineService{
    return new LineService(this.inProgress, this.drawing, selected,width,primary_color, showJunctions,junctionWidth,shortcut, interaction, colorPick);
  }

  CreateBrush(selected:boolean, width:number, primary_color:string,textureNumber:number,shortcut:number, interaction: InteractionService, colorPick: ColorPickingService): BrushService{
    return new BrushService(this.inProgress, this.drawing, selected,width,primary_color,textureNumber,shortcut, interaction, colorPick);
  }
}