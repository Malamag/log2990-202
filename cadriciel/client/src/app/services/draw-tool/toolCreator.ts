import { Injectable} from '@angular/core';
import { ColorPickingService } from '../colorPicker/color-picking.service';
import { InteractionService } from '../service-interaction/interaction.service';
import { BrushService } from './brush.service';
import { LineService } from './line.service';
import { PencilService } from './pencil.service';
import { RectangleService } from './rectangle.service';
import { EllipseService } from './ellipse.service';

@Injectable({
  providedIn: 'root'

})
export class ToolCreator {

  inProgress: HTMLElement;
  drawing: HTMLElement;

  constructor(inProgess: HTMLElement, drawing: HTMLElement) {
    this.inProgress = inProgess;
    this.drawing = drawing;
  }

  CreatePencil(selected: boolean, shortcut: number, interaction: InteractionService, colorPick: ColorPickingService): PencilService {
    return new PencilService(this.inProgress, this.drawing, selected, shortcut, interaction, colorPick);
  }

  CreateRectangle(selected: boolean, shortcut: number, interaction: InteractionService, colorPick: ColorPickingService): RectangleService {
    return new RectangleService(this.inProgress, this.drawing, selected, shortcut, interaction, colorPick);
  }

  CreateLine(selected: boolean, shortcut: number, interaction: InteractionService, colorPick: ColorPickingService): LineService {
    return new LineService(this.inProgress, this.drawing, selected, shortcut, interaction, colorPick);
  }

  CreateBrush(selected: boolean, shortcut: number, interaction: InteractionService, colorPick: ColorPickingService): BrushService {
    return new BrushService(this.inProgress, this.drawing, selected, shortcut, interaction, colorPick);
  }

  CreateEllipse(selected: boolean, shortcut: number, interaction: InteractionService, colorPick: ColorPickingService): EllipseService {
    return new EllipseService(this.inProgress, this.drawing, selected, shortcut, interaction, colorPick);
  }
  
}
