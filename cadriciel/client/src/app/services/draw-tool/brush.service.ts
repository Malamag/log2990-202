import { Injectable } from '@angular/core';
import { ToolsAttributes } from '../attributes/tools-attribute';
import { ColorPickingService } from '../colorPicker/color-picking.service';
import { InteractionService } from '../service-interaction/interaction.service';
import { PencilService } from './pencil.service';
import { Point } from './point';

const DEFAULTLINETHICKNESS = 5;
const DEFAULTTEXTURE = 0;

@Injectable({
    providedIn: 'root',
})
export class BrushService extends PencilService {
    textures: { type: string; intensity: number; frequency: number }[];
    attr: ToolsAttributes;
    constructor(inProgess: HTMLElement, drawing: HTMLElement, selected: boolean, interaction: InteractionService, colorPick: ColorPickingService) {
        super(inProgess, drawing, selected, interaction, colorPick);
        this.updateColors();
        this.updateAttributes();
        this.attr = { lineThickness: DEFAULTLINETHICKNESS, texture: DEFAULTTEXTURE };
        // values used as texture presets
        this.textures = [
            { type: 'blured', intensity: 5, frequency: 0 },
            { type: 'noise', intensity: 0.5, frequency: 0.5 },
            { type: 'noise', intensity: 0.3, frequency: 0.3 },
            { type: 'noise', intensity: 0.9, frequency: 0.3 },
            { type: 'noise', intensity: 0.3, frequency: 0.9 },
        ];
    }

    updateAttributes() {
        this.interaction.$toolsAttributes.subscribe((obj) => {
            if (obj) {
                this.attr = { lineThickness: obj.lineThickness, texture: obj.texture };
            }
        });
    }

    // Creates an svg path that connects every points of currentPath and creates a filter with the brush attributes
    createPath(p: Point[]) {
        let s = '';

        // We need at least 2 points
        if (p.length < 2) {
            return s;
        }

        // get parameters from the used texture
        let width = this.attr.lineThickness;
        let scale = this.textures[this.attr.texture].intensity;

        // "normalize" the frequency to keep a constant render no mather the width or scale
        const frequency = (scale / (width / 10)) * this.textures[this.attr.texture].frequency;

        // create a divider
        s = '<g style="transform: translate(0px, 0px);" name = "brush-stroke">';

        // get a unique ID to make sure each stroke has it's own filter
        const uniqueID = new Date().getTime();

        // create the corresponding svg filter
        if (this.textures[this.attr.texture].type == 'blured') {
            s += this.createBluredFilter(scale, uniqueID);
        } else if (this.textures[this.attr.texture].type == 'noise') {
            // we use a displacement map so we need to resize the brush to keep the overall width
            scale = width / (100 / scale / (100 / width));
            s += this.createNoiseFilter(width, scale, frequency, uniqueID);
            width = width - (width * scale) / 2;
        }

        // start the path
        s += '<path d="';
        // move to the first point
        s += `M ${p[0].x} ${p[0].y} `;
        // for each succeding point, connect it with a line
        for (let i = 1; i < p.length; i++) {
            s += `L ${p[i].x} ${p[i].y} `;
        }
        // set render attributes
        s += `"stroke="${this.chosenColor.primColor}" stroke-width="${this.attr.lineThickness}"`;
        s += 'fill="none" stroke-linecap="round" stroke-linejoin="round"';
        s += `filter="url(#${uniqueID})"/>`;
        // end the path

        // end the divider
        s += '</g>';

        return s;
    }

    // creates an svg filter with gaussian blur
    createBluredFilter(scale: number, ID: number) {
        let filter = '';

        // filter
        filter += `<filter id="${ID}" filterUnits="userSpaceOnUse">`;

        // gaussian blur
        filter += `<feGaussianBlur in="SourceGraphic" stdDeviation="${scale}"/>`;

        filter += '</filter>';

        return filter;
    }

    // create an svg filter with a displacement map (turbulence)
    createNoiseFilter(width: number, scale: number, frequency: number, ID: number) {
        let filter = '';

        // filter
        filter += `<filter id="${ID}"`;
        filter += 'x="-100%" y="-100%" width="300%" height="300%" filterUnits="userSpaceOnUse">';

        // turbulence
        filter += `<feTurbulence type="turbulence" baseFrequency="${frequency}" numOctaves="2" result="turbulence"/>`;
        filter += '<feDisplacementMap in2="turbulence" in="SourceGraphic"';
        filter += `scale="${width * scale}"`;
        filter += 'xChannelSelector="R" yChannelSelector="G" result="turbulence"/>';

        // offset to recenter the stroke after the displacement
        filter += `<feOffset in="turbulence" dx="${(-width * scale) / 4}" dy="${(-width * scale) / 4}"/>`;

        filter += '</filter>';

        return filter;
    }
}
