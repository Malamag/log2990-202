import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class GridRenderService {
    render: Renderer2;
    private readonly defTransparency = '#000000ff'; // black
    private readonly vGridLines: SVGElement[]; // 2d list of single svg lines on which we will iterate
    private readonly hGridLines: SVGElement[];
    private readonly ns: string = 'http://www.w3.org/2000/svg';

    drawHeight: number;
    drawWidth: number;
    constructor(private gridRef: SVGElement, rendererFactory: RendererFactory2) {
        this.render = rendererFactory.createRenderer(null, null);
    }

    renderVerticalLine(): SVGElement {
        const V_LINE = this.render.createElement('Line', this.ns);

        this.render.setAttribute(V_LINE, 'y1', '0');
        /*
        Shall we build a complete line from 0, 0 to 0, drawHeight?
      */
        this.render.setAttribute(V_LINE, 'y2', `${this.drawHeight}`);
        this.render.setAttribute(V_LINE, 'style', `stroke: ${this.defTransparency}`);

        return V_LINE;
    }

    renderHorizontalLine() {
        const H_LINE = this.render.createElement('Line', this.ns);

        this.render.setAttribute(H_LINE, 'x1', '0');
        /*
        Shall we build a complete line from 0, 0 to 0, drawHeight?
      */
        this.render.setAttribute(H_LINE, 'x2', `${this.drawWidth}`);
        this.render.setAttribute(H_LINE, 'style', `stroke: ${this.defTransparency}`);

        return H_LINE;
    }

    renderVerticalLines(step: number) {
        //let vLineElement: SVGElement;
        //let position: string;

        for (let i = 0; i < this.drawWidth; i += step) {
            const position: string = i.toString();
            const vLineElement: SVGElement = this.renderVerticalLine();
            this.render.setAttribute(vLineElement, 'x1', position);
            this.render.setAttribute(vLineElement, 'x2', position);
            this.vGridLines.push(vLineElement);
        }
    }

    renderHorizontalLines(step: number) {
        for (let j = 0; j < this.drawHeight; j += step) {
            const position: string = j.toString();
            const hLineElement: SVGElement = this.renderHorizontalLine();
            this.render.setAttribute(hLineElement, 'y1', position);
            this.render.setAttribute(hLineElement, 'y2', position);
            this.hGridLines.push(hLineElement);
        }
    }

    updateSpacing() {}

    updateTransparency() {}

    updateGrid() {
        /**
         * takes the svg element and updates the associated grid
         */
    }
}
