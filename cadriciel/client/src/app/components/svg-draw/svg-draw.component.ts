import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-svg-draw',
  templateUrl: './svg-draw.component.html',
  styleUrls: ['./svg-draw.component.scss']
})
export class SvgDrawComponent implements OnInit {

  constructor() { }

  ngOnInit() {

    let currentX : number = -1;
    let currentY : number = -1;

    let mouseDown : boolean = false;

    let currentPath : Point[] = [];

    let drawing : DrawingObject[] = [];

    let isARect : boolean = false;

    let _svg : HTMLElement | null = document.getElementById("canvas");
    //_svg = document.getElementById("canvas");

    if(_svg != null){

      let _svgBox : ClientRect = _svg.getBoundingClientRect();

      window.addEventListener("mousemove", function(e){

        currentX = e.x - _svgBox.left;
        currentY = e.y - _svgBox.top;

        if(mouseDown){
          currentPath.push(new Point(currentX, currentY));
          let d : string = "";
          d+= isARect? new Rectangle(currentPath).draw() : new CrayonStroke(currentPath).draw();
          document.getElementsByTagName("g")[1].innerHTML = d;
        }
      });
      _svg.addEventListener("mousedown", function(e){
        console.log("-----CLICKED INSIDE-----");
        mouseDown = true;
        currentX = e.x - _svgBox.left;
        currentY = e.y - _svgBox.top;
        currentPath.push(new Point(currentX,currentY));
        currentPath.push(new Point(currentX,currentY));
        let d : string = "";
          d+= isARect? new Rectangle(currentPath).draw() : new CrayonStroke(currentPath).draw();
          this.getElementsByTagName("g")[1].innerHTML = d;
      });
      window.addEventListener("mousedown", function(e){
        console.log("-----CLICKED OUTSIDE-----");
        mouseDown = true;
      });
      window.addEventListener("mouseup", function(e){
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
      });
    }
  }
}

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

}
