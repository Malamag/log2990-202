import { AfterViewInit, Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';

@Component({
    selector: 'app-preview-box',
    templateUrl: './preview-box.component.html',
    styleUrls: ['./preview-box.component.scss'],
})
export class PreviewBoxComponent implements OnInit, AfterViewInit {
    @Input() draw: SVGElement;

    @Input() svgH: number;
    @Input() svgW: number;

    render: Renderer2;
    viewBoxStr: string;

    @ViewChild('prevBox', { static: false }) previewBoxRef: ElementRef; // has an eye on the <svg> element
    constructor(render: Renderer2) {
        this.render = render;
    }

    ngOnInit(): void {
        const SCALE = 3.7;
        this.scaleSVG(SCALE);
    }

    ngAfterViewInit(): void {
        this.render.appendChild(this.previewBoxRef.nativeElement, this.draw);
    }

    scaleSVG(scaleFacor: number): void {
        const W_LIMIT = window.innerWidth / scaleFacor; // in pixels, avoids having a very large preview box relatively to the screen
        const H_LIMIT = window.innerHeight / scaleFacor;

        const VIEWBOX_W = this.svgW;
        const VIEWBOX_H = this.svgH;
        this.viewBoxStr = `0 0 ${VIEWBOX_W} ${VIEWBOX_H}`; // Viewing the whole svg...

        while (this.svgH > H_LIMIT) {
            this.svgH = this.svgH - 1;
        }

        while ((this.svgW / this.svgH) > W_LIMIT / H_LIMIT) {
            this.svgW = this.svgW - 1;
        }
    }
}
