import { Injectable } from '@angular/core';
import { CanvasBuilderService } from '../../services/drawing/canvas-builder.service';

@Injectable({
  providedIn: 'root'
})
export class DrawViewService {
  height: number;
  width: number;
  color: string;

  constructor(private canvasBuilder: CanvasBuilderService) { }


  newDrawOnView() {
  }

  hasCurrentDraw(): boolean {
    return (false);
  }
}
