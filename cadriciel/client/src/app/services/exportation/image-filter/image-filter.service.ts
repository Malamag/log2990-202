import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class ImageFilterService {
    private readonly ns: string = 'http://www.w3.org/2000/svg'; // svg namespace to get its proper attributes

    renderer: Renderer2;
    filterArray: SVGElement[];

    currentFilter: SVGElement | undefined;

    constructor(rendererFact: RendererFactory2) {
        this.renderer = rendererFact.createRenderer(null, null);
        this.filterArray = this.createAllFilters();
    }

    filterInit(): SVGElement {
        return this.renderer.createElement('filter', this.ns);
    }

    createBNWFilter(): SVGElement {
        const FILTER: SVGElement = this.filterInit();
        FILTER.id = 'BNW';
        const EFFECT: SVGElement = this.renderer.createElement('feColorMatrix', this.ns);

        this.renderer.setAttribute(EFFECT, 'in', 'SourceGraphic');
        this.renderer.setAttribute(EFFECT, 'type', 'saturate');
        this.renderer.setAttribute(EFFECT, 'values', '0');

        this.renderer.appendChild(FILTER, EFFECT);

        return FILTER;
    }

    createHueRotateFilter(): SVGElement {
        const FILTER: SVGElement = this.filterInit();

        FILTER.id = 'hueRotate';
        const EFFECT: SVGElement = this.renderer.createElement('feColorMatrix', this.ns);

        this.renderer.setAttribute(EFFECT, 'in', 'SourceGraphic');
        this.renderer.setAttribute(EFFECT, 'type', 'hueRotate');
        this.renderer.setAttribute(EFFECT, 'values', '180');

        this.renderer.appendChild(FILTER, EFFECT);

        return FILTER;
    }

    createNoiseFilter(): SVGElement {
        const FILTER: SVGElement = this.filterInit();
        FILTER.id = 'noise';

        const TURB_EFFECT: SVGElement = this.renderer.createElement('feTurbulence', this.ns);
        this.renderer.setAttribute(TURB_EFFECT, 'type', 'turbulence');
        this.renderer.setAttribute(TURB_EFFECT, 'baseFrequency', '0.3');
        this.renderer.setAttribute(TURB_EFFECT, 'numOctaves', '2');
        this.renderer.setAttribute(TURB_EFFECT, 'result', 'turbulence');

        const DISPLACE: SVGElement = this.renderer.createElement('feDisplacementMap', this.ns);
        this.renderer.setAttribute(DISPLACE, 'in2', 'turbulence');
        this.renderer.setAttribute(DISPLACE, 'in', 'SourceGraphic');
        this.renderer.setAttribute(DISPLACE, 'scale', '25'); // based on brush effects (see brush.service.ts)
        this.renderer.setAttribute(DISPLACE, 'xChannelSelector', 'R');
        this.renderer.setAttribute(DISPLACE, 'yChannelSelector', 'G');
        this.renderer.setAttribute(DISPLACE, 'result', 'turbulence');

        this.renderer.appendChild(FILTER, TURB_EFFECT);
        this.renderer.appendChild(FILTER, DISPLACE);

        return FILTER;
    }

    createSoftFilter(): SVGElement {
        const FILTER: SVGElement = this.filterInit();
        FILTER.id = 'soft';

        const SOFT_EFFECT = this.renderer.createElement('feGaussianBlur', this.ns);
        this.renderer.setAttribute(SOFT_EFFECT, 'stdDeviation', '2');

        const LIGHT_EFFECT = this.renderer.createElement('feColorMatrix');
        this.renderer.setAttribute(LIGHT_EFFECT, 'in', 'SourceGraphic');
        this.renderer.setAttribute(LIGHT_EFFECT, 'type', 'matrix');
        const VALUES: string =
            '1.3 0 0 0 0' + //increases luminosity
            '0 1.3 0 0 0' +
            '0 0 1.3 0 0' +
            '0 0 0 1.3 1';

        this.renderer.setAttribute(LIGHT_EFFECT, 'values', VALUES);
        this.renderer.appendChild(FILTER, SOFT_EFFECT);
        this.renderer.appendChild(FILTER, LIGHT_EFFECT);

        return FILTER;
    }

    createTextureFilter(): SVGElement {
        const FILTER: SVGElement = this.filterInit();
        FILTER.id = 'texture';
        const EFFECT: SVGElement = this.renderer.createElement('feConvolveMatrix', this.ns);
        const VALUES = ' 10 0 0 0 0 0 0 -10 3'; // some random values for a 3x3 matrix

        this.renderer.setAttribute(EFFECT, 'kernelMatrix', VALUES);

        this.renderer.appendChild(FILTER, EFFECT);
        return FILTER;
    }

    createAllFilters(): SVGElement[] {
        const FILTER_ARRAY: SVGElement[] = [];

        FILTER_ARRAY.push(this.createBNWFilter());
        FILTER_ARRAY.push(this.createHueRotateFilter());
        FILTER_ARRAY.push(this.createNoiseFilter());
        FILTER_ARRAY.push(this.createSoftFilter());
        FILTER_ARRAY.push(this.createTextureFilter());
        return FILTER_ARRAY;
    }

    toggleFilter(doodle: Node, filterNum: number) {
        const NO_FILTER_INDEX: number = -1;

        if (filterNum === NO_FILTER_INDEX) {
            if (this.currentFilter) {
                this.renderer.removeChild(doodle, this.currentFilter); // remove the previous filter from the svg
                this.renderer.setAttribute(doodle, 'filter', '');
            }
            return; // no filer choosen; get out of the method
        }

        if (this.currentFilter) {
            this.renderer.removeChild(doodle, this.currentFilter);
        }

        const SELECT_FILTER = this.filterArray[filterNum];
        this.renderer.setAttribute(doodle, 'filter', `url(#${SELECT_FILTER.id})`);
        this.renderer.appendChild(doodle, SELECT_FILTER);
        this.currentFilter = SELECT_FILTER;
    }
}
