import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class ImageFilterService {
    ns: string = 'http://www.w3.org/2000/svg';
    renderer: Renderer2;
    constructor(rendererFact: RendererFactory2) {
        this.renderer = rendererFact.createRenderer(null, null);
    }

    createBNWFilter(): SVGElement {
        const FILTER: SVGElement = this.filterInit();
        FILTER.id = 'BNW';
        const EFFECT: SVGElement = this.renderer.createElement('feColorMatrix', this.ns);

        this.renderer.setAttribute(EFFECT, 'in', 'SourceGraphic');
        this.renderer.setAttribute(EFFECT, 'type', 'saturate');
        this.renderer.setAttribute(EFFECT, 'values', '0.2');

        this.renderer.appendChild(FILTER, EFFECT);
        //console.log(FILTER);
        return FILTER;
    }

    createHueRotateFilter(): SVGElement {
        const FILTER: SVGElement = this.filterInit();

        FILTER.id = 'hueRotate';
        const EFFECT = this.renderer.createElement('feColorMatrix', this.ns);

        this.renderer.setAttribute(EFFECT, 'in', 'SourceGraphic');
        this.renderer.setAttribute(EFFECT, 'type', 'hueRotate');
        this.renderer.setAttribute(EFFECT, 'values', '180');

        this.renderer.appendChild(FILTER, EFFECT);
        //console.log(FILTER);
        return FILTER;
    }

    createNoiseFilter() {
        const FILTER: SVGElement = this.filterInit();
        FILTER.id = 'noise';

        const TURB_EFFECT = this.renderer.createElement('feTurbulence', this.ns);
        this.renderer.setAttribute(TURB_EFFECT, 'type', 'turbulence');
        this.renderer.setAttribute(TURB_EFFECT, 'baseFrequency', '0.3');
        this.renderer.setAttribute(TURB_EFFECT, 'numOctaves', '2');
        this.renderer.setAttribute(TURB_EFFECT, 'result', 'turbulence');

        const DISPLACE = this.renderer.createElement('feDisplacementMap', this.ns);
        this.renderer.setAttribute(DISPLACE, 'in2', 'turbulence');
        this.renderer.setAttribute(DISPLACE, 'in', 'SourceGraphic');
        this.renderer.setAttribute(DISPLACE, 'scale', '25'); // based on brush effects (see brush.service.ts)
        this.renderer.setAttribute(DISPLACE, 'xChannelSelector', 'R');
        this.renderer.setAttribute(DISPLACE, 'yChannelSelector', 'G');
        this.renderer.setAttribute(DISPLACE, 'result', 'turbulence');

        this.renderer.appendChild(FILTER, TURB_EFFECT);
        this.renderer.appendChild(FILTER, DISPLACE);
        console.log(FILTER);
        return FILTER;
    }

    createPolyFilter() {
        // image shadowed by Polytechnique's colors
    }

    createCrazySaturationFilter() {}

    filterInit(): SVGElement {
        return this.renderer.createElement('filter', this.ns);
    }
}
