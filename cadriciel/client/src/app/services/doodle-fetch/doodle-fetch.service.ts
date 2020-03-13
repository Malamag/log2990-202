import { ElementRef, Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { GridRenderService } from '../grid/grid-render.service';
import { SVGData } from '../../../svgData'

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

    getDrawingStringNoGrid(): SVGData {
        this.gService.removeGrid();
        let innerHTML: string[] = [];
        let el: Element = this.currentDraw.nativeElement;
        let childs: HTMLCollection = el.children;
        for (let i = 0; i < childs.length; i++) {
            try {
                innerHTML.push(childs[i].innerHTML);
            }
            catch{
                innerHTML.push("");
                console.log("Empty InnerHTML");
            }
        }
        const SVG_DATA: SVGData = { canvasStyle: el.getAttribute('style'), bgColor: childs[0].getAttribute('style'), innerHTML: innerHTML };
        console.log(SVG_DATA);
        this.gService.renderBack();
        return SVG_DATA;
    }
}
