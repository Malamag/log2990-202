import { Injectable } from '@angular/core';
import { FormsAttribute } from '../attributes/attribute-form';
import { ColorPickingService } from '../colorPicker/color-picking.service';
import { InteractionService } from '../service-interaction/interaction.service';
import { Point } from './point';
import { RectangleService } from './rectangle.service';

@Injectable({
  providedIn: 'root'
})
export class SelectionService extends RectangleService {

  isSquare: boolean;
  
  attr: FormsAttribute

  constructor(inProgess: HTMLElement, drawing: HTMLElement, selected: boolean, interaction: InteractionService, colorPick: ColorPickingService) {

    super(inProgess, drawing, selected, interaction, colorPick);
  }

  // mouse up with rectangle in hand
  up(position: Point) {

    // in case we changed tool while the mouse was down
    if (!this.ignoreNextUp) {

      // the pencil should not affect the canvas
      this.isDown = false;

      let r = this.inProgress.lastElementChild;
      let t = this.drawing.children;

      let rBox = r?r.getBoundingClientRect():null;

      let tl1:Point = new Point(rBox?rBox.left:-1, rBox?rBox.top:-1);
      let br1:Point = new Point(rBox?rBox.right:-1, rBox?rBox.bottom:-1);
      
      console.log("___________________");

      let minX = 1000000000;
      let maxX = -1;
      let minY = 1000000000;
      let maxY = -1;

      for(let i = 0; i < t.length; i++){
        let tBox = t[i].getBoundingClientRect();

        let tl2:Point = new Point(tBox.left, tBox.top);
        let br2:Point = new Point(tBox.right, tBox.bottom);

        let one:boolean = Point.rectOverlap(tl1, br1, tl2, br2);

        if(one){
          minX = Math.min(minX, tl2.x);
          maxX = Math.max(maxX, br2.x);
          minY = Math.min(minY, tl2.y);
          maxY = Math.max(maxY, br2.y);
        }
      }

      // REFACTOR THIS ASAP IT HURTS
      let ws = document.getElementById("working-space");
      let sv = document.getElementById("canvas");

      let bsv = sv?sv.getBoundingClientRect():null;

      if(ws != null && bsv != null){
        minX = minX - bsv.left + (ws ? ws.scrollLeft : 0);
        maxX = maxX - bsv.left + (ws ? ws.scrollLeft : 0);
        minY = minY - bsv.top + (ws ? ws.scrollTop : 0);
        maxY = maxY - bsv.top + (ws ? ws.scrollTop : 0);
      }
      
      let testing = "";
      testing += `<rect x="${minX}" y="${minY}"`;
      testing += `width="${maxX - minX}" height="${maxY - minY}"`;

      testing += `fill="rgba(0,0,255,0.5)"`;
      testing += `stroke-width="1" stroke="blue"/>`;

      document.getElementsByName("selected-items")[0].innerHTML = testing;

      // add everything to the canvas
      this.currentPath = [];
      this.inProgress.innerHTML = "";

      //this.updateDrawing();
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
    const stroke = (this.attr.plotType == 0 || this.attr.plotType == 2) ? `${this.chosenColor.secColor}` : 'none';
    //const fill = (this.attr.plotType == 1 || this.attr.plotType == 2) ? `${this.chosenColor.primColor}` : 'none';

    // set render attributes for the svg rect
    s += `<rect x="${startX}" y="${startY}"`;
    s += `width="${Math.abs(w)}" height="${Math.abs(h)}"`;

    s += `fill="none"`;
    s += `stroke-width="${this.attr.lineThickness}" stroke="${stroke}" stroke-dasharray="5,5"/>`;

    // end the divider
    s += '</g>'

    // can't have rectangle with 0 width or height
    if (w == 0 || h == 0) {
      s = '';
    }

    return s;
  }
}
