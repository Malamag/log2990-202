import { Injectable, Renderer2 } from '@angular/core';
import { ColorPickingService } from '../colorPicker/color-picking.service';
import { InteractionService } from '../service-interaction/interaction.service';
import { AerosolService } from './aerosol.service';
import { BrushService } from './brush.service';
import { ColorEditorService } from './color-editor.service';
import { EllipseService } from './ellipse.service';
import { EraserService } from './eraser.service';
import { LineService } from './line.service';
import { PencilService } from './pencil.service';
import { PipetteService } from './pipette.service';
import { PolygonService } from './polygon.service';
import { RectangleService } from './rectangle.service';
import { SelectionService } from './selection.service';
import { TextService } from './text.service';


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

    CreateAerosol(selected: boolean, interaction: InteractionService, colorPick: ColorPickingService): AerosolService {
        return new AerosolService(this.inProgress, this.drawing, selected, interaction, colorPick);
    }

    CreateEllipse(selected: boolean, interaction: InteractionService, colorPick: ColorPickingService): EllipseService {
        return new EllipseService(this.inProgress, this.drawing, selected, interaction, colorPick);
    }

    CreatePolygon(selected: boolean, interaction: InteractionService, colorPick: ColorPickingService): PolygonService {
        return new PolygonService(this.inProgress, this.drawing, selected, interaction, colorPick);
    }

    CreateText(selected: boolean, interaction: InteractionService, colorPick: ColorPickingService): TextService {
        return new TextService(this.inProgress, this.drawing, selected, interaction, colorPick);
    }

    CreateSelection(
        selected: boolean,
        interaction: InteractionService,
        colorPick: ColorPickingService,
        render: Renderer2,
        selectedRef: HTMLElement,
        canvas: HTMLElement,
    ): SelectionService {
        return new SelectionService(this.inProgress, this.drawing, selected, interaction, colorPick, render, selectedRef, canvas);
    }

    CreateEraser(
        selected: boolean,
        interaction: InteractionService,
        colorPick: ColorPickingService,
        render: Renderer2,
        selectedRef: HTMLElement,
        canvas: HTMLElement,
    ): EraserService {
        return new EraserService(this.inProgress, this.drawing, selected, interaction, colorPick, render, selectedRef, canvas);
    }

    CreateColorEditor(
        selected: boolean,
        interaction: InteractionService,
        colorPick: ColorPickingService,
        render: Renderer2,
        selectedRef: HTMLElement,
        canvas: HTMLElement,
    ): ColorEditorService {
        return new ColorEditorService(this.inProgress, this.drawing, selected, interaction, colorPick, render, selectedRef, canvas);
    }
    CreatePipette(
        selected: boolean,

        interaction: InteractionService,
        colorPick: ColorPickingService,
    ): PipetteService {
        return new PipetteService(selected, interaction, colorPick);
    }

}
