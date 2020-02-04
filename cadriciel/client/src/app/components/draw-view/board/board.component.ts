import { Component, OnInit, /*HostListener,*/ ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { Canvas } from 'src/app/models/Canvas.model';
import { Subscription } from 'rxjs';
import { CanvasBuilderService } from 'src/app/services/drawing/canvas-builder.service';
import { InteractionService } from 'src/app/services/service-interaction/interaction.service';
import{ToolCreator} from '../../../services/draw-tool/toolCreator'
import { DrawingTool } from 'src/app/services/draw-tool/drawingTool';
import{KeyboardHandlerService} from '../../../services/keyboard-handler/keyboard-handler.service';
import{MouseHandlerService} from '../../../services/mouse-handler/mouse-handler.service';
@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {

  width: number;
  height: number;
  backColor: string;

  
  canvas: Canvas;
  canvasSubscr: Subscription;
  toolsMap = new Map();
  color1 = "1167B1";
  color2 = "000000";

  @ViewChild('inProgress', {static: false}) inProgressRef: ElementRef;
  @ViewChild('drawing', {static: false}) drawingRef: ElementRef;
 

  // for the tools
  pencil = ToolCreator.CreatePencil(false,10,this.color1,67, /*this.inProgressRef, this.drawingRef, this.renderer*/);
  rect = ToolCreator.CreateRectangle(false,3,this.color1,this.color2, 2,49, /*this.inProgressRef, this.drawingRef, this.renderer*/);
  line = ToolCreator.CreateLine(false,7,this.color1,true,15,76,/* this.inProgressRef, this.drawingRef, this.renderer*/);
  brush = ToolCreator.CreateBrush(false,10,this.color1, 1,87, /*this.inProgressRef, this.drawingRef, this.renderer*/);

  


  constructor(private canvBuildService: CanvasBuilderService, private interactionService: InteractionService, /*private renderer: Renderer2*/) {
    
    this.toolsMap.set("Rectangle", this.rect);
    this.toolsMap.set("Crayon", this.pencil);
    this.toolsMap.set("Pinceau", this.brush);
    this.toolsMap.set("Ligne", this.line);
  }

  
  //todo: Replace window with hose
  
  ngOnInit() {
    this.interactionService.$selectedTool.subscribe(tool =>{
      // pour gerer les cas derrreur ou il trouve pas loutil dans la map
      if(this.toolsMap.get(tool)){
        this.toolsMap.forEach(element => {
          element.selected = false;
        });
        let selectedTool: DrawingTool =this.toolsMap.get(tool);
        selectedTool.selected= true;
        console.log(tool + " has been sellected")
      }
    })
    this.initCanvas();
    this.canvBuildService.setOnGoing(document.getElementById('canvas'));   //devra être set à true dès l'usage d'un crayon

    this.canvBuildService.emitCanvas();
    let svg : HTMLElement | null = document.getElementById("canvas");
    let workingSpace : HTMLElement | null = document.getElementById("working-space");

    let keyboardHandler : KeyboardHandlerService = new KeyboardHandlerService();
    let mouseHandler = new MouseHandlerService(svg, workingSpace);
    this.toolsMap.forEach(element => {
      keyboardHandler.addToolObserver(element);
      mouseHandler.addObserver(element);
    });    
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
    this.canvasSubscr = this.canvBuildService.canvSubject.subscribe(
      (canvas: Canvas) => {
        if(canvas === undefined) {
          canvas = this.canvBuildService.getDefCanvas();
        }
        this.width = canvas.canvasWidth;
        this.height= canvas.canvasHeight;
        this.backColor = canvas.canvasColor;
      }
    );
  }
  
  ngOnDestroy() { // quand le component est détruit, la subscription n'existe plus
    this.canvasSubscr.unsubscribe();
    
  }

}
