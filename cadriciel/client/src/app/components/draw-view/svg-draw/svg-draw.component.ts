import { AfterViewInit, Component, ElementRef, HostListener, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Canvas } from 'src/app/models/canvas.model';
import { ChoosenColors } from 'src/app/models/choosen-colors.model';
import { AutoSaveService } from 'src/app/services/auto-save/auto-save.service';
import { ColorPickingService } from 'src/app/services/colorPicker/color-picking.service';
import { ContinueDrawingService } from 'src/app/services/continue-drawing/continue-drawing.service';
import { DoodleFetchService } from 'src/app/services/doodle-fetch/doodle-fetch.service';
import { ClipboardService } from 'src/app/services/draw-tool/clipboard.service';
import { DrawingTool } from 'src/app/services/draw-tool/drawing-tool';
import { InputObserver } from 'src/app/services/draw-tool/input-observer';
import { ToolCreator } from 'src/app/services/draw-tool/tool-creator';
import { GridRenderService } from 'src/app/services/grid/grid-render.service';
import { UndoRedoService } from 'src/app/services/interaction-tool/undo-redo.service';
import { KeyboardHandlerService } from 'src/app/services/keyboard-handler/keyboard-handler.service';
import { CanvasBuilderService } from 'src/app/services/new-doodle/canvas-builder.service';
import { InteractionService } from 'src/app/services/service-interaction/interaction.service';
import { MouseHandlerService } from '../../../services/mouse-handler/mouse-handler.service';

@Component({
    selector: 'app-svg-draw',
    templateUrl: './svg-draw.component.html', // changed file type
    styleUrls: ['./svg-draw.component.scss'],
})
export class SvgDrawComponent implements OnInit, AfterViewInit {
    showGrid: boolean;
    save: AutoSaveService;
    constructor(
        private canvBuilder: CanvasBuilderService,
        public interaction: InteractionService,
        public colorPick: ColorPickingService,
        public doodleFetch: DoodleFetchService,
        private render: Renderer2,
        private gridService: GridRenderService,
        private continueDrawing: ContinueDrawingService,
    ) {
        this.showGrid = false;
    }
    canvas: Canvas;

    width: number;
    height: number;
    backColor: string;

    // tslint:disable-next-line: typedef
    toolsContainer = new Map();
    // tslint:disable-next-line: typedef
    interactionToolsContainer = new Map();
    @ViewChild('filter', {static: false}) filterRef: ElementRef;
    @ViewChild('inPrgress', { static: false }) inProgress: ElementRef;
    @ViewChild('canvas', { static: false }) svg: ElementRef;

    @ViewChild('frame', { static: false }) frameRef: ElementRef;
    @ViewChild('drawingSpace', { static: false }) drawingSpace: ElementRef;
    @ViewChild('selectedItems', { static: false }) selectedItems: ElementRef;
    @ViewChild('grid', { static: false }) gridRef: ElementRef;
    @ViewChild('container', { static: false }) cntRef: ElementRef;
    workingSpace: HTMLElement;

    @HostListener('window: load', ['$event'])
    continueSavedImage(): void {
        this.continueDrawing.continueAutoSavedFromDrawVue();
    }
    ngOnInit(): void {
        this.initCanvas();
    }

    closeTools(map: Map<string, DrawingTool>): void {
        map.forEach((el: DrawingTool) => {
            el.selected = false;
            el.cancel();
        });
    }

    bgroundChangeSubscription(): void {
        this.colorPick.colorSubject.subscribe((choosenColors: ChoosenColors) => {
            if (choosenColors) {
                this.backColor = choosenColors.backColor;
                this.colorPick.cData.primaryColor = choosenColors.primColor;
                this.colorPick.cData.secondaryColor = choosenColors.secColor;
                this.colorPick.cData.backgroundColor = choosenColors.backColor;
                this.colorPick.setColorsFromForm(choosenColors.primColor, choosenColors.secColor, choosenColors.backColor);
                this.gridService.updateColor(this.backColor);
            }
        });
    }

