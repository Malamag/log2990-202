import { Injectable } from '@angular/core';
import { InteractionService } from '../../service-interaction/interaction.service';
import { InputObserver } from '../input-observer';
import { Point } from '../point';

@Injectable({
  providedIn: 'root'
})
export class BucketToolService extends InputObserver {
  canvasContext: CanvasRenderingContext2D | null;

  constructor(selected: boolean, interaction: InteractionService) {
    super(selected);

    interaction.$canvasContext.subscribe((context: CanvasRenderingContext2D) => {
      this.canvasContext = context;
    });
  }

  down(position: Point, insideWorkspace?: boolean | undefined, isRightClick?: boolean): void {
    /* on click: what happens */
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
}
