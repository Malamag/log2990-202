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
export class SelectionService extends RectangleService {

  isSquare: boolean;
  
  attr: FormsAttribute;

  selectedItems : Element[];
  moving : boolean;

  constructor(inProgess: HTMLElement, drawing: HTMLElement, selected: boolean, interaction: InteractionService, colorPick: ColorPickingService) {
    super(inProgess, drawing, selected, interaction, colorPick);
    this.selectedItems = [];
    this.moving = false;
  }

  // mouse up with rectangle in hand
  up(position: Point) {

    // in case we changed tool while the mouse was down
    if (!this.ignoreNextUp) {

      // the pencil should not affect the canvas
      this.isDown = false;
      
      // add everything to the canvas
      this.currentPath = [];
      this.inProgress.innerHTML = "";

      this.moving = false;

      //this.updateDrawing();
    }
  }

  update(keyboard: KeyboardHandlerService) {

    let xoff = 0;
    let yoff = 0;
    if(keyboard.keyCode == 39){
      xoff = 3;
    }else if(keyboard.keyCode == 37){
      xoff = -3;
    }
    else if(keyboard.keyCode == 38){
      yoff = -3;
    }else if(keyboard.keyCode == 40){
      yoff = 3;
    }

    if(this.selectedItems.length > 0){
      this.moveSelection(xoff,yoff);
      this.updateBoundingBox();
      document.getElementsByName("selected-items")[0].innerHTML = this.updateBoundingBox();
    }
  }

  updateBoundingBox(){

    // REFACTOR THIS ASAP IT HURTS
    let ws = document.getElementById("working-space");
    let sv = document.getElementById("canvas");

    let bsv = sv?sv.getBoundingClientRect():null;

    let minX = 1000000000;
    let maxX = -1;
    let minY = 1000000000;
    let maxY = -1;

    this.selectedItems.forEach(element => {
      let box = element.getBoundingClientRect();

      let tl = new Point(box.left, box.top);
      let br = new Point(box.right, box.bottom);

      minX = Math.min(minX, tl.x);
      maxX = Math.max(maxX, br.x);
      minY = Math.min(minY, tl.y);
      maxY = Math.max(maxY, br.y);
    });

    if(ws != null && bsv != null){
      minX = minX - bsv.left + (ws ? ws.scrollLeft : 0);
      maxX = maxX - bsv.left + (ws ? ws.scrollLeft : 0);
      minY = minY - bsv.top + (ws ? ws.scrollTop : 0);
      maxY = maxY - bsv.top + (ws ? ws.scrollTop : 0);
    }

    let testing = "";
    testing += `<rect id="selection" x="${minX}" y="${minY}"`;
    testing += `width="${maxX - minX}" height="${maxY - minY}"`;

    testing += `fill="rgba(0,120,215,0.3)"`;
    testing += `stroke-width="1" stroke="rgba(0,120,215,0.9)"/>`;

    return testing;
  }

  retrieveItemsInRect(){
    let r = this.inProgress.lastElementChild;
    let t = this.drawing.children;

    let rBox = r?r.getBoundingClientRect():null;

    let tl1:Point = new Point(rBox?rBox.left:-1, rBox?rBox.top:-1);
    let br1:Point = new Point(rBox?rBox.right:-1, rBox?rBox.bottom:-1);

    for(let i = 0; i < t.length; i++){
      let tBox = t[i].getBoundingClientRect();

      let tl2:Point = new Point(tBox.left, tBox.top);
      let br2:Point = new Point(tBox.right, tBox.bottom);

      let one:boolean = Point.rectOverlap(tl1, br1, tl2, br2);

      if(one){
        this.selectedItems.push(t[i]);
      }
    }
  }

  moveSelection(xoff:number,yoff:number){
    console.log(this.selectedItems);
    if(this.selectedItems){
      for(let i = 0; i < this.selectedItems.length; i++){
        let current = (this.selectedItems[i] as HTMLElement).style.transform;
        let s = current?current.split(","):"";
        let newX = +(s[0].replace(/[^\d.-]/g, '')) + xoff;
        let newY = +(s[1].replace(/[^\d.-]/g, '')) + yoff;
        (this.selectedItems[i] as HTMLElement).style.transform = `translate(${newX}px,${newY}px)`;
      }
    }
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
    if(e!=null){
      if(e.id == "selection"){
        /*
        let old = e;
        let dis = (e as HTMLElement).style.display;
        (e as HTMLElement).style.display = "none";
        e = document.elementFromPoint(px,py);
        (old as HTMLElement).style.display = dis;
        */
        e = null;
        this.moving = true;
      }
      if(e!= null && e.id == "ignore"){
        e = null;
      }
    }
    //console.log(e);

    e = e?e.parentElement:null;

    return e;
  }

  down(position: Point) {

    // in case we changed tool while the mouse was down
    this.ignoreNextUp = false;

    // the rectangleTool should affect the canvas
    this.isDown = true;

    // add the same point twice in case the mouse doesnt move
    this.currentPath.push(position);
    this.currentPath.push(position);


    let n = this.retrieveItemUnderMouse(position);
    if(!this.moving){
      this.selectedItems = [];
      if(n!=null){
        this.selectedItems.push(n);
    }
    }

    if(this.moving){
      console.log("MOVING");
    }
    document.getElementsByName("selected-items")[0].innerHTML = this.updateBoundingBox();

    this.updateProgress();
  }

  move(position: Point) {

    if(this.moving){
      for(let i = 0; i < this.selectedItems.length;i++){
        //console.log(this.selectedItems[i]);
        let prev = this.currentPath[this.currentPath.length-1];
        let offset = new Point(position.x - prev.x, position.y - prev.y);

        //console.log(offset);
        
        let current = (this.selectedItems[i] as HTMLElement).style.transform;
        let s = current?current.split(","):"";
        let newX = +(s[0].replace(/[^\d.-]/g, '')) + offset.x;
        let newY = +(s[1].replace(/[^\d.-]/g, '')) + offset.y;
        (this.selectedItems[i] as HTMLElement).style.transform = `translate(${newX}px,${newY}px)`;
      }
    }
    // only if the rectangleTool is currently affecting the canvas
    if (this.isDown) {

      

      // save mouse position
      this.currentPath.push(position);

      if(!this.moving){
        if(Point.distance(this.currentPath[0], this.currentPath[this.currentPath.length-1]) > 10){
          this.selectedItems = [];
          this.retrieveItemsInRect();
        }
        this.updateProgress();
      }


    document.getElementsByName("selected-items")[0].innerHTML = this.updateBoundingBox();
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
