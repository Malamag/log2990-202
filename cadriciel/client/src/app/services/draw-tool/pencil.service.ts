import { Injectable, /*ElementRef, Renderer2 */} from '@angular/core';
import { DrawingTool } from './drawingTool';
import { Point } from './point';
import { KeyboardHandlerService } from '../keyboard-handler/keyboard-handler.service';

@Injectable({
  providedIn: 'root'
})
export class PencilService extends DrawingTool {

  constructor(selected:boolean, width:number, primary_color:string,shortcut:number, /*inProgressRef: ElementRef, drawingRef: ElementRef, renderer: Renderer2*/){
    
    super(selected,width,primary_color,shortcut,/* inProgressRef, drawingRef, renderer*/);
  }

  //updating on key change 
  update(keyboard:KeyboardHandlerService){
    //keyboard has no effect on pencil
  }

  //mouse down with pencil in hand
  down(position:Point){

    //in case we changed tool while the mouse was down
    this.ignoreNextUp = false;

    //the pencil should affect the canvas
    this.isDown = true;

    //add the same point twice in case the mouse doesnt move
    this.currentPath.push(position);
    this.currentPath.push(position);

    this.updateProgress();
  }

  //mouse up with pencil in hand
  up(position:Point){

    //in case we changed tool while the mouse was down
    if(!this.ignoreNextUp){

      //the pencil should not affect the canvas
      this.isDown = false;

      //add everything to the canvas
      this.updateDrawing();
    }
  }

  //mouse move with pencil in hand
  move(position:Point){

    //only if the pencil is currently affecting the canvas
    if(this.isDown){

      //save mouse position
      this.currentPath.push(position);

      this.updateProgress();
    }
  }

  //mouse doubleClick with pencil in hand
  doubleClick(position:Point){
    //since its down -> up -> down -> up -> doubleClick, nothing more happens for the pencil
  }

  //Creates an svg path that connects every points of currentPath with the pencil attributes
  createPath(p:Point[]){

    //create a divider
    let s : string = '<g name = "pencil-stroke">';

    //start the path
    s += '<path d="';
    //move to first point
    s+= `M ${p[0].x} ${p[0].y} `;
    //for each succeding point, connect it with a line
    for(let i = 1; i < p.length;i++){
      s+= `L ${p[i].x} ${p[i].y} `;
    }
    //set render attributes
    s+=`\" stroke="#${this.primary_color}"`;
    s+= `stroke-width="${this.width}"`;
    s+= 'fill="none"';
    s+= 'stroke-linecap="round"';
    s+= 'stroke-linejoin="round"/>';
    //end the path
  
    //end the divider
    s+= "</g>";

    return s;
  }
}
