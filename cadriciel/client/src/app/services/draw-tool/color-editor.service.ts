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
export class ColorEditorService extends DrawingTool {

  render: Renderer2;
  attr: ToolsAttributes

  foundAnItem: boolean;

  erasedSomething: boolean;

  canvas: HTMLElement;

  isRightClick: boolean;

  constructor(inProgess: HTMLElement, drawing: HTMLElement, selected: boolean, interaction: InteractionService, colorPick: ColorPickingService,
    render: Renderer2, selectedRef: HTMLElement, canvas: HTMLElement) {

    super(inProgess, drawing, selected, interaction, colorPick);
    this.attr = { lineThickness: DEFAULTLINETHICKNESS, texture: DEFAULTTEXTURE }
    this.updateColors()
    this.updateAttributes()

    this.canvas = canvas;

    this.render = render;

    this.foundAnItem = false;

    this.erasedSomething = false;

    this.inProgress.style.pointerEvents = "none";

    this.isRightClick = false;

    window.addEventListener("newDrawing", (e: Event) => {
      for (let i = 0; i < this.drawing.childElementCount; i++) {
        let el = this.drawing.children[i];
        let status = el.getAttribute("isListening3");
        this.render.setAttribute(el, "checkPreciseEdge2", "true");
        if (status !== "true") {
          this.render.setAttribute(el, "isListening3", "true");
          this.render.listen(el, "mousemove", () => {
            //console.log("enter");
            if (!this.foundAnItem) {
              //this.highlight(el);
              this.render.setAttribute(el, "checkPreciseEdge2", "false");
              this.foundAnItem = true;
              if (this.isDown) {
                this.changeColor(el);
                this.foundAnItem = false;
              }
            }
          });
          this.render.listen(el, "mouseleave", () => {
            //console.log("leaving");
            if (this.foundAnItem) {
              //this.unhighlight(el);
              this.foundAnItem = false;
              this.render.setAttribute(el, "checkPreciseEdge2", "true");
            }
          });
          this.render.listen(el, "mousedown", () => {
            this.changeColor(el);
            this.foundAnItem = false;
            this.render.setAttribute(el, "checkPreciseEdge2", "true");
          });
          this.render.listen(el, "mouseup", () => {
            if (!this.foundAnItem) {
              //this.highlight(el);
              this.render.setAttribute(el, "checkPreciseEdge2", "false");
              this.foundAnItem = false;
            }
          });
        }
      }
    });

    window.addEventListener("toolChange", (e: Event) => {
      this.foundAnItem = false;
      for (let i = 0; i < this.drawing.childElementCount; i++) {
        //this.unhighlight(this.drawing.children[i]);
      }
    });

  }
  updateAttributes() {
    this.interaction.$toolsAttributes.subscribe((obj) => {
      if (obj) {
        this.attr = { lineThickness: obj.lineThickness, texture: obj.texture }
      }
    })
    this.colorPick.emitColors()
  }
  // updating on key change
  updateDown(keyboard: KeyboardHandlerService) {
    // keyboard has no effect on pencil
  }

  // updating on key up
  updateUp(keyCode: number) {
    // nothing happens for eraser tool
  }

