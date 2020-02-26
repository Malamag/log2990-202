import { Injectable} from '@angular/core';
import { ColorPickingService } from '../colorPicker/color-picking.service';
import { InteractionService } from '../service-interaction/interaction.service';
import { BrushService } from './brush.service';
import { LineService } from './line.service';
import { PencilService } from './pencil.service';
import { RectangleService } from './rectangle.service';
import { EllipseService } from './ellipse.service';
import { SelectionService } from './selection.service';
import { ColorEditorService } from './color-editor.service';
import { EraserService } from './eraser.service';

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

  CreatePencil(selected: boolean, interaction: InteractionService, colorPick: ColorPickingService): PencilService {
    return new PencilService(this.inProgress, this.drawing, selected, interaction, colorPick);
  }

  CreateRectangle(selected: boolean, interaction: InteractionService, colorPick: ColorPickingService): RectangleService {
    return new RectangleService(this.inProgress, this.drawing, selected, interaction, colorPick);
  }

  CreateLine(selected: boolean, interaction: InteractionService, colorPick: ColorPickingService): LineService {
    return new LineService(this.inProgress, this.drawing, selected, interaction, colorPick);
  }

  CreateBrush(selected: boolean, interaction: InteractionService, colorPick: ColorPickingService): BrushService {
    return new BrushService(this.inProgress, this.drawing, selected, interaction, colorPick);
  }

  CreateEllipse(selected: boolean, interaction: InteractionService, colorPick: ColorPickingService): EllipseService {
    return new EllipseService(this.inProgress, this.drawing, selected, interaction, colorPick);
  }

  CreateSelection(selected: boolean, interaction: InteractionService, colorPick: ColorPickingService): SelectionService {
    return new SelectionService(this.inProgress, this.drawing, selected, interaction, colorPick);
  }  
  CreateColorEditor(selected: boolean, interaction: InteractionService, colorPick: ColorPickingService): ColorEditorService {
    return new ColorEditorService(this.inProgress, this.drawing, selected, interaction, colorPick);
  }  
  CreateEraser(selected: boolean, interaction: InteractionService, colorPick: ColorPickingService): EraserService {
    return new EraserService(this.inProgress, this.drawing, selected, interaction, colorPick);
  }  
}
