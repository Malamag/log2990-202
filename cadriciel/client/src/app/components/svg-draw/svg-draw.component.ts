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

    //let currentX : number = -1;
    //let currentY : number = -1;

    //let mouseDown : boolean = false;

    //let currentPath : Point[] = [];

    //let drawing : DrawingObject[] = [];

    //let isARect : boolean = false;

    //let startedInsideWorkSpace : boolean = false;

    let isSingleClick : boolean = true;

    let _svg : HTMLElement | null = document.getElementById("canvas");
    //@ViewChild('working-space') _workingSpace:ElementRef;
    //_svg = document.getElementById("canvas");
    let _workingSpace : HTMLElement | null = document.getElementById("working-space");

    let tools : any[] = [];

    let drawing_service : DrawToolService = new DrawToolService(test);
    let pencil = drawing_service.CreatePencil(_svg,_workingSpace,0,0,false,10,10);
    let rect = drawing_service.CreateRectangle(_svg,_workingSpace,0,0,true,10,10,15);
    let line = drawing_service.CreateLine(_svg,_workingSpace,0,0,false,10,10,true);

    tools.push(pencil);
    tools.push(rect);
    tools.push(line);

    tools.forEach(element => {
      drawing_service.keyboard.addObserver(element);
    });

    if(_svg != null){

      //let _svgBox : ClientRect = _svg.getBoundingClientRect();

      window.addEventListener("mousemove", function(e){

        tools.forEach(element => {
          if(element.selected){
            element.mouseX = e.x;
            element.mouseY = e.y;
            element.move();
          }
        });

        /*
        if(startedInsideWorkSpace){
          currentX = e.x - _svgBox.left + (_workingSpace? _workingSpace.scrollLeft : 0);
        currentY = e.y - _svgBox.top + (_workingSpace? _workingSpace.scrollTop : 0);

        if(mouseDown){
          currentPath.push(new Point(currentX, currentY));
          let d : string = "";
          d+= isARect? new Rectangle(currentPath).draw() : new CrayonStroke(currentPath).draw();
          document.getElementsByTagName("g")[1].innerHTML = d;
        }
        }*/
      });
      window.addEventListener("mousedown", function(e){

        isSingleClick = true;
        setTimeout(()=>{
            if(isSingleClick){
                tools.forEach(element => {
                  if(element.selected){
                    element.mouseX = e.x;
                    element.mouseY = e.y;
                    element.down();
                  }
              });
            }
         },100)

        /*
        if(e.x - _svgBox.left + (_workingSpace? _workingSpace.scrollLeft : 0) >= _svgBox.left && e.y - _svgBox.top + (_workingSpace? _workingSpace.scrollTop : 0) >= _svgBox.top){
          startedInsideWorkSpace = true;
        }else{
          startedInsideWorkSpace = false;
        }
        if(startedInsideWorkSpace){
          console.log("-----CLICKED INSIDE-----");
          mouseDown = true;
          currentX = e.x - _svgBox.left + (_workingSpace? _workingSpace.scrollLeft : 0);
          currentY = e.y - _svgBox.top + (_workingSpace? _workingSpace.scrollTop : 0);
          currentPath.push(new Point(currentX,currentY));
          currentPath.push(new Point(currentX,currentY));
          let d : string = "";
            d+= isARect? new Rectangle(currentPath).draw() : new CrayonStroke(currentPath).draw();
            document.getElementsByTagName("g")[1].innerHTML = d;
        }*/
      });
      window.addEventListener("mouseup", function(e){

        tools.forEach(element => {
          if(element.selected){
            element.mouseX = e.x;
            element.mouseY = e.y;
            element.up();
          }
        });

        /*
        if(startedInsideWorkSpace){
          console.log("-----RELEASED-----");
          mouseDown = false;
          drawing.push(isARect? new Rectangle(currentPath) : new CrayonStroke(currentPath));
          currentPath = [];
          let d : string = "";
          drawing.forEach(element => {
            d+= element.draw();
          });
          document.getElementsByTagName("g")[0].innerHTML = d;
          document.getElementsByTagName("g")[1].innerHTML = "";
          isARect = !isARect;
        }*/
      });
      window.addEventListener("dblclick",function(e){

        isSingleClick = false;

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

/*

class Point{
  x:number;
  y:number;
  constructor(x:number, y:number){
    this.x = x;
    this.y = y;
  }
}

abstract class DrawingObject{

  path:Point[];
  abstract draw(): string;

  constructor(p:Point[]){
    this.path = p;
  }

}

class CrayonStroke extends DrawingObject{
  constructor(p:Point[]){
    super(p);
  }

  draw(){

    let s = "<path d=\"";
    s+= `M ${this.path[0].x} ${this.path[0].y} `;
    for(let i = 1; i < this.path.length;i++){
      s+= `L ${this.path[i].x} ${this.path[i].y} `;
    }
    s+="\" stroke=\"red\" stroke-width=\"10\" fill=\"none\" stroke-linecap=\"round\" stroke-linejoin=\"round\" />";
  
    return s;
  }

}

class Rectangle extends DrawingObject{
  constructor(p:Point[]){
    super(p);
  }

  draw(){

    let w = this.path[this.path.length-1].x - this.path[0].x;
    let h = this.path[this.path.length-1].y - this.path[0].y;
    
    let startX = w > 0 ? this.path[0].x : this.path[this.path.length-1].x;
    let startY = h > 0 ? this.path[0].y : this.path[this.path.length-1].y;
    
    let _s = `<rect x=\"${startX}\" y=\"${startY}\" width=\"${Math.abs(w)}\" height=\"${Math.abs(h)}\" fill="blue"/>`;
    return _s;
  }

}*/
