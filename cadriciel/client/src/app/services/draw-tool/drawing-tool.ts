import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';
import { ChoosenColors } from 'src/app/models/choosen-colors.model';
import { ColorPickingService } from '../colorPicker/color-picking.service';
import { InteractionService } from '../service-interaction/interaction.service';
import { InputObserver } from './input-observer';
import { Point } from './point';

const DEFAULTPRIMARYCOLOR = 'ff0000ff';
const DEFAULTSECONDARYCOLOR = '000000';
const DEFAULTBACKCOLOR = 'ffffffff';
@Injectable({
  providedIn: 'root'
})
export abstract class DrawingTool extends InputObserver {
  isDown: boolean;
  currentPath: Point[];
  selected: boolean;
  ignoreNextUp: boolean;
  inProgress: HTMLElement;
  drawing: HTMLElement;
  interaction: InteractionService;
  colorPick: ColorPickingService;
  chosenColor: ChoosenColors;
  colorSub: Subscription;

  abstract createPath(path: Point[], doubleClickCheck?: boolean, removePerimeter?: boolean): void;

  constructor(
    inProgess: HTMLElement,
    drawing: HTMLElement,
    selected: boolean,
    interaction: InteractionService,
    colorPick: ColorPickingService) {

    super(selected);
    this.interaction = interaction;
    this.inProgress = inProgess;
    this.drawing = drawing;

    this.isDown = false;
    this.currentPath = [];
    this.colorPick = colorPick;

    this.ignoreNextUp = false;
    this.chosenColor = {
      primColor: DEFAULTPRIMARYCOLOR, secColor: DEFAULTSECONDARYCOLOR,
      backColor: DEFAULTBACKCOLOR
    };
  }

  updateColors(): void {
    const DEFPRIM = '#000000ff';
    const DEFSEC = '#ff0000ff';
    const DEFBACK = '#ff0000ff';
    this.colorSub = this.colorPick.colorSubject.subscribe(
      (color: ChoosenColors) => {
        if (color === undefined) {
          color = { primColor: DEFPRIM, secColor: DEFSEC, backColor: DEFBACK };
        }
        this.chosenColor = { primColor: color.primColor, secColor: color.secColor, backColor: color.backColor };
      });
    this.colorPick.emitColors();
  }

  abstract updateAttributes(): void;

  // cancel the current progress
  cancel(): void {
    // empty path
    this.currentPath = [];
    // if we cancel while mouse down we need to ignore the next up
    this.ignoreNextUp = true;
    // the tool should not affect the canvas
    this.isDown = false;
    // clear the progress renderer
    this.inProgress.innerHTML = '';
  }

  // render the current progress
  updateProgress(wasDoubleClick?: boolean, removePerimeter?: boolean): void {

    // create an svg element from the current path
    let d = '';
    d += this.createPath(this.currentPath, wasDoubleClick);
    // add it to the progress renderer
    this.inProgress.innerHTML = d;
  }

  // add the progress to the main drawing
  updateDrawing(endIt?: boolean): void {

    // create the final svg element
    let d = '';
    d += this.createPath(this.currentPath, endIt);

    // add it to the main drawing
    this.drawing.innerHTML += d;

    const event = new Event('newDrawing');
    window.dispatchEvent(event);

    this.interaction.emitDrawingDone();
    // clear current progress
    this.inProgress.innerHTML = '';

    this.currentPath = [];
  }

  // when we go from inside to outside the canvas
  goingOutsideCanvas(position: Point): void {
    // if currently affecting the canvas
    if (this.isDown) {
      // push to drawing and end stroke
      this.updateDrawing();
    }
  }

  // when we go from outside to inside the canvas
  goingInsideCanvas(position: Point): void {
    // if currently affecting the canvas
    if (this.isDown) {
      // start new drawing
      this.down(position);
    }
  }

}
