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
  continueDrawingNoTimeOut(data: SVGData): void {
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
  continueDrawing(data: SVGData): void {
    this.router.navigate(['/vue']);
    const LOAD_TIME = 15;
    setTimeout(() => {
      this.continueDrawingNoTimeOut(data);
      window.dispatchEvent(new Event('resize'));
    }, LOAD_TIME); // waits for the canvas to be created
  }

  getSVGData(): SVGData {
    const MAX = 6;
    const W = localStorage.getItem(WIDTH) ? localStorage.getItem(WIDTH) as string : '1438';
    const H = localStorage.getItem(HEIGHT) ? localStorage.getItem(HEIGHT) as string : '775';
    const BACK_COLOR = localStorage.getItem(BG_COLOR) ? localStorage.getItem(BG_COLOR) as string : 'ffffff';
    const INNER: string[] = [];
    for (let i = 0; i < MAX; ++i) {
      if (localStorage.getItem(INNER_HTML + i.toString())) {
        const ELEM: string = localStorage.getItem(INNER_HTML + i.toString()) as string;
        INNER.push(ELEM);
      } else {
        INNER.push('');
      }
    }
    const RET_DATA: SVGData = {height: H, width: W, bgColor: BACK_COLOR, innerHTML: INNER};
    return RET_DATA;
  }

  continueAutoSavedFromEntryPoint(): void {
    const DATA = this.getSVGData();
    this.continueDrawing(DATA);
  }
  continueAutoSavedFromDrawVue(): void {
    const DATA = this.getSVGData();
    this.continueDrawingNoTimeOut(DATA);
  }
}
