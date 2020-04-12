import { Injectable } from '@angular/core';
import { ColorPickingService } from '../../colorPicker/color-picking.service';
import { InteractionService } from '../../service-interaction/interaction.service';
import { DrawingTool } from '../drawing-tool';
import { Point } from '../point';
import { FloodFillService } from './flood-fill.service';

const DEFAULT_TOLERANCE = 0.5;
@Injectable({
  providedIn: 'root'
})
export class BucketToolService extends DrawingTool {
  canvasContext: CanvasRenderingContext2D | null;
  interact: InteractionService;
  tolerance: number;
  constructor(
    inProgress: HTMLElement,
    drawing: HTMLElement,
    selected: boolean,
    interaction: InteractionService,
    colorPick: ColorPickingService,
    private floodFill: FloodFillService) {

    super(inProgress, drawing, selected, interaction, colorPick);
    this.tolerance = DEFAULT_TOLERANCE;
    this.interact = interaction;

    this.updateColors();
    this.updateAttributes();
  }

  down(position: Point, insideWorkspace?: boolean | undefined, isRightClick?: boolean): void {

    const CHOOSEN_COLOR = this.colorPick.colorConvert.hexToRgba(this.chosenColor.primColor);
    if (this.canvasContext) {

      const CLICK = this.canvasContext.getImageData(position.x, position.y, 1, 1).data;
      this.currentPath = this.floodFill.floodFill(this.canvasContext, position,
        [CLICK[0], CLICK[1], CLICK[2]], CHOOSEN_COLOR, this.tolerance);

    }
    this.updateDrawing();
  }

  updateAttributes(): void {

    const PERCENT = 100;
    this.interaction.toleranceValue.subscribe((toleranceValue: number) => {
      this.tolerance = toleranceValue / PERCENT;
    });

    this.interact.$canvasContext.subscribe((context: CanvasRenderingContext2D) => {
      this.canvasContext = context;
    });

  }

  move(position: Point): void {
    /* on move */
  }

  up(): void {
    // throw new Error('Method not implemented.');
  }

  createPath(p: Point[]): string {
    let dString = '';
    let path = '';

    path += '<g name = "bucket-fill">';
    dString += `M ${p[0].x} ${p[0].y}`;

    /**
     * The flood-fill algorithm will always return a point array made of
     * successive x values (fills vertically until tolerance doesnt matches,
     * fill the pixel line at its right and left, etc.).
     * Instead of filling point-per-point, we only trace some lines from min X to max X matching the tolerance.
     * Then, we repeat for the pixel line below it until all points have been checked.
     */
    for (let i = 1; i < p.length - 1; i++) {
      if (p[i].x !== p[i + 1].x) {
        dString += ` L ${p[i].x} ${p[i].y}`; // draw the line, then move to the next point
        dString += ` M ${p[i + 1].x} ${p[i + 1].y}`;
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

    return path;
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
