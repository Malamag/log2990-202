import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { ColorConvertingService } from '../colorPicker/color-converting.service';
import { InteractionService } from '../service-interaction/interaction.service';

@Injectable({
    providedIn: 'root',
})
export class GridRenderService {
    render: Renderer2;
    readonly defSteps = 5;
    private readonly ns: string = 'http://www.w3.org/2000/svg';
    private vGridLines: SVGLineElement[] = [];
    private hGridLines: SVGLineElement[] = [];

    gridAlpha: string = 'ff';
    gridColor: string = '#000000';

    drawHeight: number;
    drawWidth: number;
    drawColor: string;
    grid: SVGElement;

    gridHTML: string;

    constructor(rdFact: RendererFactory2, private colConv: ColorConvertingService, private itService: InteractionService) {
        // gridElem: SVGElement
        this.render = rdFact.createRenderer(null, null);
    }

    renderVerticalLine(): SVGLineElement {
        const V_LINE = this.render.createElement('line', this.ns); // creating a primitive line

        this.render.setAttribute(V_LINE, 'y1', '0');
        this.render.setAttribute(V_LINE, 'y2', `${this.drawHeight}`);
        this.render.setAttribute(V_LINE, 'style', `stroke: ${this.gridColor + this.gridAlpha}`);

        return V_LINE;
    }

    renderHorizontalLine() {
        const H_LINE = this.render.createElement('line', this.ns);

        this.render.setAttribute(H_LINE, 'x1', '0');

        this.render.setAttribute(H_LINE, 'x2', `${this.drawWidth}`);
        this.render.setAttribute(H_LINE, 'style', `stroke: ${this.gridColor + this.gridAlpha}`);
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

    initGrid(gridElement: SVGElement, width: number, height: number, color: string) {
        this.grid = gridElement;
        this.drawHeight = height;
        this.renderHorizontalLines(this.defSteps);
        this.renderVerticalLines(this.defSteps);

        this.hGridLines.forEach((hLine: SVGLineElement) => {
            this.render.appendChild(this.grid, hLine);
        });

        this.vGridLines.forEach((vLine: SVGLineElement) => {
            this.render.appendChild(this.grid, vLine);
        });
        this.updateColor(color);
        this.gridHTML = this.grid.innerHTML;
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

    updateTransparency(alphaPercent: number) {
        const PERCENT: number = 100;
        const ALPHA_VAL: number = alphaPercent / PERCENT;

        this.gridAlpha = this.colConv.alphaRGBToHex(ALPHA_VAL);
        this.updateAttributes('style', `stroke:${this.gridColor + this.gridAlpha}`);
    }

    updateColor(bgColor: string) {
        const RGBA: number[] = this.colConv.hexToRgba(bgColor);
        const LIMIT = 128;

        //the grid color must be changed to become visible if the background is too dark
        const DARK_BG: boolean = RGBA[0] < LIMIT && RGBA[1] < LIMIT && RGBA[2] < LIMIT;

        const WHITE: string = '#ffffff';
        const BLACK: string = '#000000';

        if (DARK_BG) {
            this.gridColor = WHITE;
            this.updateAttributes('style', `stroke:${WHITE + this.gridAlpha}`);
            //this.render.setAttribute(this.grid, 'style', `background-color:${WHITE}`);
        } else if (!DARK_BG && this.gridColor === WHITE) {
            this.gridColor = BLACK;
            this.updateAttributes('style', `stroke:${BLACK + this.gridAlpha}`);
        }
    }

    toggleGridVisibility(show: boolean) {
        this.itService.emitGridVisibility(show);
    }

    updateAttributes(attrName: string, value: string) {
        this.hGridLines.forEach((hLine: SVGLineElement) => {
            this.render.setAttribute(hLine, attrName, value);
        });

        this.vGridLines.forEach((vLine: SVGLineElement) => {
            this.render.setAttribute(vLine, attrName, value);
        });
    }

    removeGrid() {
        this.grid.innerHTML = '';
    }

    renderCurrentGrid() {
        this.grid.innerHTML = this.gridHTML;
    }
}
