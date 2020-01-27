import { Injectable } from '@angular/core';
import{DrawingObject} from'./drawing-object'
@Injectable({
  providedIn: 'root'
})
export class PencilService extends DrawingObject{

  constructor() { 
    super()
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
