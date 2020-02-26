import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { Subscription} from 'rxjs';
import { Canvas } from 'src/app/models/Canvas.model';
import { ColorPickingService } from 'src/app/services/colorPicker/color-picking.service';
import { DrawingTool } from 'src/app/services/draw-tool/drawingTool';
import { ToolCreator } from 'src/app/services/draw-tool/toolCreator';
import { CanvasBuilderService } from 'src/app/services/drawing/canvas-builder.service';
import { KeyboardHandlerService } from 'src/app/services/keyboard-handler/keyboard-handler.service';
import { InteractionService } from 'src/app/services/service-interaction/interaction.service';
import { MouseHandlerService } from '../../../services/mouse-handler/mouse-handler.service';
import { DoodleFetchService } from 'src/app/services/doodle-fetch/doodle-fetch.service';

@Component({
  selector: 'app-svg-draw',
  templateUrl: './svg-draw.component.html', // changed file type
  styleUrls: ['./svg-draw.component.scss']
})
export class SvgDrawComponent implements OnInit, OnDestroy, AfterViewInit {

  constructor(
    private canvBuilder: CanvasBuilderService, 
    public interaction: InteractionService, 
    public colorPick: ColorPickingService,
    private doodleFetch: DoodleFetchService) { }

  canvas: Canvas;
  canvasSubscr: Subscription;
  width: number;
  height: number;
  backColor: string;

  toolsContainer = new Map();

  @ViewChild('inPrgress', {static: false})inProgress: ElementRef
  @ViewChild('canvas', {static: false}) svg: ElementRef


  @ViewChild('frame', {static: false}) frameRef: ElementRef;
  

  workingSpace: HTMLElement

  ngOnInit() {
    this.interaction.$refObs.subscribe((ref) => {
      this.workingSpace = ref.nativeElement
    })

    this.initCanvas();

  }



  closeTools(map: Map<string, DrawingTool>) {
    map.forEach((el) => {
      el.selected = false;
    })
  }

  


  initCanvas() {
    this.canvasSubscr = this.canvBuilder.canvSubject.subscribe(
      (canvas: Canvas) => {
        if (canvas === undefined || canvas === null) {
          canvas = this.canvBuilder.getDefCanvas();
        }
        this.width = canvas.canvasWidth;
        this.height = canvas.canvasHeight;
        this.backColor = canvas.canvasColor;
        this.canvBuilder.whipeDraw(this.frameRef);
      }
    );
    this.canvBuilder.emitCanvas();
  }


  ngAfterViewInit() {

    const keyboardHandler: KeyboardHandlerService = new KeyboardHandlerService();
    const mouseHandler = new MouseHandlerService(this.svg.nativeElement, this.workingSpace);
    
    // Create all the tools
    const tc = new ToolCreator(this.inProgress.nativeElement, this.frameRef.nativeElement);

    const pencil = tc.CreatePencil(true, this.interaction, this.colorPick);
    const rect = tc.CreateRectangle(false, this.interaction, this.colorPick);
    const line = tc.CreateLine(false, this.interaction, this.colorPick);
    const brush = tc.CreateBrush(false, this.interaction, this.colorPick);
    const ellipse = tc.CreateEllipse(false, this.interaction, this.colorPick);
    const selection = tc.CreateSelection(false, this.interaction, this.colorPick);
    const colorEditor = tc.CreateColorEditor(false, this.interaction, this.colorPick);
    this.toolsContainer.set('Rectangle', rect);
    this.toolsContainer.set('Ligne', line);
    this.toolsContainer.set('Pinceau', brush);
    this.toolsContainer.set('Crayon', pencil);
    this.toolsContainer.set('Ellipse',ellipse);
    this.toolsContainer.set('Selection',selection);
    this.toolsContainer.set('ColorEditor',colorEditor);
    this.interaction.$cancelToolsObs.subscribe((sig) => {
      if (sig) {
          this.closeTools(this.toolsContainer)
      }
    })
    this.interaction.$selectedTool.subscribe((toolName) => {
      if (this.toolsContainer.get(toolName)) {
        this.closeTools(this.toolsContainer);
        this.toolsContainer.get(toolName).selected = true;
      }
    })

    // Subscribe each tool to keyboard and mouse
    this.toolsContainer.forEach((element) => {
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

    this.doodleFetch.ask.subscribe(
      ()=>{
        this.doodleFetch.currentDraw = this.svg;
        this.doodleFetch.widthAttr = this.width;
        this.doodleFetch.heightAttr = this.height;
      }
    );
  }

  ngOnDestroy() { // quand le component est détruit, la subscription n'existe plus
    this.canvasSubscr.unsubscribe();


  }

}
