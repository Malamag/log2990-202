import { Injectable } from '@angular/core';
import { Canvas } from 'src/app/models/canvas.model';
import { DoodleFetchService } from 'src/app/services/doodle-fetch/doodle-fetch.service';
import { GridRenderService } from 'src/app/services/grid/grid-render.service';
import { CanvasBuilderService } from 'src/app/services/new-doodle/canvas-builder.service';
import { InteractionService } from 'src/app/services/service-interaction/interaction.service';
import { SVGData } from 'src/svg-data';
@Injectable({
  providedIn: 'root'
})
export class ContinueDrawingService {

  constructor(
    public doodle: DoodleFetchService,
    public interact: InteractionService,
    public gridService: GridRenderService,
    public canvasBuilder: CanvasBuilderService,
  ) { }

  continueDrawing(data: SVGData): void {
    this.doodle.askForDoodle();
    const el = this.doodle.currentDraw.nativeElement;

    const childs: HTMLCollection = el.children;
    for (let i = 0; i < childs.length; ++i) {
      if (data.innerHTML[i] === undefined) {
        childs[i].innerHTML = '';
      } else {
        childs[i].innerHTML = data.innerHTML[i];
      }
    }

    const CANVAS_ATTRS: Canvas = { canvasWidth: +data.width, canvasHeight: +data.height, canvasColor: data.bgColor };
    this.interact.emitGridAttributes(CANVAS_ATTRS);
    this.canvasBuilder.newCanvas = CANVAS_ATTRS;
    this.canvasBuilder.newCanvas.wipeAll = false; // we are replacing the innerHTML, an afterward deletion is unnecessary
    this.canvasBuilder.emitCanvas();
  }
}
