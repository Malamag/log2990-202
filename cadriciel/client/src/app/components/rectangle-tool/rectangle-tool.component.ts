import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-rectangle-tool',
  templateUrl: './rectangle-tool.component.html',
  styleUrls: ['./rectangle-tool.component.scss']
})
export class RectangleToolComponent implements OnInit {

  height:number;
  width: number;
  X: number;
  Y: number;
  constructor() { }

  ngOnInit() {
  }
  
  getInitialPoints(event: MouseEvent){
    this.X = event.clientX
    this.Y = event.clientY
  }

  getRectAttributes(event: MouseEvent){
    this.height = event.movementX;
    this.width = event.movementY;
  }

  drawRectangle(event:MouseEvent){
    this.getInitialPoints(event);
    const frame = document.getElementById('mainFrame');
    frame.addEventListener("mousemove", 
    (event: MouseEvent) =>{ this.getRectAttributes(event)}
    )
    frame.addEventListener("mouseup", ()=> this.createRectangle)

  }
  createRectangle(){
      const rectangle = document.createElementNS("http://www.w3.org/2000/svg", "rect")
      const frame = document.getElementById("mainFrame");
      rectangle.setAttribute("height", this.height.toString());
      rectangle.setAttribute("width", this.width.toString());
      rectangle.setAttribute("X", this.X.toString());
      rectangle.setAttribute("Y", this.Y.toString());
      rectangle.setAttribute("fill", "blue");
      rectangle.setAttribute("stroke", "black");
      rectangle.setAttribute("stroke-width", "5");
      frame.appendChild(rectangle);
  }

}
