import { Directive, ElementRef, Input, AfterViewInit } from '@angular/core';
import { ExportService } from '../services/exportation/export.service';
import { InteractionService } from '../services/service-interaction/interaction.service';

@Directive({
    selector: '[appCanvasSwitch]',
})
export class CanvasSwitchDirective implements AfterViewInit {
    @Input('appCanvasRef') canvas: HTMLCanvasElement;

    imageToConvert: SVGElement;
    showCanvas: boolean = false;
    private readonly noDisplay: string = 'none';
    private readonly display: string = 'block';

    constructor(private element: ElementRef, private exService: ExportService, private itService: InteractionService) {
        this.imageToConvert = this.element.nativeElement;
    }

    ngAfterViewInit() {
        /**
         * Recieves a signal to transform the SVG to a canvas
         */
        this.canvas.style.display = this.noDisplay;
        this.imageToConvert.style.display = this.display;

        this.itService.$convertSvg2Canvas.subscribe((toCanvas: boolean) => {
            // no name and type set. as optionnal attributes. We dont want to download it
            if (toCanvas) {
                this.exService.exportInCanvas(this.imageToConvert, this.canvas);
                this.showCanvas = toCanvas;
            } else {
                this.showCanvas = !toCanvas;
            }

            this.toggleSvgCanvas();
        });
    }

    toggleSvgCanvas() {
        if (this.showCanvas) {
            this.canvas.style.display = this.display;
            this.imageToConvert.style.display = this.noDisplay;
        } else {
            this.canvas.style.display = this.display;
            this.imageToConvert.style.display = this.noDisplay;
        }
    }
}
