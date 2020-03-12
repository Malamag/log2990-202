import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class ExportService {
    imageURL: string;
    render: Renderer2;
    xmlSerializer: XMLSerializer;
    constructor(rendererFact: RendererFactory2) {
        this.render = rendererFact.createRenderer(null, null);
        this.xmlSerializer = new XMLSerializer();
    }

    svgToURL(svgElement: Node): string {
        const data = this.xmlSerializer.serializeToString(svgElement);
        console.log('data' + data);
        const blob = new Blob([data], { type: 'image/svg+xml' });
        const domurl = window.URL;
        const url = domurl.createObjectURL(blob);
        return url;
    }

    download(name: string, format: string, src: string): void {
        // https://stackoverflow.com/questions/23218174/how-do-i-save-export-an-svg-file-after-creating-an-svg-with-d3-js-ie-safari-an

        const downloadLink = this.render.createElement('a');
        downloadLink.href = src;
        downloadLink.download = `${name + '.' + format}`; // produces name.format image
        this.render.appendChild(document.body, downloadLink);
        downloadLink.click();
        this.render.removeChild(document.body, downloadLink);
    }

    exportCanvas(name: string, type: string, canvasRef: HTMLCanvasElement): void {
        // https://stackoverflow.com/questions/12796513/html5-canvas-to-png-file
        if (type === 'svg') {
            this.download(name, type, this.imageURL);
        } else {
            this.download(name, type, canvasRef.toDataURL(`image/${type}`)); // else, use canvas conversion
        }
    }

    exportInCanvas(svgElem: Node, canvasRef: HTMLCanvasElement, name?: string, type?: string): void {
        // https://stackoverflow.com/questions/12796513/html5-canvas-to-png-file

        const CTX: CanvasRenderingContext2D | null = canvasRef.getContext('2d');
        if (CTX) {
            const IMG = new Image();
            this.imageURL = this.svgToURL(svgElem);
            this.loadImageInCanvas(IMG, CTX, canvasRef, name, type);
        }
    }

    loadImageInCanvas(
        image: HTMLImageElement,
        ctx: CanvasRenderingContext2D,
        canvasRef: HTMLCanvasElement,
        imgName?: string,
        imgType?: string,
    ): void {
        image.onload = () => {
            ctx.drawImage(image, 0, 0);
            if (imgName && imgType) {
                // will proceed to download if defined name and type

                this.exportCanvas(imgName, imgType, canvasRef);
            }
        };
        image.src = this.imageURL;
    }
}
