import { ElementRef, Injectable } from '@angular/core';
import { ImageFilterService } from '../image-filter/image-filter.service';

@Injectable({
    providedIn: 'root',
})
export class ExportService {
    imageURL: string;

    constructor(private imgFilter: ImageFilterService) {}

    svgToURL(svgElement: Node) {
        const data = new XMLSerializer().serializeToString(svgElement);
        const blob = new Blob([data], { type: 'image/svg+xml' });
        const domurl = window.URL;
        const url = domurl.createObjectURL(blob);
        return url;
    }

    download(name: string, format: string, src: string) {
        // https://stackoverflow.com/questions/23218174/how-do-i-save-export-an-svg-file-after-creating-an-svg-with-d3-js-ie-safari-an

        const downloadLink = document.createElement('a');
        downloadLink.href = src;
        downloadLink.download = `${name + '.' + format}`; // produces name.format image
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    }

    exportCanvas(name: string, type: string, canvasRef: ElementRef) {
        // https://stackoverflow.com/questions/12796513/html5-canvas-to-png-file

        type === 'svg' ? this.download(name, type, this.imageURL) : this.download(name, type, canvasRef.nativeElement.toDataURL(`image/${type}`)); // else, use canvas conversion
    }

    exportInCanvas(svgElem: Node, canvasRef: ElementRef, name?: string, type?: string): ElementRef {
        // https://stackoverflow.com/questions/12796513/html5-canvas-to-png-file
        this.imgFilter.toggleFilter(svgElem, 3);

        const ctx: CanvasRenderingContext2D = canvasRef.nativeElement.getContext('2d');
        const img = new Image();
        this.imageURL = this.svgToURL(svgElem);
        img.onload = () => {
            if (ctx) {
                ctx.drawImage(img, 0, 0);
            }

            if (name && type) {
                // exportation needs to happen in a canvas element
                this.exportCanvas(name, type, canvasRef);
            }
        };
        img.src = this.imageURL;
        return canvasRef;
    }
}
