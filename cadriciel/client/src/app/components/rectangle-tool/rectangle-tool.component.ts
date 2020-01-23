import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-rectangle-tool',
  templateUrl: './rectangle-tool.component.html',
  styleUrls: ['./rectangle-tool.component.scss']
})
export class RectangleToolComponent implements OnInit{
  @ViewChild('svgRef', {static: false}) DomElement: ElementRef;
  height:number;
  width: number ;
  X1: number;
  Y1: number;
  X2: number;
  Y2: number;
  constructor(private renderer: Renderer2) { 
    
  }

  ngOnInit() {
    
  }

  
  
  getInitialPoints(event: MouseEvent){
    this.X1 = event.offsetX
    this.Y1 = event.offsetY
   
  }

  getRectAttributes(){
    if(Math.abs(this.X2-this.X1) === 0){ this.height= 5}
    else{this.height = Math.abs(this.X2-this.X1);}
    if(Math.abs(this.Y2-this.Y1) ===0){ this.width =5}
    else{this.width = Math.abs(this.Y2-this.Y1)}
  }
  getEndPoints(event: MouseEvent){

    this.X2= event.offsetX;
    this.Y2= event.offsetY;
  }
  drawRectangle(event:MouseEvent){
    this.getEndPoints(event);
    this.getRectAttributes();
    this.createRectangle()

  }
  createRectangle(){
      const rectangle = document.createElementNS("http://www.w3.org/2000/svg", "rect")
      
      rectangle.setAttribute("height", Math.abs(this.height).toString());
      rectangle.setAttribute("width", Math.abs(this.width).toString());
      /*rectangle.setAttribute("X", this.X1.toString());
      rectangle.setAttribute("Y", this.Y1.toString());*/
      rectangle.setAttribute("fill", "transparent");
      rectangle.setAttribute("stroke", "black");
      rectangle.setAttribute("stroke-width", "5");
      this.renderer.appendChild(this.DomElement.nativeElement,rectangle) ;
  }

}
