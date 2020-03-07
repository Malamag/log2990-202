import { Injectable, Renderer2 } from '@angular/core';
import { ColorPickingService } from '../colorPicker/color-picking.service';
import { InteractionService } from '../service-interaction/interaction.service';
import { BrushService } from './brush.service';
import { EllipseService } from './ellipse.service';
import { LineService } from './line.service';
import { PencilService } from './pencil.service';
import { RectangleService } from './rectangle.service';
import { PolygonService } from './polygon.service';
import { SelectionService } from './selection.service';
import { PipetteService } from './pipette.service';

@Injectable({
    providedIn: 'root',
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

    CreatePolygon(selected: boolean, interaction: InteractionService, colorPick: ColorPickingService): PolygonService {
        return new PolygonService(this.inProgress, this.drawing, selected, interaction, colorPick);
    }

    CreateSelection(
        selected: boolean,
        interaction: InteractionService,
        colorPick: ColorPickingService,
        render: Renderer2,
        selectedRef: HTMLElement,
        canvas: HTMLElement,
        workingSpace: HTMLElement,
    ): SelectionService {
        return new SelectionService(this.inProgress, this.drawing, selected, interaction, colorPick, render, selectedRef, canvas, workingSpace);
    }

    CreatePipette(selected: boolean, canvas: HTMLCanvasElement, colorPick: ColorPickingService): PipetteService {
        return new PipetteService(selected, canvas, colorPick);
    }
}
