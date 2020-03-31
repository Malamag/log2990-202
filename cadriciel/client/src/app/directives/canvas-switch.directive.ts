import { AfterViewInit, Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import { ExportService } from '../services/exportation/export.service';
import { InteractionService } from '../services/service-interaction/interaction.service';

@Directive({
    selector: '[appCanvasSwitch]',
})
export class CanvasSwitchDirective implements AfterViewInit {
    @Input() width: number;
    @Input() height: number;

    canvas: HTMLCanvasElement;

    private imageToConvert: SVGElement;

    constructor(
        private element: ElementRef,
        private exService: ExportService,
        private itService: InteractionService,
        private renderer: Renderer2,
    ) { }

    ngAfterViewInit(): void {
        /**
         * Recieves a signal to transform the SVG to a canvas
         */

        this.itService.$convertSvg2Canvas.subscribe((toCanvas: boolean) => {
            if (toCanvas) {
                this.imageToConvert = this.element.nativeElement;
                this.canvas = this.renderer.createElement('canvas');
                this.itService.emitCanvasContext(this.canvas);
                this.renderer.setAttribute(this.canvas, 'width', this.width.toString());
                this.renderer.setAttribute(this.canvas, 'height', this.height.toString());
                const LOAD_TIME = 25;
                setTimeout(() => {
                    // no name and type set. as optionnal attributes. We dont want to download it

                    this.exService.exportInCanvas(this.imageToConvert, this.canvas);
                }, LOAD_TIME); // gives enough time for the image to load in the exportInCanvas method
            }
        });
    }
}
