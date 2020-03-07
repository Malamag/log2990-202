import { Injectable } from '@angular/core';
import { DrawingTool } from './drawingTool';
import { KeyboardHandlerService } from '../keyboard-handler/keyboard-handler.service';
import { Point } from './point';
import { InteractionService } from '../service-interaction/interaction.service';
import { ColorPickingService } from '../colorPicker/color-picking.service';
import { AerosolAttributes } from '../attributes/aerosol-attribute';
import { interval, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AerosolService extends DrawingTool{

  private attr: AerosolAttributes;

  private lastPoint:Point;

  private points:Point[];

  private path:string;

  private sub: Subscription;  

  constructor(inProgess: HTMLElement, drawing: HTMLElement, selected: boolean, interaction: InteractionService, colorPick: ColorPickingService) {
    super(inProgess, drawing, selected, interaction, colorPick);
    this.attr = new AerosolAttributes(
      this.defaultValues.DEFAULTEMISSIONPERSECOND,
      this.defaultValues.DEFAULTDIAMETER,
    );
    this.updateColors();
    this.updateAttributes();
    this.lastPoint = new Point(0,0);
    this.points = new Array();
  }

  updateAttributes() {
    this.interaction.$aerosolAttributes.subscribe((obj) => {
      if (obj) {
        this.attr = new AerosolAttributes(obj.emissionPerSecond, obj.diameter)
      }
    })
  }

  subscribe(){
    const srcInterval = interval(1000/this.attr.emissionPerSecond);
    this.sub = srcInterval.subscribe(val => {
      if(this.isDown){
        this.updateProgress()
      }
      else{
        this.sub.unsubscribe();
      }
    });
  }

  // updating on key change
  update(keyboard: KeyboardHandlerService) {
    // keyboard has no effect on pencil
  }

  // mouse down with pencil in hand
  down(position: Point) {

    // in case we changed tool while the mouse was down
    this.ignoreNextUp = false;

    // the pencil should affect the canvas
    this.isDown = true;

    // add the same point twice in case the mouse doesnt move
    this.currentPath.push(position);
    this.currentPath.push(position);
  
    this.subscribe();

    this.startPath();

    this.updateProgress();
    
  }

  // mouse up with pencil in hand
  up(position: Point, insideWorkspace: boolean) {

    // in case we changed tool while the mouse was down
    if (!this.ignoreNextUp) {

      // the pencil should not affect the canvas
      this.isDown = false;

      // no path is created while outside the canvas
      if (insideWorkspace) {
        // add everything to the canvas
        this.updateDrawing();
      }
    }
  }

  // mouse move with pencil in hand
  move(position: Point) {

    // only if the pencil is currently affecting the canvas
    if (this.isDown) {

      // save mouse position
      this.currentPath.push(position);

      //this.updateProgress();
    }
  }

  // mouse doubleClick with pencil in hand
  doubleClick(position: Point) {
    // since its down -> up -> down -> up -> doubleClick, nothing more happens for the pencil
  }

  startPath(){
    
    this.path = '<g name = "aerosol">';
    //this.path += ' <filter id="blur"> <feGaussianBlur in="SourceGraphic" stdDeviation="1" /> </filter>';

    this.lastPoint = new Point(0,0);
  }

  // Creates an svg path that connects every points of currentPath with the pencil attributes
  createPath(p: Point[]) {

    this.lastPoint = p[p.length-1]

    this.generatePoint();

    const pointRadius = this.attr.diameter/25;
    for(let i = 0; i < this.points.length; i++) {
      this.path += `<circle cx="${this.points[i].x}" cy="${this.points[i].y}"`;
      this.path += `r="${pointRadius}"`; // to get the radius
      this.path += 'stroke="none"';
      this.path += `fill="${this.chosenColor.primColor}"/>`;
      //this.path +=  'filter="url(#blur)"/>';
    }   
    this.points = new Array(); 

    // end the divider
    let s = this.path;
    s += '</g>';
    return s;
  }

  generatePoint() {
    if(this.isDown){
      for (let j = 1; j < 5 && this.isDown ; j++) {
      let r = (this.attr.diameter / 2) * Math.sqrt(Math.random());
      let angle = Math.random() * 2 * Math.PI;
      for (let i = 1; i < 5 ; i++) {
        let x = this.lastPoint.x + r * Math.cos(angle*i);
        let y = this.lastPoint.y + r * Math.sin(angle*i);
        this.points.push(new Point(x,y));
      }  
    }
  }
}

}
