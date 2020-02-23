import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class ImageFilterService {
    ns: string = 'http://www.w3.org/2000/svg';
    renderer: Renderer2;
    filterArray: SVGElement[];

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
        this.renderer.setAttribute(EFFECT, 'values', '0.1');

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

    createLightFilter(): SVGElement {
        const FILTER: SVGElement = this.filterInit();
        FILTER.id = 'light';

        return FILTER;
    }

    createCrazySaturationFilter(): SVGElement {
        const NOISE_FILTER: SVGElement = this.createNoiseFilter();

        const SATURATION_EFFECT: SVGElement = this.renderer.createElement('feColorMatrix', this.ns);

        this.renderer.setAttribute(SATURATION_EFFECT, 'in', 'SourceGraphic');
        this.renderer.setAttribute(SATURATION_EFFECT, 'type', 'saturate');
        this.renderer.setAttribute(SATURATION_EFFECT, 'values', '100');

        this.renderer.appendChild(NOISE_FILTER, SATURATION_EFFECT);

        return NOISE_FILTER;
    }

    createAllFilters(): SVGElement[] {
        const FILTER_ARRAY: SVGElement[] = [];

        FILTER_ARRAY.push(this.createBNWFilter());
        FILTER_ARRAY.push(this.createHueRotateFilter());
        FILTER_ARRAY.push(this.createNoiseFilter());
        FILTER_ARRAY.push(this.createLightFilter());
        FILTER_ARRAY.push(this.createCrazySaturationFilter());
        return FILTER_ARRAY;
    }

    toggleFilter(doodle: Node, filterNum: number) {
        const SELECT_FILTER = this.filterArray[filterNum];
        this.renderer.setAttribute(doodle, 'filter', `url(#${SELECT_FILTER.id}`);
        this.renderer.appendChild(doodle, SELECT_FILTER);
        console.log(SELECT_FILTER);
        console.log(doodle);
    }
}
