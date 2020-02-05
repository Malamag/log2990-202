import { Component, OnInit, OnDestroy} from '@angular/core';
import { ToolCreator } from 'src/app/services/draw-tool/toolCreator';
import { KeyboardHandlerService } from 'src/app/services/keyboard-handler/keyboard-handler.service';
import { MouseHandlerService } from '../../../services/mouse-handler/mouse-handler.service';
import { DrawingTool } from 'src/app/services/draw-tool/drawingTool';
import { Subscription} from 'rxjs';
import { Canvas } from 'src/app/models/Canvas.model';
import { CanvasBuilderService } from 'src/app/services/drawing/canvas-builder.service';
@Component({
  selector: 'app-svg-draw',
  templateUrl: './svg-draw.component.html',
  styleUrls: ['./svg-draw.component.scss']
})
export class SvgDrawComponent implements OnInit, OnDestroy {

  constructor(private canvBuilder: CanvasBuilderService) { }
  canvas: Canvas;
  canvasSubscr: Subscription;
  width: number;
  height: number;
  backColor: string;

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

    let pencil = tc.CreatePencil(true,10,color1,67);
    let rect = tc.CreateRectangle(false,3,color1,color2, 2,49);
    let line = tc.CreateLine(false,3,color2,true,15,76);
    let brush = tc.CreateBrush(false,50,color1, 4,87);

    //Fill the toolbox
    toolBox.push(pencil);
    toolBox.push(rect);
    toolBox.push(line);
    toolBox.push(brush);

    //Subscribe each tool to keyboard and mouse
    toolBox.forEach(element => {
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
      }
    );
    this.canvBuilder.emitCanvas();
  }

  ngAfterViewInit(){
    window.dispatchEvent(new Event('resize'));
  }
  
  ngOnDestroy() { // quand le component est détruit, la subscription n'existe plus
    this.canvasSubscr.unsubscribe();
    
  }
}
