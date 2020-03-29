import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Canvas } from 'src/app/models/canvas.model';
import { ChoosenColors } from 'src/app/models/choosen-colors.model';
import { AutoSaveService } from 'src/app/services/auto-save/auto-save.service';
import { ColorPickingService } from 'src/app/services/colorPicker/color-picking.service';
import { DoodleFetchService } from 'src/app/services/doodle-fetch/doodle-fetch.service';
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
        private doodleFetch: DoodleFetchService,
        private render: Renderer2,
        private gridService: GridRenderService,
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

    @ViewChild('inPrgress', { static: false }) inProgress: ElementRef;
    @ViewChild('canvas', { static: false }) svg: ElementRef;

    @ViewChild('frame', { static: false }) frameRef: ElementRef;
    @ViewChild('drawingSpace', { static: false }) drawingSpace: ElementRef;
    @ViewChild('selectedItems', { static: false }) selectedItems: ElementRef;
    @ViewChild('grid', { static: false }) gridRef: ElementRef;
    @ViewChild('container', { static: false }) cntRef: ElementRef;
    workingSpace: HTMLElement;

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
            if (canvas.wipeAll === true || canvas.wipeAll === undefined) {
                // if no attribute is specified, the doodle will be w
                this.canvBuilder.wipeDraw(this.frameRef);
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

    ngAfterViewInit(): void {
        this.gridService.initGrid(this.gridRef.nativeElement, this.width, this.height, this.backColor);
        this.initGridVisibility();
        const keyboardHandler: KeyboardHandlerService = new KeyboardHandlerService();
        const mouseHandler = new MouseHandlerService(this.svg.nativeElement);

        // create all the tools
        const tc = new ToolCreator(this.inProgress.nativeElement, this.frameRef.nativeElement);

        const pencil = tc.CreatePencil(true, this.interaction, this.colorPick);
        const rect = tc.CreateRectangle(false, this.interaction, this.colorPick);
        const line = tc.CreateLine(false, this.interaction, this.colorPick);
        const brush = tc.CreateBrush(false, this.interaction, this.colorPick);
        const aerosol = tc.CreateAerosol(false, this.interaction, this.colorPick);
        const ellipse = tc.CreateEllipse(false, this.interaction, this.colorPick);
        const undoRedo: UndoRedoService = new UndoRedoService(this.interaction, this.frameRef.nativeElement, this.render);
        const polygon = tc.CreatePolygon(false, this.interaction, this.colorPick);
        const selection = tc.CreateSelection(
            false,
            this.interaction,
            this.colorPick,
            this.render,
            this.selectedItems.nativeElement,
            this.svg.nativeElement,
        );

        const eraser = tc.CreateEraser(
            false,
            this.interaction,
            this.colorPick,
            this.render,
            this.selectedItems.nativeElement,
            this.svg.nativeElement,
        );

        const colorEditor = tc.CreateColorEditor(
            false,
            this.interaction,
            this.colorPick,
            this.render,
            this.selectedItems.nativeElement,
            this.svg.nativeElement,
        );

        const pipette = tc.CreatePipette(false, this.interaction, this.colorPick);

        this.interactionToolsContainer.set('AnnulerRefaire', undoRedo);
        this.toolsContainer.set('Rectangle', rect);
        this.toolsContainer.set('Ligne', line);
        this.toolsContainer.set('Pinceau', brush);
        this.toolsContainer.set('Crayon', pencil);
        this.toolsContainer.set('Aérosol', aerosol);
        this.toolsContainer.set('Ellipse', ellipse);
        this.toolsContainer.set('Polygone', polygon);
        this.toolsContainer.set('Sélectionner', selection);
        this.toolsContainer.set('Efface', eraser);
        this.toolsContainer.set('ApplicateurCouleur', colorEditor);
        this.toolsContainer.set('Pipette', pipette);

        this.interaction.$cancelToolsObs.subscribe((sig: boolean) => {
            if (sig) {
                this.closeTools(this.toolsContainer);
            }
        });

        this.interaction.$selectedTool.subscribe((toolName: string) => {
            if (toolName === 'Annuler' || toolName === 'Refaire') {
                this.interactionToolsContainer.get('AnnulerRefaire').apply(toolName);
            } else if (this.toolsContainer.get(toolName) && !this.toolsContainer.get(toolName).selected) {
                const event = new Event('toolChange');
                window.dispatchEvent(event);
                this.closeTools(this.toolsContainer);
                this.toolsContainer.get(toolName).selected = true;
            }

            mouseHandler.updateWindowSize();
        });

        // Subscribe each tool to keyboard and mouse
        this.toolsContainer.forEach((element: InputObserver) => {
            keyboardHandler.addToolObserver(element);
            mouseHandler.addObserver(element);
        });

        window.addEventListener('resize', () => {
            mouseHandler.updateWindowSize();
        });

        // Mouse listeners
        window.addEventListener('mousemove', (e: MouseEvent) => {
            mouseHandler.move(e);
        });
        window.addEventListener('mousedown', (e: MouseEvent) => {
            // e.preventDefault();
            mouseHandler.down(e);
        });

        window.addEventListener('mouseup', (e: MouseEvent) => {
            mouseHandler.up(e);
        });

        // Prevent right-click menu
        window.oncontextmenu = (e: MouseEvent) => {
            e.preventDefault();
        };

        // Keyboard listeners
        window.addEventListener('keydown', (e: KeyboardEvent) => {
            keyboardHandler.logkey(e);
        });
        window.addEventListener('keyup', (e: KeyboardEvent) => {
            keyboardHandler.reset(e);
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
