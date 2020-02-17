import { Injectable, ElementRef } from '@angular/core';
import { InteractionTool } from '../interactionTool';
import {Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ExportService extends InteractionTool {
  currentDraw: ElementRef;

  ask: Subject<boolean>; // only used for data emission

  constructor() {
    super();
    this.ask = new Subject<boolean>();
  }

  askForDoodle() {
    this.ask.next(true); // are telling the svg draw component that we want to access the doodle
  }


  getDrawing(): SVGElement {
    return super.getSVGElementFromRef(this.currentDraw);
  }
}
