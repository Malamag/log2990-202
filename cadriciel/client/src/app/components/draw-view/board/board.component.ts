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

  @ViewChild('in-progress', {static: false}) inProgressRef: ElementRef<HTMLElement>;
  @ViewChild('drawing', {static: false}) drawingRef: ElementRef<HTMLElement>;
 

  // for the tools

  

  


  constructor(private canvBuildService: CanvasBuilderService, private interactionService: InteractionService, private renderer: Renderer2) {

  }

  
  //todo: Replace window with hose
  
  ngOnInit() {

    let tc:ToolCreator = new ToolCreator(document.getElementsByName("in-progress")[0], document.getElementsByName("drawing")[0]);

    let pencil = tc.CreatePencil(false,10,this.color1,67);
    let rect = tc.CreateRectangle(false,3,this.color1,this.color2, 2,49);
    let line = tc.CreateLine(false,7,this.color1,true,15,76);
    let brush = tc.CreateBrush(false,10,this.color1, 1,87);

    this.toolsMap.set("Rectangle", rect);
    this.toolsMap.set("Crayon", pencil);
    this.toolsMap.set("Pinceau", brush);
    this.toolsMap.set("Ligne", line);

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
