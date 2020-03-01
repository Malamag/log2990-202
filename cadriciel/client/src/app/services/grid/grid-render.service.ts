import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class GridRenderService {
    render: Renderer2;

    private readonly defTransparency = '#000000ff'; // black
    private readonly ns: string = 'http://www.w3.org/2000/svg';
    private readonly vGridLines: SVGLineElement[] = [];
    private readonly hGridLines: SVGLineElement[] = [];

    drawHeight: number;
    drawWidth: number;
    drawColor: string;

    // gridElem: SVGElement
    constructor(private doodle: SVGElement, rdFact: RendererFactory2) {
        this.render = rdFact.createRenderer(null, null);
    }

    renderVerticalLine(): SVGLineElement {
        const V_LINE = this.render.createElement('line', this.ns); // creating a primitive line

        this.render.setAttribute(V_LINE, 'y1', '0');
        this.render.setAttribute(V_LINE, 'y2', `${this.drawHeight}`);
        this.render.setAttribute(V_LINE, 'style', `stroke: ${this.defTransparency}`);

        return V_LINE;
    }

    renderHorizontalLine() {
        const H_LINE = this.render.createElement('line', this.ns);

        this.render.setAttribute(H_LINE, 'x1', '0');

        this.render.setAttribute(H_LINE, 'x2', `${this.drawWidth}`);
        this.render.setAttribute(H_LINE, 'style', `stroke: ${this.defTransparency}`);
        return H_LINE;
    }

    renderVerticalLines(step: number) {
        let vLineElement: SVGLineElement;
        let position: string;

        for (let i = 0; i < this.drawWidth; i += step) {
            position = i.toString();
            vLineElement = this.renderVerticalLine();
            this.render.setAttribute(vLineElement, 'x1', position);
            this.render.setAttribute(vLineElement, 'x2', position);
            this.vGridLines.push(vLineElement);
        }
    }

    renderHorizontalLines(step: number) {
        let hLineElement: SVGLineElement;
        let position: string;
        for (let j = 0; j < this.drawHeight; j += step) {
            position = j.toString();
            hLineElement = this.renderHorizontalLine();
            this.render.setAttribute(hLineElement, 'y1', position);
            this.render.setAttribute(hLineElement, 'y2', position);
            this.hGridLines.push(hLineElement);
        }
    }

    initGrid(width: number, height: number) {
        this.drawWidth = width;
        this.drawHeight = height;
        const DEF_PX_STEP = 20;
        this.renderHorizontalLines(DEF_PX_STEP);
        this.renderVerticalLines(DEF_PX_STEP);

        this.hGridLines.forEach((hLine: SVGLineElement) => {
            this.render.appendChild(this.doodle, hLine);
        });

        this.vGridLines.forEach((vLine: SVGLineElement) => {
            this.render.appendChild(this.doodle, vLine);
        });
    }

    updateSpacing(spacing: number) {
        let hSpacing: number = spacing;
        let wSpacing: number = spacing;

        this.hGridLines.forEach((horizontalLine: SVGLineElement) => {
            this.render.setAttribute(horizontalLine, 'y1', hSpacing.toString());
            this.render.setAttribute(horizontalLine, 'y2', hSpacing.toString());
            hSpacing += spacing;
        });

        this.vGridLines.forEach((verticalLine: SVGLineElement) => {
            this.render.setAttribute(verticalLine, 'x1', wSpacing.toString());
            this.render.setAttribute(verticalLine, 'x2', wSpacing.toString());
            wSpacing += spacing;
        });
    }

    updateTransparency() {}

    updateGrid() {
        /**
         * takes the svg element and updates the associated grid
         */
    }

    updateColor(bgColor: string) {
        // hexadecimal string of 8 characters + '#'
    }

    hideGrid() {}
}
