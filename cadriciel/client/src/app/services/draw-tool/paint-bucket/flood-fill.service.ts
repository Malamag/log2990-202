import { Injectable } from '@angular/core';
import { PipetteService } from '../pipette.service';

@Injectable({
  providedIn: 'root'
})
export class FloodFillService {

  constructor(private pipette: PipetteService) { }

  floodFill(ctx: CanvasRenderingContext2D, colorBelow: number[], tolerance: number): void {

  }
}
