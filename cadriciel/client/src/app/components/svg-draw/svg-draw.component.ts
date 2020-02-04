import { Component, OnInit} from '@angular/core';
/*import { ToolCreator } from 'src/app/services/draw-tool/toolCreator';
import { KeyboardHandlerService } from 'src/app/services/keyboard-handler/keyboard-handler.service';
import { MouseHandlerService } from 'src/app/services/mouse-handler/mouse-handler.service';
import { DrawingTool } from 'src/app/services/draw-tool/drawingTool';*/

@Component({
  selector: 'app-svg-draw',
  templateUrl: './svg-draw.component.html',
  styleUrls: ['./svg-draw.component.scss']
})
export class SvgDrawComponent implements OnInit {

  constructor() { }

  ngOnInit() {

    //mouseHandler will need these references to evaluate clicks
    /*let svg : HTMLElement | null = document.getElementById("canvas");
    let workingSpace : HTMLElement | null = document.getElementById("working-space");

    let keyboardHandler : KeyboardHandlerService = new KeyboardHandlerService();
    //let mouseHandler = new MouseHandlerService(svg, workingSpace);

    let toolBox : DrawingTool[] = [];

    //Mockup values for testing
    let color1 = "1167B1";
    let color2 = "000000";

    

    //Create all the tools
    let pencil = ToolCreator.CreatePencil(false,10,color1,67);
    let rect = ToolCreator.CreateRectangle(false,3,color1,color2, 2,49);
    let line = ToolCreator.CreateLine(true,7,color1,true,15,76);
    let brush = ToolCreator.CreateBrush(false,10,color1, 1,87);

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
*/
  }
}
