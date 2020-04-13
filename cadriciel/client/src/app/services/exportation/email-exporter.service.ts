import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { ImageExport } from '../../../../../image-export';

const HTTP_OPTIONS = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'my-auth-token',
    }),
};
@Injectable({
    providedIn: 'root',
})
export class EmailExporterService {
    imageURL: string;
    render: Renderer2;
    xmlSerializer: XMLSerializer;
    constructor(rendererFact: RendererFactory2, private http: HttpClient) {
        this.render = rendererFact.createRenderer(null, null);
        this.xmlSerializer = new XMLSerializer();
    }
    svgToURL(svgElement: Node): string {
        const DATA = this.xmlSerializer.serializeToString(svgElement);
        return 'data:image/svg+xml;base64,' + btoa(DATA);
    }
    send(name: string, format: string, dataSrc: string, mail: string): void {
        const IMG_SEND: ImageExport = {
            type: format,
            fileName: name,
            downloadable: `${name + '.' + format}`,
            src: dataSrc,
            email: mail,
        };
        const URL = 'http://localhost:3000/mail/export';
        this.http.post(URL, IMG_SEND, HTTP_OPTIONS).subscribe(error => {
            console.log(error);
        });
    }
    exportByMail(svgElem: Node, name: string, canvasRef: HTMLCanvasElement, type: string, mail: string): void {
        const CTX: CanvasRenderingContext2D | null = canvasRef.getContext('2d');
        if (CTX) {
            const IMG = new Image();
            this.imageURL = this.svgToURL(svgElem);
            this.loadImageInCanvas(mail, IMG, CTX, canvasRef, name, type);
        }
    }
    exportCanvas(name: string, type: string, canvasRef: HTMLCanvasElement, mail: string): void {
        /* The method to transformthe file in png/jpg is inspired by:
        Communauté StackOverflow (2015). "HTML5 Canvas to PNG File"
        [en ligne] URL:
        https://stackoverflow.com/questions/12796513/html5-canvas-to-png-file
    */
        if (type === 'svg') {
            this.send(name, type, this.imageURL, mail);
        } else {
            this.send(name, type, canvasRef.toDataURL(`image/${type}`, 0.1), mail); // else, use canvas conversion
        }
    }

    loadImageInCanvas(
        mail: string,
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

                this.exportCanvas(imgName, imgType, canvasRef, mail);
            }
        };
        image.src = this.imageURL;
    }
}
