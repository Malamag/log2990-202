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
    const TEST_DIM = 2000;
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
      this.floodFill.floodFill(this.canvasContext, position, [TEST, TEST, TEST], [0, 0, 0], this.surfaceWidth, this.surfaceHeight, 1);
    }

  }

  move(position: Point): void {
    /* on move */
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

  up(): void {
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

  createPath(path: Point[], doubleClickCheck?: boolean | undefined, removePerimeter?: boolean | undefined): void {
    // throw new Error("Method not implemented.");
  }
  updateAttributes(): void {
    // throw new Error("Method not implemented.");
  }
}
