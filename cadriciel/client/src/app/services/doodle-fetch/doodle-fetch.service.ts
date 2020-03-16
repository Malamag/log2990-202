import { ElementRef, Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { SVGData } from '../../../svgData';
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

    askForDoodle(): void {
        this.ask.next(true); // we are telling the svg draw component that we want to access the doodle
    }

    getDrawingWithoutGrid(): Node {
        // returns a deep copy of the svg element.
        this.gService.removeGrid();
        const SVG_NODE = this.getSVGElementFromRef(this.currentDraw).cloneNode(true);

        this.gService.renderBack();
        return SVG_NODE;
    }

    getSVGElementFromRef(el: ElementRef): Node {
        return el.nativeElement;
    }

    getDrawingStringNoGrid(): SVGData {
        this.gService.removeGrid();
        const innerHTML: string[] = [];
        const el: Element = this.currentDraw.nativeElement;
        const childs: HTMLCollection = el.children;
        for (let i = 0; i < childs.length; i++) {
            try {
                innerHTML.push(childs[i].innerHTML);
            } catch {
                innerHTML.push('');
                console.log('Empty InnerHTML');
            }
        }
        const SVG_DATA: SVGData = {
            width: this.widthAttr + '',
            height: this.heightAttr + '',
            bgColor: childs[0].getAttribute('style'), innerHTML
        };
        console.log(SVG_DATA);
        this.gService.renderBack();
        return SVG_DATA;
    }
}
