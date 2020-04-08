import { ElementRef, Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Canvas } from 'src/app/models/canvas.model';
import { AerosolAttributes } from '../attributes/aerosol-attribute';
import { FormsAttribute } from '../attributes/attribute-form';
import { LineAttributes } from '../attributes/line-attributes';
import { ToolsAttributes } from '../attributes/tools-attribute';

@Injectable({
    providedIn: 'root',
})
export class InteractionService {
    selectedTool: Subject<string> = new Subject<string>();
    $selectedTool: Observable<string> = this.selectedTool.asObservable();

    formsAttributes: Subject<FormsAttribute> = new Subject<FormsAttribute>();
    $formsAttributes: Observable<FormsAttribute> = this.formsAttributes.asObservable();

    drawingDone: Subject<boolean> = new Subject<boolean>();
    $drawingDone: Observable<boolean> = this.drawingDone.asObservable();

    enableDisableButtons: Subject<boolean[]> = new Subject<boolean[]>();
    $enableDisableButtons: Observable<boolean[]> = this.enableDisableButtons.asObservable();

    toolsAttributes: Subject<ToolsAttributes> = new Subject<ToolsAttributes>();
    $toolsAttributes: Observable<ToolsAttributes> = this.toolsAttributes.asObservable();

    lineAttributes: Subject<LineAttributes> = new Subject<LineAttributes>();
    $lineAttributes: Observable<LineAttributes> = this.lineAttributes.asObservable();

    aerosolAttributes: Subject<AerosolAttributes> = new Subject<AerosolAttributes>();
    $aerosolAttributes: Observable<AerosolAttributes> = this.aerosolAttributes.asObservable();

    cancelTools: Subject<boolean> = new Subject<boolean>();
    $cancelToolsObs: Observable<boolean> = this.cancelTools.asObservable();

    ref: Subject<ElementRef> = new Subject<ElementRef>();
    $refObs: Observable<ElementRef> = this.ref.asObservable();

    showGrid: Subject<boolean> = new Subject<boolean>();
    $showGrid: Observable<boolean> = this.showGrid.asObservable();

    canvasAttributes: Subject<Canvas> = new Subject<Canvas>();
    $canvasAttributes: Observable<Canvas> = this.canvasAttributes.asObservable();

    convertSvg2Canvas: Subject<boolean> = new Subject<boolean>();
    $convertSvg2Canvas: Observable<boolean> = this.convertSvg2Canvas.asObservable();
    isCanvas: boolean;

    previewColor: Subject<string> = new Subject<string>();
    $previewColor: Observable<string> = this.previewColor.asObservable();

    canvasContext: Subject<CanvasRenderingContext2D> = new Subject<CanvasRenderingContext2D>();
    $canvasContext: Observable<CanvasRenderingContext2D> = this.canvasContext.asObservable();

    drawingContinued: Subject<boolean> = new Subject<boolean>();
    $drawingContinued: Observable<boolean> = this.drawingContinued.asObservable();

    toleranceValue: Subject<number> = new Subject<number>();
    $toleranceValue: Observable<number> = this.toleranceValue.asObservable();

    constructor() {
        this.isCanvas = false;
    }

    emitSelectedTool(tool: string): void {
        this.selectedTool.next(tool);
    }

    emitLineAttributes(attr: LineAttributes | undefined): void {
        this.lineAttributes.next(attr);
    }

    emitFormsAttributes(attr: FormsAttribute | undefined): void {
        this.formsAttributes.next(attr);
    }

    emitToolsAttributes(attr: ToolsAttributes | undefined): void {
        this.toolsAttributes.next(attr);
    }

    emitAerosolAttributes(attr: AerosolAttributes | undefined): void {
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

    emitContinueDrawing(): void {
        this.drawingContinued.next(true);
    }

    emitToleranceValue(value: number): void {
        this.toleranceValue.next(value);
    }
}
