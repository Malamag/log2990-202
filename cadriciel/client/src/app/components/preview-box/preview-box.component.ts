import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
// import { DoodleFetchService } from 'src/app/services/doodle-fetch/doodle-fetch.service';

@Component({
    selector: 'app-preview-box',
    templateUrl: './preview-box.component.html',
    styleUrls: ['./preview-box.component.scss'],
})
export class PreviewBoxComponent implements OnInit, AfterViewInit {
    @Input() draw: SVGElement;
    @Input() svgH: number;
    @Input() svgW: number;

    viewBoxStr: string;

    @ViewChild('prevBox', { static: false }) previewBoxRef: ElementRef; // has an eye on the <canvas> element

    ngOnInit() {
        const SCALE = 3;
        this.scaleSVG(SCALE);
    }

    ngAfterViewInit() {
        this.previewBoxRef.nativeElement.innerHTML = this.draw.innerHTML;
    }

    scaleSVG(scaleFacor: number) {
        const viewboxW = this.svgW;
        const viewBoxH = this.svgH;
        this.viewBoxStr = `0 0 ${viewboxW} ${viewBoxH}`;
        this.svgW = this.svgW / scaleFacor;
        this.svgH = this.svgH / scaleFacor;
    }
}
