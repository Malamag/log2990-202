import { Component, OnInit} from '@angular/core';
import { DrawToolService } from 'src/app/services/draw-tool/draw-tool.service';
import { KeyboardHandlerService } from 'src/app/services/keyboard-handler/keyboard-handler.service';

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
      let s = "";
      if(test.ctrlDown)
      s+= "CTRL + ";
      if(test.shiftDown)
      s+= "SHIFT + ";
      s+= test.keyString;
      console.log(s);
    });

    window.addEventListener("keyup", function(e){
      test.reset(e);
      let s = "";
      if(test.ctrlDown)
      s+= "CTRL + ";
      if(test.shiftDown)
      s+= "SHIFT + ";
      s+= test.keyString;
      console.log(s);
    });

    let isSingleClick : boolean = true;
    let isDoubleClick : boolean = false;

    let _svg : HTMLElement | null = document.getElementById("canvas");

    let _workingSpace : HTMLElement | null = document.getElementById("working-space");

    let tools : any[] = [];

    let drawing_service : DrawToolService = new DrawToolService();
    let pencil = drawing_service.CreatePencil(_svg,_workingSpace,0,0,false,10,10);
    let rect = drawing_service.CreateRectangle(_svg,_workingSpace,0,0,false,10,10,15);
    let line = drawing_service.CreateLine(_svg,_workingSpace,0,0,false,10,10,true);
    let brush = drawing_service.CreateBrush(_svg,_workingSpace,0,0,true,10,10);

    tools.push(pencil);
    tools.push(rect);
    tools.push(line);
    tools.push(brush);

    tools.forEach(element => {
      test.addObserver(element);
    });

    if(_svg != null){

      window.addEventListener("mousemove", function(e){

        tools.forEach(element => {
          if(element.selected){
            element.mouseX = e.x;
            element.mouseY = e.y;
            element.move();
          }
        });

      });
      window.addEventListener("mousedown", function(e){

        isSingleClick = true;
        isDoubleClick = false;
        setTimeout(()=>{
            if(isSingleClick){
              console.log("single click");
                tools.forEach(element => {
                  if(element.selected){
                    element.mouseX = e.x;
                    element.mouseY = e.y;
                    element.down();
                  }
              });
            }
         },100)

      });
      window.addEventListener("mouseup", function(e){

        setTimeout(()=>{
          if(!isDoubleClick){
            console.log("up");
            tools.forEach(element => {
              if(element.selected){
                element.mouseX = e.x;
                element.mouseY = e.y;
                element.up();
              }
            });
          }
       },101)

      });
      window.addEventListener("dblclick",function(e){

        isSingleClick = false;
        isDoubleClick = true;

        console.log("dblclick");
        tools.forEach(element => {
          if(element.selected){
            element.mouseX = e.x;
            element.mouseY = e.y;
            element.doubleClick();
          }
        });
      });
    }
  }
}
