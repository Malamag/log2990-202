import { Injectable } from '@angular/core';
import { ColorPickingService } from '../../colorPicker/color-picking.service';
import { InteractionService } from '../../service-interaction/interaction.service';
import { DrawingTool } from '../drawing-tool';
import { Point } from '../point';
import { FloodFillService } from './flood-fill.service';

@Injectable({
  providedIn: 'root'
})
export class BucketToolService extends DrawingTool {
  canvasContext: CanvasRenderingContext2D | null;
  interact: InteractionService;
  startPoint: Point;
  tolerance: number;
  constructor(
    inProgress: HTMLElement,
    drawing: HTMLElement,
    selected: boolean,
    interaction: InteractionService,
    colorPick: ColorPickingService,
    private floodFill: FloodFillService) {

    super(inProgress, drawing, selected, interaction, colorPick);

    this.interact = interaction;

    this.interact.$canvasContext.subscribe((context: CanvasRenderingContext2D) => {
      this.canvasContext = context;
    });

    this.updateColors();
    this.updateAttributes();
  }

  down(position: Point, insideWorkspace?: boolean | undefined, isRightClick?: boolean): void {
    /* on click: what happens */
    // const TEST = 255;
    this.startPoint = position;
    const CHOOSEN_COLOR = this.colorPick.colorConvert.hexToRgba(this.chosenColor.primColor);
    if (this.canvasContext) {
      const t0 = performance.now();
      const CLICK = this.canvasContext.getImageData(position.x, position.y, 1, 1).data;
      this.currentPath = this.floodFill.floodFill(this.canvasContext, position,
        [CLICK[0], CLICK[1], CLICK[2]], CHOOSEN_COLOR, this.tolerance);
      const t1 = performance.now();
      console.log('Flood-fill exectuted in ' + (t1 - t0) + ' ms');
      console.log(this.currentPath);
    }
    this.updateDrawing();
  }

  updateAttributes(): void {
    const PERCENT = 100;
    this.interaction.toleranceValue.subscribe((toleranceValue: number) => {
      this.tolerance = toleranceValue / PERCENT;
      console.log(this.tolerance);
    });
  }

  move(position: Point): void {
    /* on move */
  }

  up(): void {
    // throw new Error('Method not implemented.');
  }

  /*createPath(path: Point[], doubleClickCheck?: boolean | undefined, removePerimeter?: boolean | undefined): string {
    // throw new Error("Method not implemented.");

    // create a divider
    let sPath = '<g name = "bucket" style="transform: translate(0px, 0px);" >';

    // Initialize the d string attribute of the path
    let dString = '';

    // Put every points in a string
    for (const POINT of path) {
      dString += ` ${POINT.x}, ${POINT.y}`;
    }

    // Create the polyline
    sPath += ' <polyline ';
    sPath += ` points="${dString}"`;
    sPath += ` stroke="${this.chosenColor.primColor}"`;
    sPath += ` fill="${this.chosenColor.primColor}" /> </g>`;

    return sPath;

  }*/
  createPath(p: Point[]): string {
    let dString = '';
    let path = '';
    // For each generated point, move to the point and put a tiny line that looks like a point
    dString += `M ${this.startPoint.x} ${this.startPoint.y}`;
    for (let i = 0; i < p.length - 1; i++) {
      if (p[i].x !== p[i + 1].x || p[i].y !== p[i + 1].y) {
        dString += ` L ${p[i].x} ${p[i].y}`;
        dString += ` M ${p[i].x} ${p[i].y}`;
      }


    }

    // Create a radius dependent of the diameter -> 1/100 of the diameter

    const POINT_RADIUS = 2;
    // Create the path of points
    path += ' <path';
    path += ` d="${dString}"`;
    path += ` stroke="${this.chosenColor.primColor}"`;
    path += ' stroke-linecap="square"';
    path += ' stroke-linejoin="square"';
    path += ` stroke-width="${POINT_RADIUS}"`;
    path += ' fill="none" /> </g>';
    console.log(path)
    return path;
  }

  // add the progress to the main drawing
  updateDrawing(endIt?: boolean): void {

    // create the final svg element
    let d = '';
    d += this.createPath(this.currentPath);

    // add it to the main drawing
    this.drawing.innerHTML += d;

    const EVENT = new Event('newDrawing');
    window.dispatchEvent(EVENT);

    this.interaction.emitDrawingDone();

    this.currentPath = [];
  }

  updateDown(): void {
    // throw new Error('Method not implemented.');
  }

  updateUp(): void {
    // throw new Error('Method not implemented.');
  }

  cancel(): void {
    // throw new Error('Method not implemented.');
  }

  doubleClick(): void {
    // throw new Error('Method not implemented.');
  }

  goingOutsideCanvas(): void {
    // throw new Error('Method not implemented.');
  }

  goingInsideCanvas(): void {
    // throw new Error('Method not implemented.');
  }

}
