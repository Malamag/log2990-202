import { ElementRef, Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Canvas } from 'src/app/models/canvas.model';
import { AerosolAttributes } from '../attributes/aerosol-attribute';
import { FormsAttribute } from '../attributes/attribute-form';
import { LineAttributes } from '../attributes/line-attributes';
import { ToolsAttributes } from '../attributes/tools-attribute';

@Injectable({
    providedIn: 'root',
})
export class InteractionService {
    selectedTool = new Subject<string>();
    $selectedTool = this.selectedTool.asObservable();

    formsAttributes = new Subject<FormsAttribute>();
    $formsAttributes = this.formsAttributes.asObservable();

    drawingDone = new Subject<boolean>();
    $drawingDone = this.drawingDone.asObservable();

    enableDisableButtons = new Subject<boolean[]>();
    $enableDisableButtons = this.enableDisableButtons.asObservable();

    toolsAttributes = new Subject<ToolsAttributes>();
    $toolsAttributes = this.toolsAttributes.asObservable();

    lineAttributes = new Subject<LineAttributes>();
    $lineAttributes = this.lineAttributes.asObservable();

    aerosolAttributes = new Subject<AerosolAttributes>();
    $aerosolAttributes = this.aerosolAttributes.asObservable();

    cancelTools = new Subject<boolean>();
    $cancelToolsObs = this.cancelTools.asObservable();

    ref = new Subject<ElementRef>();
    $refObs = this.ref.asObservable();

    canvasRedone = new Subject<boolean>();
    $canvasRedone = this.canvasRedone.asObservable();

    showGrid = new Subject<boolean>();
    $showGrid = this.showGrid.asObservable();

    canvasAttributes = new Subject<Canvas>();
    $canvasAttributes = this.canvasAttributes.asObservable();

    convertSvg2Canvas = new Subject<boolean>();
    $convertSvg2Canvas = this.convertSvg2Canvas.asObservable();
    isCanvas: boolean;

    previewColor = new Subject<string>();
    $previewColor = this.previewColor.asObservable();

    canvasContext = new Subject<CanvasRenderingContext2D>();
    $canvasContext = this.canvasContext.asObservable();

    constructor() {
        this.isCanvas = false;
    }

    emitSelectedTool(tool: string): void {
        this.selectedTool.next(tool);
    }

    emitLineAttributes(attr: LineAttributes): void {
        this.lineAttributes.next(attr);
    }

    emitFormsAttributes(attr: FormsAttribute): void {
        this.formsAttributes.next(attr);
    }

    emitToolsAttributes(attr: ToolsAttributes): void {
        this.toolsAttributes.next(attr);
    }

    emitAerosolAttributes(attr: AerosolAttributes): void {
        this.aerosolAttributes.next(attr);
    }

    emitCancel(sig: boolean): void {
        this.cancelTools.next(sig);
    }

    emitRef(el: ElementRef): void {
        this.ref.next(el);
    }

    emitDrawingDone(): void {
        this.drawingDone.next(true);
    }

    emitEnableDisable(disableContainer: boolean[]): void {
        this.enableDisableButtons.next(disableContainer);
    }

    emitCanvasRedone(): void {
        this.canvasRedone.next(true);
    }

    emitGridVisibility(showGrid: boolean): void {
        this.showGrid.next(showGrid);
    }

    emitGridAttributes(attr: Canvas): void {
        this.canvasAttributes.next(attr);
    }

    emitSvgCanvasConversion(toCanvas: boolean): void {
        this.isCanvas = toCanvas;
        this.convertSvg2Canvas.next(toCanvas);
    }

    emitPreviewColor(colorToEmit: string): void {
        this.previewColor.next(colorToEmit);
    }

    emitCanvasContext(canvas: HTMLCanvasElement): void {
        const CTX = canvas.getContext('2d');
        if (CTX) {
            this.canvasContext.next(CTX);
        }
    }
}
