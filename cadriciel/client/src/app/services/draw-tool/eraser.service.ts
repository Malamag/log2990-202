import { Injectable, Renderer2 } from '@angular/core';
import { ToolsAttributes } from '../attributes/tools-attribute';
import { ColorPickingService } from '../colorPicker/color-picking.service';
import { KeyboardHandlerService } from '../keyboard-handler/keyboard-handler.service';
import { InteractionService } from '../service-interaction/interaction.service';
import { DrawingTool } from './drawingTool';
import { Point } from './point';

const DEFAULTLINETHICKNESS = 5;
const DEFAULTTEXTURE = 0;
@Injectable({
  providedIn: 'root'
})
export class EraserService extends DrawingTool {

  render:Renderer2;
  attr: ToolsAttributes

  foundAnItem : boolean;

  erasedSomething : boolean;

  canvas: HTMLElement

  constructor(inProgess: HTMLElement, drawing: HTMLElement, selected: boolean, interaction: InteractionService, colorPick: ColorPickingService,
              render : Renderer2, selectedRef : HTMLElement, canvas : HTMLElement) {

    super(inProgess, drawing, selected, interaction, colorPick);
    this.attr = {lineThickness: DEFAULTLINETHICKNESS, texture: DEFAULTTEXTURE}
    this.updateColors()
    this.updateAttributes()

    this.canvas = canvas;

    this.render = render;

    this.foundAnItem = false;

    this.erasedSomething = false;

    window.addEventListener("newDrawing",(e:Event)=>{
      for(let i = 0; i < this.drawing.childElementCount; i++){
        let el = this.drawing.children[i];
        let status = el.getAttribute("isListening2");
        if(status !== "true"){
          this.render.listen(el,"mouseenter", () =>{
            this.render.setAttribute(el, "isListening2","true");
            if(!this.foundAnItem){
              //this.highlight(el);
              this.foundAnItem = true;
              //this.erase(el);
            }
          });
          this.render.listen(el,"mouseleave", () =>{
            this.render.setAttribute(el, "isListening2","true");
            if(this.foundAnItem){
              //this.unhighlight(el);
              this.foundAnItem = false;
            }
          });
        }
      }
    });

    window.addEventListener("toolChange",(e:Event)=>{
      for(let i = 0; i < this.drawing.childElementCount;i++){
        this.unhighlight(this.drawing.children[i]);
      }
    });

  }
  updateAttributes() {
    this.interaction.$toolsAttributes.subscribe((obj) => {
      if (obj) {
        this.attr = {lineThickness: obj.lineThickness, texture: obj.texture}
      }
    })
    this.colorPick.emitColors()
  }
  // updating on key change
  updateDown(keyboard: KeyboardHandlerService) {
    // keyboard has no effect on pencil
  }

  // updating on key up
  updateUp(keyCode : number) {
    // nothing happens for eraser tool
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

    this.updateProgress();

    this.checkIfTouching();
  }

  // mouse up with pencil in hand
  up(position: Point, insideWorkspace: boolean) {

    // in case we changed tool while the mouse was down
    if (!this.ignoreNextUp) {

      // the pencil should not affect the canvas
      this.isDown = false;

      if(this.erasedSomething){
        this.interaction.emitDrawingDone();
        console.log("now");
      }

      this.erasedSomething = false;
    }
  }

  erase(el:Element){
    if(this.isDown){
      this.render.removeChild(el.parentElement, el);
      this.erasedSomething = true;
    }
  }
  
  // highlights a 'g' tag by adding a clone as a child
  highlight(el : Element){

    if(this.selected && el.firstElementChild && !el.firstElementChild.classList.contains("clone")){
      let clone : Element = this.render.createElement("g","http://www.w3.org/2000/svg");
      (clone as HTMLElement).innerHTML = el.innerHTML;
      for(let i = 0; i < el.childElementCount;i++){
        let originalWidth : string | null = (el.children[i] as HTMLElement).getAttribute("stroke-width");
        let originalWidthNumber = originalWidth? + originalWidth : 0;
        let wider : number = Math.max(10,originalWidthNumber + 10);
        this.render.setAttribute(clone.children[i], "stroke-width", `${wider}`);

        let originalStrokeColor : string | null = (el.children[i] as HTMLElement).getAttribute("stroke");
        let originalFillColor : string | null = (el.children[i] as HTMLElement).getAttribute("fill");

        let refcolor : string | null = originalStrokeColor != "none"? originalStrokeColor : originalFillColor;

        let originalStrokeRGB : [number,number,number] = [0,0,0];
        if(refcolor && refcolor != "none"){
          originalStrokeRGB[0] = parseInt(refcolor[1] + refcolor[2],16);
          originalStrokeRGB[1] = parseInt(refcolor[3] + refcolor[4],16);
          originalStrokeRGB[2] = parseInt(refcolor[5] + refcolor[6],16);
        }

        let redHighlight : number = 255;
        let originalToRed = originalStrokeRGB[0] > (255/4)*3;
        if(originalToRed){
          redHighlight = (originalStrokeRGB[0] / 4) * 3;
        }

        this.render.setAttribute(clone.children[i], "stroke", `rgb(${redHighlight},0,0)`);
      }
      this.render.setAttribute(clone, "class", "clone");
      this.render.insertBefore(el, clone,el.firstElementChild);
    }
  }

