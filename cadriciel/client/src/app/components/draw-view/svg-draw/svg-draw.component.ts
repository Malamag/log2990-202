import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Canvas } from 'src/app/models/Canvas.model';
import { ChoosenColors } from 'src/app/models/ChoosenColors.model';
import { ColorPickingService } from 'src/app/services/colorPicker/color-picking.service';
import { DoodleFetchService } from 'src/app/services/doodle-fetch/doodle-fetch.service';
import { DrawingTool } from 'src/app/services/draw-tool/drawingTool';
import { ToolCreator } from 'src/app/services/draw-tool/toolCreator';
import { CanvasBuilderService } from 'src/app/services/drawing/canvas-builder.service';
import { GridRenderService } from 'src/app/services/grid/grid-render.service';
import { UndoRedoService } from 'src/app/services/interaction-tool/undo-redo.service';
import { KeyboardHandlerService } from 'src/app/services/keyboard-handler/keyboard-handler.service';
import { InteractionService } from 'src/app/services/service-interaction/interaction.service';
import { MouseHandlerService } from '../../../services/mouse-handler/mouse-handler.service';

@Component({
    selector: 'app-svg-draw',
    templateUrl: './svg-draw.component.html', // changed file type
    styleUrls: ['./svg-draw.component.scss'],
})
export class SvgDrawComponent implements OnInit, AfterViewInit, OnDestroy {
    mySubscription: any;
    constructor(
        private canvBuilder: CanvasBuilderService,
        public interaction: InteractionService,
        public colorPick: ColorPickingService,
        private doodleFetch: DoodleFetchService,
        private render: Renderer2,
        private gridService: GridRenderService,
        private router: Router,
    ) {
        this.router.routeReuseStrategy.shouldReuseRoute = () => {
            return false;
        };
        this.mySubscription = this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                this.canvBuilder.emitCanvas();
                // Trick the Router into believing it's last link wasn't previously loaded
                this.router.navigated = false;
            }
        });
    }
    canvas: Canvas;

    width: number;
    height: number;
    backColor: string;

    toolsContainer = new Map();
    interactionToolsContainer = new Map();

    showGrid: boolean = false;

    @ViewChild('inPrgress', { static: false }) inProgress: ElementRef;
    @ViewChild('canvas', { static: false }) svg: ElementRef;

    @ViewChild('frame', { static: false }) frameRef: ElementRef;
    @ViewChild('drawingSpace', { static: false }) drawingSpace: ElementRef;
    @ViewChild('selectedItems', { static: false }) selectedItems: ElementRef;
    @ViewChild('grid', { static: false }) gridRef: ElementRef;

    workingSpace: HTMLElement;

    ngOnInit() {
        this.interaction.$refObs.subscribe(ref => {
            this.workingSpace = ref.nativeElement;
        });
        this.initCanvas();
    }

    closeTools(map: Map<string, DrawingTool>) {
        map.forEach(el => {
            el.selected = false;
        });
    }

    bgroundChangeSubscription() {
        this.colorPick.colorSubject.subscribe((choosenColors: ChoosenColors) => {
            if (choosenColors) {
                this.backColor = choosenColors.backColor;
                this.gridService.updateColor(this.backColor);
            }
        });
    }

    initCanvas() {
        this.canvBuilder.canvSubject.subscribe((canvas: Canvas) => {
            if (canvas === undefined || canvas === null) {
                canvas = this.canvBuilder.getDefCanvas();
            }

            this.width = canvas.canvasWidth;
            this.height = canvas.canvasHeight;
            this.backColor = canvas.canvasColor;
            this.canvBuilder.whipeDraw(this.frameRef);
            if (this.gridService.grid) {
                if (this.gridRef) {
                    this.gridService.removeGrid();
                    this.gridService.initGrid(this.gridRef.nativeElement, this.width, this.height, this.backColor);
                }
            }
        });
        this.canvBuilder.emitCanvas();
    }

    initGridVisibility() {
        this.interaction.$showGrid.subscribe((show: boolean) => {
            this.showGrid = show;
        });
    }

    ngAfterViewInit() {
        this.gridService.initGrid(this.gridRef.nativeElement, this.width, this.height, this.backColor);
        this.initGridVisibility();
        const keyboardHandler: KeyboardHandlerService = new KeyboardHandlerService();
        const mouseHandler = new MouseHandlerService(this.svg.nativeElement, this.workingSpace);
        const tc = new ToolCreator(this.inProgress.nativeElement, this.frameRef.nativeElement);

        const pencil = tc.CreatePencil(true, this.interaction, this.colorPick);
        const rect = tc.CreateRectangle(false, this.interaction, this.colorPick);
        const line = tc.CreateLine(false, this.interaction, this.colorPick);
        const brush = tc.CreateBrush(false, this.interaction, this.colorPick);
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
            this.workingSpace,
        );

        this.interactionToolsContainer.set('AnnulerRefaire', undoRedo);
        this.toolsContainer.set('Rectangle', rect);
        this.toolsContainer.set('Ligne', line);
        this.toolsContainer.set('Pinceau', brush);
        this.toolsContainer.set('Crayon', pencil);
        this.toolsContainer.set('Ellipse', ellipse);
        this.toolsContainer.set('Polygone', polygon);
        this.toolsContainer.set('Selection', selection);
        this.interaction.$cancelToolsObs.subscribe(sig => {
            if (sig) {
                this.closeTools(this.toolsContainer);
            }
        });
        this.interaction.$selectedTool.subscribe(toolName => {
            if (toolName === 'Annuler' || toolName === 'Refaire') {
                this.interactionToolsContainer.get('AnnulerRefaire').apply(toolName);
            } else if (this.toolsContainer.get(toolName)) {
                this.closeTools(this.toolsContainer);
                this.toolsContainer.get(toolName).selected = true;
            }
        });

        // Subscribe each tool to keyboard and mouse
        this.toolsContainer.forEach(element => {
            keyboardHandler.addToolObserver(element);
            mouseHandler.addObserver(element);
        });

        window.addEventListener('resize', function() {
            mouseHandler.updateWindowSize();
        });

        // Mouse listeners
        window.addEventListener('mousemove', function(e) {
            mouseHandler.move(e);
        });
        window.addEventListener('mousedown', function(e) {
            mouseHandler.down(e);
        });
        window.addEventListener('mouseup', function(e) {
            mouseHandler.up(e);
        });

        // Keyboard listeners
        window.addEventListener('keydown', function(e) {
            keyboardHandler.logkey(e);
        });
        window.addEventListener('keyup', function(e) {
            keyboardHandler.reset(e);
        });
        window.dispatchEvent(new Event('resize'));

        this.doodleFetch.ask.subscribe(() => {
            this.doodleFetch.currentDraw = this.svg;
            this.doodleFetch.widthAttr = this.width;
            this.doodleFetch.heightAttr = this.height;
        });
        this.bgroundChangeSubscription();
    }

    routingTest() {
        this.svg.nativeElement.outerHTML = `<svg _ngcontent-qyk-c5="" id="canvas" name="canvas" #canvas xmlns="http://www.w3.org/2000/svg" style="width: 914px; height: 592px;"><rect _ngcontent-qyk-c5="" height="100%" id="drawingSpace" #drawingSpace width="100%" style="fill: rgb(255, 255, 255);"></rect><g _ngcontent-qyk-c5="" id="grid" #grid ng-reflect-ng-style="[object Object]" style="display: none;"></g><g _ngcontent-qyk-c5="" name="filters"></g><g _ngcontent-qyk-c5="" id="frame" #frame name="drawing"></g><g _ngcontent-qyk-c5="" id="inPrgress" #inPrgress name="in-progress"></g><g _ngcontent-qyk-c5="" id="selectedItems" #selectedItems name="selected-items"></g></svg>`;

        console.log('routing...');
        this.router.navigate(['/vue']);
    }

    ngOnDestroy() {
        this.mySubscription.unsubscribe();
    }
}
