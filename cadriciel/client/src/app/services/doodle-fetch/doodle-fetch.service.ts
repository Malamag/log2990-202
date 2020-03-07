import { ElementRef, Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { GridRenderService } from '../grid/grid-render.service';

@Injectable({
    providedIn: 'root',
})
export class DoodleFetchService {
    currentDraw: ElementRef;

    ask: Subject<boolean>; // only used for data emission

    widthAttr: number;
    heightAttr: number;

    constructor(private gService: GridRenderService) {
        this.ask = new Subject<boolean>();
    }

    askForDoodle() {
        this.ask.next(true); // we are telling the svg draw component that we want to access the doodle
    }

    getHtmlContent(){
        return this.currentDraw.nativeElement.outerHTML;
    }

    getDrawingWithoutGrid(): Node {
        // returns a deep copy of the svg element.
        this.gService.removeGrid();
        const SVG_NODE = this.getSVGElementFromRef(this.currentDraw).cloneNode(true);

        this.gService.renderBack();
        return SVG_NODE;
    }

    getSVGElementFromRef(el: ElementRef): Node | HTMLElement {
        return el.nativeElement;
    }

    getDrawingStringNoGrid(): string {
        this.gService.removeGrid();
        const SVG_STR = this.currentDraw.nativeElement.outerHTML;

        this.gService.renderBack();
        return SVG_STR;
    }
}