  //unhighlights the element by removing all of his "clone" children
  unhighlight(el : Element){

    if(el.firstElementChild){
      if(el.firstElementChild.classList.contains("clone")){
        this.render.removeChild(el, el.firstElementChild);
      }
    }
  }

  // mouse move with pencil in hand
  move(position: Point) {

    // only if the pencil is currently affecting the canvas
    if (true) {

      // save mouse position
      this.currentPath.push(position);

      while(this.currentPath.length > 3){
        this.currentPath.shift();
      }

      this.updateProgress();

      this.checkIfTouching();
    }
  }

  // when we go from inside to outside the canvas
  goingOutsideCanvas() {
    // nothing happens since we might want to readjust the shape once back in
  }

  // when we go from outside to inside the canvas
  goingInsideCanvas() {
    // nothing happens since we just update the preview
  }

  checkIfTouching(){

    /*
    let canv = this.canvas;
    let canvasBox = canv?canv.getBoundingClientRect():null;
    let canvOffsetX = (canvasBox? canvasBox.left : 0);
    let canvOffsetY = (canvasBox? canvasBox.top : 0);
    */

    let w = Math.max(10,Math.abs(this.currentPath[this.currentPath.length-1].x - this.currentPath[0].x));
    let h = Math.max(10,Math.abs(this.currentPath[this.currentPath.length-1].y - this.currentPath[0].y));

    let dim = Math.max(w,h);

    let tl = new Point(this.currentPath[this.currentPath.length-1].x - dim/2,this.currentPath[this.currentPath.length-1].y - dim/2);
    let br = new Point(tl.x + dim, tl.y + dim);

    for(let i = 0; i < this.drawing.childElementCount;i++){

      let touching = false;
      let firstChild = this.drawing.children[i];

      for(let j = 0; j < firstChild.childElementCount;j++){
        let secondChild = firstChild.children[j];

        let width = (secondChild as HTMLElement).getAttribute("stroke-width");
        let offset = 0;
        if(width){
          offset = +width;
        }

        let dim2 = 3 + offset;

        if(secondChild.classList.contains("clone") || secondChild.tagName == "filter"){continue;}

        let path = secondChild as SVGPathElement;
        let lenght = path.getTotalLength();
        let inc = lenght / 500;
        let points = [];
        for(let a = 0; a < lenght; a+= inc){
          let candidate = new Point(path.getPointAtLength(a).x,path.getPointAtLength(a).y);
          if(Point.distance(this.currentPath[this.currentPath.length-1],candidate) < 40){
            points.push(new Point(path.getPointAtLength(a).x,path.getPointAtLength(a).y));
          }
        }
        for(let a = 0; a < points.length; a++){
          let tlp = new Point(points[a].x - dim2/2, points[a].y - dim2/2);
          let brp = new Point(points[a].x + dim2/2, points[a].y +dim2/2);
          if(Point.rectOverlap(tlp, brp, tl,br)){
            touching = true;
            break;
          }
        }

        if(touching){
          break;
        }

      }

      if(touching){
        if(this.isDown){
          this.erase(firstChild);
        }else{
          this.highlight(firstChild);
        }
        //this.render.removeChild(firstChild.parentElement, firstChild);
        // /console.log("TOUCHING");
      }else{
        this.unhighlight(firstChild);
      }
    }
  }

  // mouse doubleClick with pencil in hand
  doubleClick(position: Point) {
    // since its down -> up -> down -> up -> doubleClick, nothing more happens for the pencil
  }

  // Creates an svg path that connects every points of currentPath with the pencil attributes
  createPath(p: Point[]) {

    let s = '';

    // We need at least 2 points
    if (p.length < 2) {
      return s;
    }

    // create a divider
    s = '<g style="transform: translate(0px, 0px);" name = "eraser-brush">';


    let w = Math.max(10,Math.abs(p[p.length-1].x - p[0].x));
    let h = Math.max(10,Math.abs(p[p.length-1].y - p[0].y));

    let dim = Math.max(w,h);

    s += `<rect x="${p[p.length-1].x - dim/2}" y="${p[p.length-1].y - dim/2}"`;
    s += `width="${dim}" height="${dim}"`;

    s += `fill="white"`;
    s += `stroke-width="1" stroke="black"`;

    // end the divider
    s += '</g>';

    return s;
  }
}
