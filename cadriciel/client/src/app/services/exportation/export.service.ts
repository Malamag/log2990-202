import { Injectable, ElementRef } from '@angular/core';
import { InteractionTool } from '../interactionTool';
import { Subscription, Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ExportService extends InteractionTool {
  frameSubscription: Subscription;
  currentDraw: ElementRef;

  ask: Subject<boolean>

  constructor() {
    super();
    this.ask = new Subject<boolean>();
  }

  askForDoodle() {
    this.ask.next(true); //
  }


  getDrawing(): SVGElement {
    return super.getSVGElementFromRef(this.currentDraw);
  }
}
