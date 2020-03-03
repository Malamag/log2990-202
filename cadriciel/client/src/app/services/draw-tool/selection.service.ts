import { Injectable, Renderer2} from '@angular/core';
import { FormsAttribute } from '../attributes/attribute-form';
import { ColorPickingService } from '../colorPicker/color-picking.service';
import { InteractionService } from '../service-interaction/interaction.service';
import { Point } from './point';
import { KeyboardHandlerService } from '../keyboard-handler/keyboard-handler.service';
import { ShapeService } from './shape.service';

@Injectable({
  providedIn: 'root'
})
export class SelectionService extends ShapeService {

  isSquare: boolean;
  attr: FormsAttribute;
  under:any;
  canMoveSelection : boolean;
  found :boolean;
  selectedItems : Element[];
  moving : boolean;
  render:Renderer2;
  selectedRef: HTMLElement
  canvas: HTMLElement
  workingSpace: HTMLElement

  constructor(inProgess: HTMLElement, drawing: HTMLElement, selected: boolean, interaction: InteractionService,
              colorPick: ColorPickingService, render: Renderer2, selectedItems: HTMLElement, canvas: HTMLElement, workingSapce: HTMLElement) {
    super(inProgess, drawing, selected, interaction, colorPick);
    this.selectedItems = [];
    this.moving = false;
    this.canMoveSelection = true;
    this.render = render;
    this.found = false;
    this.selectedRef = selectedItems;
    this.canvas = canvas;
    this.workingSpace = workingSapce 
    this.render.listen(this.selectedRef,"mousedown",()=>{
      if(!this.found){
        this.moving = true;
        this.found = true;
      }
    });

    window.addEventListener("newDrawing",(e:Event)=>{
      for(let i = 0; i < this.drawing.childElementCount; i++){
        let el = this.drawing.children[i];
        let status = el.getAttribute("isListening");
        if(status !== "true"){
          this.render.listen(el,"mousedown", () =>{
            this.render.setAttribute(el, "isListening","true");
            if(!this.found){
              this.under = el;
              this.found = true;
            }
          });
        }
      }
    })
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

    if(keyboard.keyCode == 65 && keyboard.ctrlDown){
      this.selectedItems = [];
      for(let i = 0; i < this.drawing.children.length;i++){
        this.selectedItems.push(this.drawing.children[i]);
      }
      this.selectedRef.innerHTML = this.updateBoundingBox();
    }

    if(this.canMoveSelection){
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
        this.selectedRef.innerHTML = this.updateBoundingBox();
        //console.log(new Date().getTime());
        this.canMoveSelection = false;
        setTimeout(() => {
          this.canMoveSelection = true;
        }, 100);
      }
    }
  }

  updateBoundingBox(){

    // REFACTOR THIS ASAP IT HURTS
    let ws = document.getElementById("working-space");
    let sv = this.canvas

    let bsv = sv?sv.getBoundingClientRect():null;

    let isValidNumber = false;
    let minX:[number,boolean] = [1000000000,isValidNumber];
    let maxX:[number,boolean] = [-1,isValidNumber];
    let minY:[number,boolean] = [1000000000,isValidNumber];
    let maxY:[number,boolean] = [-1,isValidNumber];

    this.selectedItems.forEach(element => {

      for(let i = 0; i < element.childElementCount;i++){
        let current = element.children[i] as HTMLElement;
        if(current.tagName.toString() == "filter"){
          continue;
        }
        let childStrokeWidth = current.getAttribute("stroke-width");
        let currentOffset = childStrokeWidth?+childStrokeWidth/2:0;
  
        let box = current.getBoundingClientRect();
  
        let tl:Point = new Point(box.left - currentOffset, box.top - currentOffset);
        let br:Point = new Point(box.right + currentOffset, box.bottom + currentOffset);
  
        minX = tl.x<minX[0]? [tl.x,true]:[minX[0],minX[1]];
        maxX = br.x>maxX[0]? [br.x,true]:[maxX[0],maxX[1]];
        minY = tl.y<minY[0]? [tl.y,true]:[minY[0],minY[1]];
        maxY = br.y>maxY[0]? [br.y,true]:[maxY[0],maxY[1]];
      }
    });

    if(ws != null && bsv != null){
      minX[0] = minX[0] - bsv.left + (ws ? ws.scrollLeft : 0);
      maxX[0] = maxX[0] - bsv.left + (ws ? ws.scrollLeft : 0);
      minY[0] = minY[0] - bsv.top + (ws ? ws.scrollTop : 0);
      maxY[0] = maxY[0] - bsv.top + (ws ? ws.scrollTop : 0);
    }

    let testing = "";
    if(minX[1] && maxX[1] && minY[1] && maxY[1]){
      testing += `<rect id="selection" x="${minX[0]}" y="${minY[0]}"`;
      testing += `width="${maxX[0] - minX[0]}" height="${maxY[0] - minY[0]}"`;
  
      testing += `fill="rgba(0,120,215,0.3)"`;
      testing += `stroke-width="1" stroke="rgba(0,120,215,0.9)"/>`;
    }

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
    if(this.selectedItems){
      for(let i = 0; i < this.selectedItems.length; i++){
        let current = (this.selectedItems[i] as HTMLElement).style.transform;
        let s = current?current.split(","):"";
        let newX = +(s[0].replace(/[^\d.-]/g, '')) + xoff;
        let newY = +(s[1].replace(/[^\d.-]/g, '')) + yoff;
        //this.render.setAttribute(this.selectedItems[i],"transform","translate(10px,10px)");
        (this.selectedItems[i] as HTMLElement).style.transform = `translate(${newX}px,${newY}px)`;
      }
    }
  }

  retrieveItemUnderMouse(){

  }

  down(position: Point) {

    // in case we changed tool while the mouse was down
    this.ignoreNextUp = false;

    // the rectangleTool should affect the canvas
    this.isDown = true;

    // add the same point twice in case the mouse doesnt move
    this.currentPath.push(position);
    this.currentPath.push(position);

    let n = this.under;
    if(!this.moving){
      if(n == null && this.selectedItems.length != 0){
        console.log("now");
        this.interaction.emitDrawingDone();
      }
      this.selectedItems = [];
      if(n!=null){
        this.selectedItems.push(n);
      }
    }
    this.under = null;
    this.found = false;

    this.selectedRef.innerHTML = this.updateBoundingBox();

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
        //console.log(this.selectedItems[i]);
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


    this.selectedRef.innerHTML = this.updateBoundingBox();
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
    s = '<g name = "selection-perimeter">';

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
