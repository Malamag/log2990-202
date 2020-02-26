import { Injectable } from '@angular/core';
import { FormsAttribute } from '../attributes/attribute-form';
import { ColorPickingService } from '../colorPicker/color-picking.service';
import { InteractionService } from '../service-interaction/interaction.service';
import { Point } from './point';
import { RectangleService } from './rectangle.service';
import { KeyboardHandlerService } from '../keyboard-handler/keyboard-handler.service';

@Injectable({
  providedIn: 'root'
})
export class EraserService extends RectangleService {

  isSquare: boolean;
  
  attr: FormsAttribute;

  constructor(inProgess: HTMLElement, drawing: HTMLElement, selected: boolean, interaction: InteractionService, colorPick: ColorPickingService) {
    super(inProgess, drawing, selected, interaction, colorPick);
  }

  // mouse up with rectangle in hand
  up(position: Point) {

    // in case we changed tool while the mouse was down
    if (!this.ignoreNextUp) {

      // the pencil should not affect the canvas
      this.isDown = false;
      
      // add everything to the canvas
      //this.currentPath = [];
      //this.inProgress.innerHTML = "";

      //this.updateDrawing();
    }
  }

  update(keyboard: KeyboardHandlerService) {
  }

  retrieveItemUnderMouse(mousePos:Point){

    let ws = document.getElementById("working-space");
    let sv = document.getElementById("canvas");

    let bsv = sv?sv.getBoundingClientRect():null;

    let px = mousePos.x;
    let py = mousePos.y;

    if(ws != null && bsv != null){
      px = mousePos.x + bsv.left - (ws ? ws.scrollLeft : 0);
      py = mousePos.y + bsv.top - (ws ? ws.scrollTop : 0);
    }

    let e = document.elementFromPoint(px,py);
    if(e!= null && e.id == "ignore"){
      e = null;
    }

    e = e?e.parentElement:null;

    return e;
  }

  eraseElement(e:Element|null){
    if(e == null)return;
    let p = e.parentElement;
    if(p == null)return;
    p.removeChild(e);
  }

  down(position: Point, insideWorkSpace:boolean, isRightClick:boolean) {

    // in case we changed tool while the mouse was down
    this.ignoreNextUp = false;

    // the rectangleTool should affect the canvas
    this.isDown = true;

    this.eraseElement(this.retrieveItemUnderMouse(position));

    // add the same point twice in case the mouse doesnt move
    //this.currentPath.push(position);
    //this.currentPath.push(position);

    //this.updateProgress();
  }

  move(position: Point) {
    // only if the rectangleTool is currently affecting the canvas
    if (this.isDown) {

      this.eraseElement(this.retrieveItemUnderMouse(position));

      // save mouse position
    //this.currentPath.push(position);

    //console.log(this.selectedItems);
    }
  }

  // Creates an svg rect that connects the first and last points of currentPath with the rectangle attributes
  createPath(p: Point[]) {

    let s = '';

    //We need at least 2 points
    if(p.length < 2){
      return s;
    }

    // first and last points
    const p1x = p[0].x;
    const p1y = p[0].y;
    const p2x = p[p.length - 1].x;
    const p2y = p[p.length - 1].y;

    // calculate the width and height of the rectangle
    let w = p2x - p1x;
    let h = p2y - p1y;

    // find top-left corner
    let startX = w > 0 ? p[0].x : p[p.length - 1].x;
    let startY = h > 0 ? p[0].y : p[p.length - 1].y;

    // if we need to make it square
    if (this.isSquare) {
      // get smallest absolute value between the width and the height
      const smallest = Math.abs(w) < Math.abs(h) ? Math.abs(w) : Math.abs(h);
      // adjust width and height (keep corresponding sign)
      w = smallest * Math.sign(w);
      h = smallest * Math.sign(h);

      // recalculate top-left corner
      startX = w > 0 ? p[0].x : p[0].x - smallest;
      startY = h > 0 ? p[0].y : p[0].y - smallest;
    }

    // create a divider
    s = '<g name = "selection-perimeter" id = "test_selection">';

    // get fill and outline stroke attributes from renderMode (outline, fill, outline + fill)
    //const stroke = (this.attr.plotType == 0 || this.attr.plotType == 2) ? `${this.chosenColor.secColor}` : 'none';
    //const fill = (this.attr.plotType == 1 || this.attr.plotType == 2) ? `${this.chosenColor.primColor}` : 'none';

    // set render attributes for the svg rect
    s += `<rect x="${startX}" y="${startY}"`;
    s += `width="${Math.abs(w)}" height="${Math.abs(h)}"`;

    s += `fill="rgba(0,102,204,0.3)"`;
    s += `stroke-width="5" stroke="rgba(0,102,204,0.9)" stroke-dasharray="5,5"/>`;

    // end the divider
    s += '</g>'

    // can't have rectangle with 0 width or height
    if (w == 0 || h == 0) {
      s = '';
    }

    return s;
  }
}