  // mouse down with pencil in hand
  down(position: Point, insideWorkspace: boolean, isRightClick: boolean) {

    this.isRightClick = isRightClick;

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

      if (this.erasedSomething) {
        this.interaction.emitDrawingDone();
        //console.log("now");
      }
      this.erasedSomething = false;
    }
  }

  changeColor(el: Element) {
    if (this.selected) {
      for (let i = 0; i < el.childElementCount; i++) {
        let current = el.children[i];
        if (current.tagName == "filter") { continue; }
        if (this.isRightClick) {
          this.changeBorder(current as HTMLElement);
        } else {
          this.changeFill(current as HTMLElement);
        }
      }
    }
  }

  changeBorder(el: HTMLElement) {
    let newColor = el.getAttribute("stroke") != "none" ? this.chosenColor.secColor : "none";
    this.render.setAttribute(el, "stroke", newColor);
  }

  changeFill(el: HTMLElement) {
    console.log(el.getAttribute("fill"));
    let newColor = el.getAttribute("fill") != "none" ? this.chosenColor.primColor : "none";
    this.render.setAttribute(el, "fill", newColor);
  }

  // mouse move with pencil in hand
  move(position: Point) {

    //console.log(this.erasedSomething);

    // only if the pencil is currently affecting the canvas
    if (true) {

      // save mouse position
      this.currentPath.push(position);

      while (this.currentPath.length > 3) {
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

  checkIfTouching() {

    let canv = this.canvas;
    let canvasBox = canv ? canv.getBoundingClientRect() : null;
    let canvOffsetX = (canvasBox ? canvasBox.left : 0);
    let canvOffsetY = (canvasBox ? canvasBox.top : 0);

    //console.log(`${canvOffsetX}, ${canvOffsetY}`);


    let w = Math.max(10, Math.abs(this.currentPath[this.currentPath.length - 1].x - this.currentPath[0].x));
    let h = Math.max(10, Math.abs(this.currentPath[this.currentPath.length - 1].y - this.currentPath[0].y));

    let dim = Math.max(w, h);

    let tl = new Point(this.currentPath[this.currentPath.length - 1].x - dim / 2, this.currentPath[this.currentPath.length - 1].y - dim / 2);
    let br = new Point(tl.x + dim, tl.y + dim);

    for (let i = 0; i < this.drawing.childElementCount; i++) {

      let touching = false;
      let firstChild = this.drawing.children[i];

      // item bounding box
      let itemBox = firstChild.getBoundingClientRect();
      let itemTopLeft: Point = new Point(itemBox.left - canvOffsetX, itemBox.top - canvOffsetY);
      let itemBottomRight: Point = new Point(itemBox.right - canvOffsetX, itemBox.bottom - canvOffsetY);

      if (!Point.rectOverlap(tl, br, itemTopLeft, itemBottomRight)) {
        //this.unhighlight(firstChild);
        continue;
      }

      if (firstChild.getAttribute("checkPreciseEdge") !== "true") {
        continue;
      }

      let objOffset = (this.drawing.children[i] as HTMLElement).style.transform;
      let s = objOffset ? objOffset.split(",") : "";
      let objOffsetX = +(s[0].replace(/[^\d.-]/g, ''));
      let objOffsetY = +(s[1].replace(/[^\d.-]/g, ''));

      for (let j = 0; j < firstChild.childElementCount; j++) {
        let secondChild = firstChild.children[j];

        let width = (secondChild as HTMLElement).getAttribute("stroke-width");
        let offset = 0;
        if (width) {
          offset = +width;
        }

        let dim2 = 3 + offset;

        if (secondChild.classList.contains("clone") || secondChild.tagName == "filter") { continue; }

        let path = secondChild as SVGPathElement;
        let lenght = path.getTotalLength();
        let inc = lenght / 300;

        let closest: [Point, number] = [new Point(-1, -1), 10000];
        for (let a = 0; a < lenght; a += inc) {
          let candidate = new Point(path.getPointAtLength(a).x + objOffsetX, path.getPointAtLength(a).y + objOffsetY);
          let dist = Point.distance(this.currentPath[this.currentPath.length - 1], candidate)
          if (dist < closest[1]) {
            closest[0] = candidate;
            closest[1] = dist;
          }
        }

        if (true) {
          let good = closest[0];
          //console.log(good);
          let tlp = new Point(good.x - dim2 / 2, good.y - dim2 / 2);
          let brp = new Point(good.x + dim2 / 2, good.y + dim2 / 2);
          if (Point.rectOverlap(tlp, brp, tl, br)) {
            touching = true;
            break;
          }
        }

        //for(let a = 0; a < points.length; a++){

        //}

        if (touching) {
          break;
        }

      }


      //console.log(touching);
      if (touching) {
        if (this.isDown) {
          this.changeColor(firstChild);
        } else {
          //this.highlight(firstChild);
        }
      } else {
        //this.unhighlight(firstChild);
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


    let w = Math.max(10, Math.abs(p[p.length - 1].x - p[0].x));
    let h = Math.max(10, Math.abs(p[p.length - 1].y - p[0].y));

    let dim = Math.max(w, h);

    s += `<rect x="${p[p.length - 1].x - dim / 2}" y="${p[p.length - 1].y - dim / 2}"`;
    s += `width="${dim}" height="${dim}"`;

    s += `fill="white"`;
    s += `stroke-width="1" stroke="black"`;

    // end the divider
    s += '</g>';

    return s;
  }
}
