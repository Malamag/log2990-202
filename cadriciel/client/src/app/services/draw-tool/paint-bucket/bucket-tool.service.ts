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
  surfaceWidth: number;
  surfaceHeight: number;

  interact: InteractionService;
  constructor(
    inProgress: HTMLElement,
    drawing: HTMLElement,
    selected: boolean,
    interaction: InteractionService,
    colorPick: ColorPickingService,
    private floodFill: FloodFillService) {

    super(inProgress, drawing, selected, interaction, colorPick);
    const TEST_DIM = 10;
    this.surfaceWidth = TEST_DIM;
    this.surfaceHeight = TEST_DIM;
    this.interact = interaction;
    this.interact.$canvasContext.subscribe((context: CanvasRenderingContext2D) => {
      this.canvasContext = context;
    });
  }

  down(position: Point, insideWorkspace?: boolean | undefined, isRightClick?: boolean): void {
    /* on click: what happens */
    const TEST = 255;
    if (this.canvasContext) {
      const t0 = performance.now();
      const PTS = this.floodFill.floodFill(this.canvasContext, position, [0, 0, 0], [TEST, TEST, TEST], 1);
      const t1 = performance.now();
      console.log('Flood-fill exectuted in ' + (t1 - t0) + ' ms');
      console.log(PTS);
    }
    this.updateDrawing();
  }

  move(position: Point): void {
    /* on move */
  }

  up(): void {
    // throw new Error('Method not implemented.');
  }

  createPath(path: Point[], doubleClickCheck?: boolean | undefined, removePerimeter?: boolean | undefined): string {
    // throw new Error("Method not implemented.");

    // create a divider
    let sPath = '<g name = "bucket" style="transform: translate(0px, 0px);" >';

    // Initialize the d string attribute of the path
    let dString = '';

    // blabla
    let points: Point[];
    points = new Array();

    // Put every points in a string
    for (const POINT of points) {
      dString += ` ${POINT.x}, ${POINT.y}`;
    }

    // Create the polyline
    sPath += ' <polyline ';
    sPath += ` d="${dString}"`;
    sPath += ` stroke="${this.chosenColor.primColor}"`;
    sPath += ` fill="${this.chosenColor.primColor}" /> </g>`;

    return sPath;

  }

  // add the progress to the main drawing
  updateDrawing(endIt?: boolean): void {

    // create the final svg element
    let d = '';
    d += this.createPath(this.currentPath, endIt);

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

  updateAttributes(): void {
    // throw new Error("Method not implemented.");
  }
}
