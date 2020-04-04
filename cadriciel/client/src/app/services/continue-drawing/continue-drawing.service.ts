import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Canvas } from 'src/app/models/canvas.model';
import { DoodleFetchService } from 'src/app/services/doodle-fetch/doodle-fetch.service';
import { CanvasBuilderService } from 'src/app/services/new-doodle/canvas-builder.service';
import { InteractionService } from 'src/app/services/service-interaction/interaction.service';
import { SVGData } from '../../../../../svg-data';

const WIDTH = 'width';
const HEIGHT = 'height';
const BG_COLOR = 'color';
const INNER_HTML = 'htmlElem';

@Injectable({
  providedIn: 'root'
})
export class ContinueDrawingService {

  constructor(
    public doodle: DoodleFetchService,
    public interact: InteractionService,
    public canvasBuilder: CanvasBuilderService,
    private router: Router,
  ) { }

  continueDrawing(data: SVGData): void {
    this.router.navigate(['/vue']);
    const LOAD_TIME = 15;
    setTimeout(() => {
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
      window.dispatchEvent(new Event('resize'));
    }, LOAD_TIME); // waits for the canvas to be created
  }

  getSVGData(): SVGData {
    const MAX = 6;
    let w = '';
    let h = '';
    let backColor = '';
    const INNER: string[] = [];
    if (localStorage.getItem(WIDTH) !== null) { w = localStorage.getItem(WIDTH) as string; } else { w = '1438'; }
    if (localStorage.getItem(HEIGHT) !== null) { h = localStorage.getItem(HEIGHT) as string; } else { h = '775'; }
    if (localStorage.getItem(BG_COLOR) !== null) { backColor = localStorage.getItem(BG_COLOR) as string; } else { backColor = 'ffffff'; }
    for (let i = 0; i < MAX; ++i) {
      if (localStorage.getItem(INNER_HTML + i.toString())) {
        const ELEM: string = localStorage.getItem(INNER_HTML + i.toString()) as string;
        INNER.push(ELEM);
      } else {
        INNER.push('');
      }
    }
    const RET_DATA: SVGData = { height: h, width: w, bgColor: backColor, innerHTML: INNER };
    return RET_DATA;
  }

  continueAutoSaved(): void {
    const DATA = this.getSVGData();
    this.continueDrawing(DATA);
  }
}
