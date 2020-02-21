import { Injectable } from '@angular/core';
import { ToolsAttributes } from '../attributes/tools-attribute';
import { ColorPickingService } from '../colorPicker/color-picking.service';
import { KeyboardHandlerService } from '../keyboard-handler/keyboard-handler.service';
import { InteractionService } from '../service-interaction/interaction.service';
import { DrawingTool } from './drawingTool';
import { Point } from './point';

@Injectable({
  providedIn: 'root'
})
export class PencilService extends DrawingTool {
  attr: ToolsAttributes

  constructor(inProgess: HTMLElement, drawing: HTMLElement, selected: boolean, interaction: InteractionService, colorPick: ColorPickingService) {

    super(inProgess, drawing, selected, interaction, colorPick);
    this.attr = new ToolsAttributes(this.defaultValues.DEFAULTLINETHICKNESS, this.defaultValues.DEFAULTTEXTURE)
    this.updateColors()
    this.updateAttributes()
  }
  updateAttributes() {
    this.interaction.$toolsAttributes.subscribe((obj) => {
      if (obj) {
        this.attr = new ToolsAttributes(obj.lineThickness, obj.texture)
      }
    })
    this.colorPick.emitColors()
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

      this.updateProgress();
    }
  }

  // mouse doubleClick with pencil in hand
  doubleClick(position: Point) {
    // since its down -> up -> down -> up -> doubleClick, nothing more happens for the pencil
  }

  // Creates an svg path that connects every points of currentPath with the pencil attributes
  createPath(p: Point[]) {

    let s = '';

    //We need at least 2 points
    if(p.length < 2){
      return s;
    }

    // create a divider
    s = '<g name = "pencil-stroke">';

    // start the path
    s += '<path d="';
    // move to first point
    s += `M ${p[0].x} ${p[0].y} `;
    // for each succeding point, connect it with a line
    for (let i = 1; i < p.length; i++) {
      s += `L ${p[i].x} ${p[i].y} `;
    }
    // set render attributes
    s += `\" stroke="${this.chosenColor.primColor}"`;
    s += `stroke-width="${this.attr.lineThickness}"`;
    s += 'fill="none"';
    s += 'stroke-linecap="round"';
    s += 'stroke-linejoin="round"/>';
    // end the path

    // end the divider
    s += '</g>';
    return s;
  }
}
