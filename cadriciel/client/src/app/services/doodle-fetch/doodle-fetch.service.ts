import { ElementRef, Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class DoodleFetchService {
    currentDraw: ElementRef;

    ask: Subject<boolean>; // only used for data emission

    widthAttr: number;
    heightAttr: number;

    constructor() {
        this.ask = new Subject<boolean>();
    }

    askForDoodle() {
        this.ask.next(true); // we are telling the svg draw component that we want to access the doodle
    }

    getDrawing(): Node {
        // returns a deep copy of the svg element.
        const SVG_NODE = this.getSVGElementFromRef(this.currentDraw);
        return SVG_NODE.cloneNode(true);
    }

    getSVGElementFromRef(el: ElementRef): Node {
        return el.nativeElement;
    }
}
