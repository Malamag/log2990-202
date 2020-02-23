import { ElementRef, Injectable } from '@angular/core';
import { ImageFilterService } from '../image-filter/image-filter.service';

@Injectable({
    providedIn: 'root',
})
export class ExportService {
    imageURL: string;

    constructor(private imgFilter: ImageFilterService) {}

    svgToURL(svgElement: SVGElement) {
        const data = new XMLSerializer().serializeToString(svgElement);
        const blob = new Blob([data], { type: 'image/svg+xml' });
        const domurl = window.URL;
        const url = domurl.createObjectURL(blob);
        return url;
    }

    download(name: string, format: string, src: string) {
        // https://stackoverflow.com/questions/23218174/how-do-i-save-export-an-svg-file-after-creating-an-svg-with-d3-js-ie-safari-an
        // utilisation de document absolument nécessaire ici??

        const downloadLink = document.createElement('a');
        downloadLink.href = src;
        downloadLink.download = `${name + '.' + format}`; // produces name.format image
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    }

    exportCanvas(name: string, type: string, canvasRef: ElementRef) {
        // https://stackoverflow.com/questions/12796513/html5-canvas-to-png-file

        this.imgFilter.createCrazySaturationFilter();
        if (type == 'svg') {
            this.download(name, type, this.imageURL);
        } else {
            const DWNLD = canvasRef.nativeElement.toDataURL(`image/${type}`);
            this.download(name, type, DWNLD);
        }
    }

    exportInCanvas(svgElem: SVGElement, canvasRef: ElementRef, name?: string, type?: string): ElementRef {
        // https://stackoverflow.com/questions/12796513/html5-canvas-to-png-file
        const ctx: CanvasRenderingContext2D = canvasRef.nativeElement.getContext('2d');
        const img = new Image();
        this.imageURL = this.svgToURL(svgElem);
        img.onload = () => {
            if (ctx) {
                ctx.drawImage(img, 0, 0);
            }

            if (name && type) {
                // exportation needs to happen in
                this.exportCanvas(name, type, canvasRef);
            }
        };
        img.src = this.imageURL;
        return canvasRef;
    }
}