    initCanvas(): void {
        this.canvBuilder.canvSubject.subscribe((canvas: Canvas) => {
            if (canvas === undefined || canvas === null) {
                canvas = this.canvBuilder.getDefCanvas();
            }

            this.width = canvas.canvasWidth;
            this.height = canvas.canvasHeight;
            this.backColor = canvas.canvasColor;
            this.colorPick.cData.backgroundColor = canvas.canvasColor;

            this.colorPick.setColorsFromForm(this.colorPick.cData.primaryColor, this.colorPick.cData.secondaryColor, canvas.canvasColor);
            this.colorPick.emitColors();
            if (canvas.wipeAll === true || canvas.wipeAll === undefined) { // if no attribute is specified, the doodle will be w
                this.canvBuilder.wipeDraw(this.frameRef);
                this.canvBuilder.wipeDraw(this.filterRef);
            }

            if (this.gridService.grid) {
                if (this.gridRef) {
                    this.gridService.removeGrid();
                    this.gridService.initGrid(this.gridRef.nativeElement, this.width, this.height, this.backColor);
                }
            }
        });
        this.canvBuilder.emitCanvas(); // if a page reload is called, the canvas will not be undefined
    }

    initGridVisibility(): void {
        this.interaction.$showGrid.subscribe((show: boolean) => {
            this.showGrid = show;
        });
        this.reinitGridFromSub();
    }
    createTools(): void {
        const TC = new ToolCreator(this.inProgress.nativeElement, this.frameRef.nativeElement);

        const PENCIL = TC.CreatePencil(true, this.interaction, this.colorPick);
        const RECT = TC.CreateRectangle(false, this.interaction, this.colorPick);
        const LINE = TC.CreateLine(false, this.interaction, this.colorPick);
        const BRUSH = TC.CreateBrush(false, this.interaction, this.colorPick);
        const AEROSOL = TC.CreateAerosol(false, this.interaction, this.colorPick);
        const ELLIPSE = TC.CreateEllipse(false, this.interaction, this.colorPick);
        const POLYGON = TC.CreatePolygon(false, this.interaction, this.colorPick);
        const TEXT = TC.CreateText(false, this.interaction, this.colorPick);
        const SELECT = TC.CreateSelection(
            false,
            this.interaction,
            this.colorPick,
            this.render,
            this.selectedItems.nativeElement,
            this.svg.nativeElement,
        );

        const ERASER = TC.CreateEraser(
            false,
            this.interaction,
            this.colorPick,
            this.render,
            this.selectedItems.nativeElement,
            this.svg.nativeElement,
        );

        const COLOR_EDITOR = TC.CreateColorEditor(
            false,
            this.interaction,
            this.colorPick,
            this.render,
            this.selectedItems.nativeElement,
            this.svg.nativeElement,
        );

        const PIPETTE = TC.CreatePipette(false, this.interaction, this.colorPick);
        this.toolsContainer.set('Rectangle', RECT);
        this.toolsContainer.set('Ligne', LINE);
        this.toolsContainer.set('Pinceau', BRUSH);
        this.toolsContainer.set('Crayon', PENCIL);
        this.toolsContainer.set('Aérosol', AEROSOL);
        this.toolsContainer.set('Ellipse', ELLIPSE);
        this.toolsContainer.set('Polygone', POLYGON);
        this.toolsContainer.set('Sélectionner', SELECT);
        this.toolsContainer.set('Efface', ERASER);
        this.toolsContainer.set('Applicateur de couleur', COLOR_EDITOR);
        this.toolsContainer.set('Pipette', PIPETTE);
        this.toolsContainer.set('Texte', TEXT);

    }
    ngAfterViewInit(): void {
        this.gridService.initGrid(this.gridRef.nativeElement, this.width, this.height, this.backColor);
        this.initGridVisibility();
        const KEYBOARD_HANDLER: KeyboardHandlerService = new KeyboardHandlerService();
        const MOUSE_HANDLER = new MouseHandlerService(this.svg.nativeElement);

        // create all the tools
        this.createTools();
        const UNDO_REDO: UndoRedoService = new UndoRedoService(this.interaction, this.frameRef.nativeElement, this.render);

        const CLIPBOARD: ClipboardService =
         new ClipboardService(this.toolsContainer.get('Sélectionner'),this.interaction, this.frameRef.nativeElement, this.render);

        this.interactionToolsContainer.set('AnnulerRefaire', UNDO_REDO);
        this.interactionToolsContainer.set('ClipBoard', CLIPBOARD);
        this.interaction.$cancelToolsObs.subscribe((sig: boolean) => {
            if (sig) {
                this.closeTools(this.toolsContainer);
            }
        });

        this.interaction.$selectedTool.subscribe((toolName: string) => {
            if (toolName === 'Annuler' || toolName === 'Refaire') {
                this.interactionToolsContainer.get('AnnulerRefaire').apply(toolName);
            } else if (toolName === 'Copier' || toolName === 'Coller'
            || toolName === 'Couper' || toolName ==='Dupliquer' || toolName === 'Supprimer') {
                this.interactionToolsContainer.get('ClipBoard').apply(toolName);
            } else if (this.toolsContainer.get(toolName) && !this.toolsContainer.get(toolName).selected) {
                const event = new Event('toolChange');
                window.dispatchEvent(event);
                this.closeTools(this.toolsContainer);
                this.toolsContainer.get(toolName).selected = true;
            }

            MOUSE_HANDLER.updateWindowSize();
        });

        // Subscribe each tool to keyboard and mouse
        this.toolsContainer.forEach((element: InputObserver) => {
            KEYBOARD_HANDLER.addToolObserver(element);
            MOUSE_HANDLER.addObserver(element);
        });

        window.addEventListener('resize', () => {
            MOUSE_HANDLER.updateWindowSize();
        });

        // Mouse listeners
        window.addEventListener('mousemove', (e: MouseEvent) => {
            MOUSE_HANDLER.move(e);
        });
        window.addEventListener('mousedown', (e: MouseEvent) => {
            // e.preventDefault();
            MOUSE_HANDLER.down(e);
        });

        window.addEventListener('mouseup', (e: MouseEvent) => {
            MOUSE_HANDLER.up(e);
        });
        window.addEventListener('wheel', (e: WheelEvent) => {
            MOUSE_HANDLER.wheel(e);
        });

        // Prevent right-click menu
        window.addEventListener('contextmenu', (e: MouseEvent) => {
            e.preventDefault();
        });

        // Keyboard listeners
        window.addEventListener('keydown', (e: KeyboardEvent) => {
            KEYBOARD_HANDLER.logkey(e);
        });
        window.addEventListener('keyup', (e: KeyboardEvent) => {
            KEYBOARD_HANDLER.reset(e);
        });

        window.dispatchEvent(new Event('resize'));

        this.doodleFetch.ask.subscribe(() => {
            this.doodleFetch.currentDraw = this.svg;
            this.doodleFetch.widthAttr = this.width;
            this.doodleFetch.heightAttr = this.height;
            this.doodleFetch.backColor = this.backColor;
        });

        this.bgroundChangeSubscription();
        this.save = new AutoSaveService(this.interaction, this.doodleFetch);
    }

    reinitGridFromSub(): void {
        this.interaction.$canvasAttributes.subscribe((newDoodle: Canvas) => {
            this.gridService.removeGrid();
            this.gridService.initGrid(this.gridRef.nativeElement, newDoodle.canvasWidth, newDoodle.canvasHeight, newDoodle.canvasColor);
        });
    }
}
