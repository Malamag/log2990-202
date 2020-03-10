import { AfterViewInit, Directive, ElementRef, Input } from '@angular/core';
import { ExportService } from '../services/exportation/export.service';
import { InteractionService } from '../services/service-interaction/interaction.service';

@Directive({
    selector: '[appCanvasSwitch]',
})
export class CanvasSwitchDirective implements AfterViewInit {
    @Input('appCanvasRef') canvas: HTMLCanvasElement;

    private imageToConvert: SVGElement;
    private showCanvas = false;
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
        this.exService.exportInCanvas(this.imageToConvert, this.canvas);

        this.itService.$convertSvg2Canvas.subscribe((toCanvas: boolean) => {
            // console.log('signal recieved with ' + toCanvas);
            // no name and type set. as optionnal attributes. We dont want to download it
            this.imageToConvert = this.element.nativeElement;
            if (toCanvas) {
                setTimeout(() => {
                    this.exService.exportInCanvas(this.imageToConvert, this.canvas);
                }, 1); // gives enough time for the image to load in the exportInCanvas method
            }

            this.showCanvas = toCanvas;
            this.toggleSvgCanvas();
        });
    }

    toggleSvgCanvas() {
        if (this.showCanvas) {
            this.canvas.style.display = this.display;
            this.imageToConvert.style.display = this.noDisplay;
        } else {
            this.canvas.style.display = this.noDisplay;
            this.imageToConvert.style.display = this.display;
        }
    }
}
