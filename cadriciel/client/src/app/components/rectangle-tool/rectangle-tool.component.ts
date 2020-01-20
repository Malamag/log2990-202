import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-rectangle-tool',
  templateUrl: './rectangle-tool.component.html',
  styleUrls: ['./rectangle-tool.component.scss']
})
export class RectangleToolComponent implements OnInit {

  height:number;
  width: number;
  X1: number;
  Y1: number;
  X2: number;
  Y2: number;
  constructor() { }

  ngOnInit() {
  }
  
  getInitialPoints(event: MouseEvent){
    this.X1 = event.clientX
    this.Y1 = event.clientY
  }

  getRectAttributes(){
    this.height = Math.abs(this.X2-this.X1);
    this.width = Math.abs(this.Y2-this.Y1)
  }
  getEndPoints(event: MouseEvent){
    this.X2= event.clientX;
    this.Y2= event.clientY;
  }
  drawRectangle(event:MouseEvent){
    this.getInitialPoints(event);
    const frame = document.getElementById('mainFrame');
    frame.addEventListener("mouseup", (event: MouseEvent)=> 
    {
      this.getEndPoints(event);
      this.getRectAttributes();
      this.createRectangle()})

  }
  createRectangle(){
      const rectangle = document.createElementNS("http://www.w3.org/2000/svg", "rect")
      const frame = document.getElementById("mainFrame");
      rectangle.setAttribute("height", Math.abs(this.height).toString());
      rectangle.setAttribute("width", Math.abs(this.width).toString());
      rectangle.setAttribute("X", this.X1.toString());
      rectangle.setAttribute("Y", this.Y1.toString());
      rectangle.setAttribute("fill", "blue");
      rectangle.setAttribute("stroke", "black");
      rectangle.setAttribute("stroke-width", "5");
      frame.appendChild(rectangle);
  }

}
