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
        const DATA = this.xmlSerializer.serializeToString(svgElement);
        const BLOB = new Blob([DATA], { type: 'image/svg+xml' });
        const DOMURL = window.URL;
        const URL = DOMURL.createObjectURL(BLOB);
        return URL;
    }

    download(name: string, format: string, src: string): void {
        /* The method to download and serialize the file is inspired by:
        Communauté StackOverflow (2015). "How do I save/export an SVG file after creating an SVG with D3.js (IE, safari and chrome)?"
         [en ligne] URL:
        https://stackoverflow.com/questions/23218174/how-do-i-save-export-an-svg-file-after-creating-an-svg-with-d3-js-ie-safari-an
        */

        const DOWNLOAD_LINK = this.render.createElement('a');
        DOWNLOAD_LINK.href = src;
        DOWNLOAD_LINK.download = `${name + '.' + format}`; // produces name.format image
        this.render.appendChild(document.body, DOWNLOAD_LINK);
        DOWNLOAD_LINK.click();
        this.render.removeChild(document.body, DOWNLOAD_LINK);
    }

    exportCanvas(name: string, type: string, canvasRef: HTMLCanvasElement): void {
        /* The method to transformthe file in png/jpg is inspired by:
            Communauté StackOverflow (2015). "HTML5 Canvas to PNG File"
            [en ligne] URL:
            https://stackoverflow.com/questions/12796513/html5-canvas-to-png-file
        */
        if (type === 'svg') {
            this.download(name, type, this.imageURL);
        } else {
            this.download(name, type, canvasRef.toDataURL(`image/${type}`)); // else, use canvas conversion
        }
    }

    exportInCanvas(svgElem: Node, canvasRef: HTMLCanvasElement, name?: string, type?: string): void {
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
