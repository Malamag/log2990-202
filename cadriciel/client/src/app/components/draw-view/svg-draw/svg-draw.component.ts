import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit, Renderer2} from '@angular/core';
import { ToolCreator } from 'src/app/services/draw-tool/toolCreator';
import { KeyboardHandlerService } from 'src/app/services/keyboard-handler/keyboard-handler.service';
import { MouseHandlerService } from '../../../services/mouse-handler/mouse-handler.service';
import { DrawingTool } from 'src/app/services/draw-tool/drawingTool';
import { Subscription} from 'rxjs';
import { Canvas } from 'src/app/models/Canvas.model';
import { CanvasBuilderService } from 'src/app/services/drawing/canvas-builder.service';
import { InteractionService } from 'src/app/services/service-interaction/interaction.service';
import { ColorPickingService } from 'src/app/services/colorPicker/color-picking.service';

@Component({
  selector: 'app-svg-draw',
  templateUrl: './svg-draw.component.html',
  styleUrls: ['./svg-draw.component.scss']
})
export class SvgDrawComponent implements OnInit, OnDestroy, AfterViewInit {

  constructor(private canvBuilder: CanvasBuilderService, private interaction: InteractionService, private renderer: Renderer2, private colorPick: ColorPickingService) { }
  canvas: Canvas;
  canvasSubscr: Subscription;
  width: number;
  height: number;
  backColor: string;

  toolsContainer = new Map();
  workSpace: HTMLElement
  svg: HTMLElement
  inProgress: HTMLElement
  drawing: HTMLElement

  @ViewChild('frame', {static: false}) frameRef: ElementRef;

  ngOnInit() {
    this.initCanvas();
    //mouseHandler will need these references to evaluate clicks
    let svg : HTMLElement | null = document.getElementById("canvas");
    let workingSpace : HTMLElement | null = document.getElementById("working-space");

    let keyboardHandler : KeyboardHandlerService = new KeyboardHandlerService();
    let mouseHandler = new MouseHandlerService(svg, workingSpace);

    let toolBox : DrawingTool[] = [];

    //Mockup values for testing
    let color1 = "1167B1";
    let color2 = "000000";

    //Create all the tools
    let tc = new ToolCreator(document.getElementsByName("in-progress")[0], document.getElementsByName("drawing")[0]);

    let pencil = tc.CreatePencil(true,10,color1,67, this.interaction, this.colorPick);
    let rect = tc.CreateRectangle(false,3,color1,color2, 2,49, this.interaction, this.colorPick);
    let line = tc.CreateLine(false,3,color2,true,15,76, this.interaction, this.colorPick);
    let brush = tc.CreateBrush(false,50,color1, 4,87, this.interaction, this.colorPick);


    this.toolsContainer.set("Rectangle", rect);
    this.toolsContainer.set("Ligne", line);
    this.toolsContainer.set("Pinceau", brush);
    this.toolsContainer.set("Crayon", pencil);
    this.interaction.$selectedTool.subscribe(toolName=>{
      if(this.toolsContainer.get(toolName)){
        this.toolsContainer.forEach(element => {
          element.selected = false;
        });
      } else{
        toolName = "Crayon"; // default tool
      }
        let selectedTool: DrawingTool =this.toolsContainer.get(toolName);
        selectedTool.selected= true;
    })

    //Fill the toolbox
   

    //Subscribe each tool to keyboard and mouse
    this.toolsContainer.forEach(element => {
      keyboardHandler.addToolObserver(element);
      mouseHandler.addObserver(element);
    });

    window.addEventListener("resize",function(){
      console.log("resize");
      mouseHandler.updateWindowSize();
    });

    //Mouse listeners
    window.addEventListener("mousemove", function(e){
      mouseHandler.move(e);
    });
    window.addEventListener("mousedown", function(e){
      mouseHandler.down(e);
      
    });
    window.addEventListener("mouseup", function(e){
      mouseHandler.up(e);
    });

    //Keyboard listeners
    window.addEventListener("keydown", function(e){
      keyboardHandler.logkey(e);
    });
    window.addEventListener("keyup", function(e){
      keyboardHandler.reset(e);
    });
  }

  initCanvas() {
    this.canvasSubscr = this.canvBuilder.canvSubject.subscribe(
      (canvas: Canvas) => {
        if(canvas === undefined || canvas === null) {
          canvas = this.canvBuilder.getDefCanvas();
        }
        this.width = canvas.canvasWidth;
        this.height= canvas.canvasHeight;
        this.backColor = canvas.canvasColor;
        this.canvBuilder.whipeDraw(this.frameRef);
      }
    );
    this.canvBuilder.emitCanvas();
  }

  ngAfterViewInit(){
    // the 
    this.workSpace = this.renderer.createElement('div')
    this.renderer.setAttribute(this.workSpace, 'width', this.width.toString())
    this.renderer.setAttribute(this.workSpace, 'height', this.height.toString())
    this.renderer.appendChild(this.frameRef.nativeElement, this.workSpace)

    // the svg
    this.svg= this.renderer.createElement('svg', 'http://www.w3.org/2000/svg')
    this.renderer.setAttribute(this.svg, 'baseProfile', 'full')
    this.renderer.setAttribute(this.svg, 'version', '1.1')
    this.renderer.setAttribute(this.svg, 'width', '')
    this.renderer.setAttribute(this.svg, 'height', '100%')
    this.renderer.appendChild(this.workSpace, this.svg)

    window.dispatchEvent(new Event('resize'));
    
  }
  
  ngOnDestroy() { // quand le component est détruit, la subscription n'existe plus
    this.canvasSubscr.unsubscribe();
    
  }

}
