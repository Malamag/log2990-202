import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { ColorConvertingService } from '../colorPicker/color-converting.service';
import { InteractionService } from '../service-interaction/interaction.service';

@Injectable({
    providedIn: 'root',
})
export class GridRenderService {
    render: Renderer2;
    readonly defSteps: number = 10;
    private readonly ns: string = 'http://www.w3.org/2000/svg';
    private vGridLines: SVGLineElement[] = [];
    private hGridLines: SVGLineElement[] = [];

    gridAlpha: string;
    gridColor: string;

    drawHeight: number;
    drawWidth: number;
    drawColor: string;
    grid: SVGElement;

    constructor(private rdFact: RendererFactory2, private colConv: ColorConvertingService, private itService: InteractionService) {
        this.render = this.rdFact.createRenderer(null, null);
        this.gridAlpha = 'ff';
        this.gridColor = '#000000';
    }

    renderVerticalLine(): SVGLineElement {
        const V_LINE = this.render.createElement('line', this.ns); // creating a primitive line

        this.render.setAttribute(V_LINE, 'y1', '0');
        this.render.setAttribute(V_LINE, 'y2', `${this.drawHeight}`);
        this.render.setAttribute(V_LINE, 'style', `stroke: ${this.gridColor + this.gridAlpha}`);

        return V_LINE;
    }

    renderHorizontalLine(): SVGLineElement {
        const H_LINE = this.render.createElement('line', this.ns);

        this.render.setAttribute(H_LINE, 'x1', '0');

        this.render.setAttribute(H_LINE, 'x2', `${this.drawWidth}`);
        this.render.setAttribute(H_LINE, 'style', `stroke: ${this.gridColor + this.gridAlpha}`);
        return H_LINE;
    }

    renderVerticalLines(step: number): void {
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

    renderHorizontalLines(step: number): void {
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

    initGrid(gridElement: SVGElement, width: number, height: number, color: string): void {
        this.hGridLines = [];
        this.vGridLines = [];
        this.grid = gridElement;
        this.drawHeight = height;
        this.drawWidth = width;
        this.drawColor = color;
        this.renderHorizontalLines(this.defSteps);
        this.renderVerticalLines(this.defSteps);

        this.hGridLines.forEach((hLine: SVGLineElement) => {
            hLine.style.pointerEvents = 'none';
            this.render.appendChild(this.grid, hLine);
        });

        this.vGridLines.forEach((vLine: SVGLineElement) => {
            vLine.style.pointerEvents = 'none';
            this.render.appendChild(this.grid, vLine);
        });
        this.updateColor(color);
    }

    updateSpacing(spacing: number): void {
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

    updateTransparency(alphaPercent: number): void {
        const PERCENT = 100;
        const ALPHA_VAL: number = alphaPercent / PERCENT;

        this.gridAlpha = this.colConv.alphaRGBToHex(ALPHA_VAL);
        this.updateAttributes('style', `stroke:${this.gridColor + this.gridAlpha}`);
    }

    updateColor(bgColor: string): void {
        const RGBA: number[] = this.colConv.hexToRgba(bgColor);
        const LIMIT = 128;

        // the grid color must be changed to become visible if the background is too dark
        const DARK_BG: boolean = RGBA[0] < LIMIT && RGBA[1] < LIMIT && RGBA[2] < LIMIT;

        const WHITE = '#ffffff';
        const BLACK = '#000000';

        if (DARK_BG) {
            this.gridColor = WHITE;
            this.updateAttributes('style', `stroke:${WHITE + this.gridAlpha}`);
        } else if (!DARK_BG && this.gridColor === WHITE) {
            this.gridColor = BLACK;
            this.updateAttributes('style', `stroke:${BLACK + this.gridAlpha}`);
        }
    }

    toggleGridVisibility(show: boolean): void {
        this.itService.emitGridVisibility(show);
    }

    updateAttributes(attrName: string, value: string): void {
        this.hGridLines.forEach((hLine: SVGLineElement) => {
            this.render.setAttribute(hLine, attrName, value);
        });

        this.vGridLines.forEach((vLine: SVGLineElement) => {
            this.render.setAttribute(vLine, attrName, value);
        });
    }

    removeGrid(): void {
        this.grid.innerHTML = ''; // removes the line elements
    }

    renderBack(): void {
        this.hGridLines.forEach((hLine: SVGLineElement) => {
            this.render.appendChild(this.grid, hLine);
        });

        this.vGridLines.forEach((vLine: SVGElement) => {
            this.render.appendChild(this.grid, vLine);
        });
    }
}
