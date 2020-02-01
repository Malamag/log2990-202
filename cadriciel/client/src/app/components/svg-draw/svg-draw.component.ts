import { Component, OnInit} from '@angular/core';
import { DrawToolService } from 'src/app/services/draw-tool/draw-tool.service';
import { KeyboardHandlerService } from 'src/app/services/keyboard-handler/keyboard-handler.service';
import { MouseHandlerService } from 'src/app/services/mouse-handler/mouse-handler.service';

@Component({
  selector: 'app-svg-draw',
  templateUrl: './svg-draw.component.html',
  styleUrls: ['./svg-draw.component.scss']
})
export class SvgDrawComponent implements OnInit {
  

  constructor() { }

  ngOnInit() {
    
    let test : KeyboardHandlerService = new KeyboardHandlerService();

    window.addEventListener("keydown", function(e){
      test.logkey(e);
      
    });

    window.addEventListener("keyup", function(e){
      test.reset(e);
     
    });

    

    let svg : HTMLElement | null = document.getElementById("canvas");

    let workingSpace : HTMLElement | null = document.getElementById("working-space");

    let tools : any[] = [];

    let color1 = "1167B1";
    let color2 = "FF781F";

    let drawing_service : DrawToolService = new DrawToolService();
    let pencil = drawing_service.CreatePencil(svg,workingSpace,true,10,color1);
    let rect = drawing_service.CreateRectangle(svg,workingSpace,false,10,color1,color2);
    let line = drawing_service.CreateLine(svg,workingSpace,false,10,color1,true);
    let brush = drawing_service.CreateBrush(svg,workingSpace,false,10,color1);

    let testMouse = new MouseHandlerService(svg, workingSpace);

    tools.push(pencil);
    tools.push(rect);
    tools.push(line);
    tools.push(brush);

    tools.forEach(element => {
      test.addObserver(element);
      testMouse.addObserver(element);
    });

    if(svg != null){

      window.addEventListener("mousemove", function(e){

        testMouse.move(e);
        
      });
      window.addEventListener("mousedown", function(e){
        testMouse.down(e);


      });
      window.addEventListener("mouseup", function(e){

        testMouse.up(e);

      });
      
    }
  }
}
