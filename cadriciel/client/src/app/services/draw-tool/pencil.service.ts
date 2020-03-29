import { Injectable } from '@angular/core';
import { ToolsAttributes } from '../attributes/tools-attribute';
import { ColorPickingService } from '../colorPicker/color-picking.service';
import { KeyboardHandlerService } from '../keyboard-handler/keyboard-handler.service';
import { InteractionService } from '../service-interaction/interaction.service';
import { DrawingTool } from './drawing-tool';
import { Point } from './point';

const DEFAULT_LINE_THICKNESS = 5;
const DEFAULT_TEXTURE = 0;
@Injectable({
  providedIn: 'root',
})
export class PencilService extends DrawingTool {
  attr: ToolsAttributes;

  constructor(
    inProgess: HTMLElement,
    drawing: HTMLElement,
    selected: boolean,
    interaction: InteractionService,
    colorPick: ColorPickingService,
  ) {
    super(inProgess, drawing, selected, interaction, colorPick);
    this.attr = { lineThickness: DEFAULT_LINE_THICKNESS, texture: DEFAULT_TEXTURE };
    this.updateColors();
    this.updateAttributes();
  }
  updateAttributes(): void {
    this.interaction.$toolsAttributes.subscribe((obj: ToolsAttributes) => {
      if (obj) {
        this.attr = { lineThickness: obj.lineThickness, texture: obj.texture };
      }
    });
    this.colorPick.emitColors();
  }
  // updating on key change
  updateDown(keyboard: KeyboardHandlerService): void {
    // keyboard has no effect on pencil
  }

  // updating on key up
  updateUp(keyCode: number): void {
    // nothing happens for pencil tool
  }

  // mouse down with pencil in hand
  down(position: Point): void {
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
  up(position: Point, insideWorkspace: boolean): void {
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
  move(position: Point): void {
    // only if the pencil is currently affecting the canvas
    if (this.isDown) {
      // save mouse position
      this.currentPath.push(position);

      this.updateProgress();
    }
  }

  // mouse doubleClick with pencil in hand
  doubleClick(position: Point): void {
    // since its down -> up -> down -> up -> doubleClick, nothing more happens for the pencil
  }

  // Creates an svg path that connects every points of currentPath with the pencil attributes
  createPath(p: Point[]): string {
    let s = '';

    // We need at least 2 points
    if (p.length < 2) {
      return s;
    }

    // create a divider
    s = '<g style="transform: translate(0px, 0px);" name = "pencil-stroke">';

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
