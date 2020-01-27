import { Injectable } from '@angular/core';
import{DrawingObject} from'./drawing-object'
@Injectable({
  providedIn: 'root'
})
export class RectangleService extends DrawingObject{

  constructor() {
    super(); 
  }

  getAttributes() : number[]{
    let w = this.path[this.path.length-1].x - this.path[0].x;
    let h = this.path[this.path.length-1].y - this.path[0].y;
    let attributes: number[]= [];
    attributes.push(w);
    attributes.push(h);
    return attributes;
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
