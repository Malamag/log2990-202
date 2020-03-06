import { Directive, ElementRef, Input, AfterViewInit } from '@angular/core';
import { ExportService } from '../services/exportation/export.service';

@Directive({
    selector: '[appCanvasSwitch]',
})
export class CanvasSwitchDirective implements AfterViewInit {
    @Input('appCanvasRef') canvas: HTMLCanvasElement;
    imageToConvert: SVGElement;

    constructor(private element: ElementRef, private exService: ExportService) {
        this.imageToConvert = this.element.nativeElement;
    }

    ngAfterViewInit() {
        //if (this.canvas) console.log(this.canvas);
        /**
         * Recieves a signal to transform the SVG to a canvas
         */

        // no name and type set. as optionnal attributes. We dont want to download it
        this.exService.exportInCanvas(this.imageToConvert, this.canvas);
    }

    svg2Canvas() {}
}
