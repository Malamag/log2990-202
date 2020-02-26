import { Component, ElementRef, Input, OnInit, ViewChild, Renderer2, AfterViewInit } from '@angular/core';

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

    @ViewChild('prevBox', { static: false }) previewBoxRef: ElementRef; // has an eye on the <canvas> element
    constructor(render: Renderer2) {
        this.render = render;
    }
    ngOnInit() {
        const SCALE = 3;
        this.scaleSVG(SCALE);
    }

    ngAfterViewInit() {
        this.initBox();
    }

    scaleSVG(scaleFacor: number) {
        const VIEWBOX_W = this.svgW;
        const VIEWBOX_H = this.svgH;
        this.viewBoxStr = `0 0 ${VIEWBOX_W} ${VIEWBOX_H}`;
        this.svgW = this.svgW / scaleFacor;
        this.svgH = this.svgH / scaleFacor;
    }

    initBox() {
        this.render.appendChild(this.previewBoxRef.nativeElement, this.draw);
    }
}
