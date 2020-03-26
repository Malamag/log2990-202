import { TestBed } from '@angular/core/testing';

import { BrushService } from './brush.service';

import { KeyboardHandlerService } from '../keyboard-handler/keyboard-handler.service';
import { InteractionService } from '../service-interaction/interaction.service';
import { Point } from './point';

export class FakeInteractionService extends InteractionService { }

fdescribe('BrushService', () => {
    let service: BrushService;
    let ptA: Point;
    let ptB: Point;
    let ptArr: Point[];
    // tslint:disable-next-line: no-any
    let kbServiceStub: any;

    beforeEach(() => {
        kbServiceStub = {};
        TestBed.configureTestingModule({
            providers: [
                { provide: HTMLElement, useValue: {} },
                { provide: Boolean, useValue: false },
                { provide: Number, useValue: 0 },
                { provide: String, useValue: '' },
                { provide: KeyboardHandlerService, kbServiceStub },
            ],
        });
        ptA = new Point(0, 0);
        ptB = new Point(1, 2);
        ptArr = [ptA, ptB];
        service = TestBed.get(BrushService);
    });

    it('should be created', () => {
        const TEST_SERVICE: BrushService = TestBed.get(BrushService);
        expect(TEST_SERVICE).toBeTruthy();
    });

    it('should set the attributes in the subscription', () => {
        service.interaction.emitToolsAttributes({ lineThickness: 0, texture: 0 }); // emit fake
        const SPY_INTERACTION = spyOn(service.interaction.$toolsAttributes, 'subscribe');
        service.updateAttributes();
        expect(SPY_INTERACTION).toHaveBeenCalled();
        expect(service.attr).toBeDefined();
    });

    it('should create a valid path', () => {
        const PATH = service.createPath(ptArr);
        expect(PATH).toContain('<path');
    });

    it('the path must have the same starting point has the mouse', () => {
        const PATH = service.createPath(ptArr);
        expect(PATH).toContain(`M ${ptArr[0].x} ${ptArr[0].y} `);
    });

    it('the path must be pursued by the next point', () => {
        const PATH = service.createPath(ptArr);
        expect(PATH).toContain(`L ${ptArr[1].x} ${ptArr[1].y} `); // second and last point of our fake array
    });

    it('should have the primary color as attribute', () => {
        const PRIM = '#ffffff';
        const SEC = '#000000';
        const BACK = '#ffffff';
        service.chosenColor = { primColor: PRIM, secColor: SEC, backColor: BACK };

        const PATH = service.createPath(ptArr);

        expect(PATH).toContain(PRIM); // we want to see the primary color, but not the secondary!
        expect(PATH).not.toContain(SEC);
    });

    it('should have the choosen thickness', () => {
        const THICK = 25; // fake thickness used for this test's purpose
        service.attr.lineThickness = THICK;
        const PATH = service.createPath(ptArr);
        expect(PATH).toContain(`stroke-width="${THICK}"`); // svg attribute along with its value
    });

    it('should have a round linecap and linejoin', () => {
        const PATH = service.createPath(ptArr);

        expect(PATH).toContain('stroke-linecap="round"');
        expect(PATH).toContain('stroke-linejoin="round"');
    });

    it('should be named brush-stroke', () => {
        const PATH = service.createPath(ptArr);
        const NAME = 'brush-stroke';
        expect(PATH).toContain(NAME);
    });

    it('a filter of a unique id should be present on the brush stroke', () => {
        const PATH = service.createPath(ptArr);

        expect(PATH).toContain('url');
    });

    it('should build a gaussian blur filter based on a given scale', () => {
        const SCALE = 1;
        const ID = 0;
        const FILTER = service.createBluredFilter(SCALE, ID);

        expect(FILTER).toContain('<filter');
        expect(FILTER).toContain('feGaussianBlur'); // filter name (svg)

        expect(FILTER).toContain(`stdDeviation="${SCALE}"`); // check for attribute application
    });

    it('should build a noise filter with displacement', () => {
        const W = 1;
        const SCALE = 1;
        const FREQ = 1;
        const ID = 0;

        const FILTER = service.createNoiseFilter(W, SCALE, FREQ, ID);
        expect(FILTER).toContain('<filter');

        // turbulence filter attributes
        expect(FILTER).toContain(`<feTurbulence type="turbulence" baseFrequency="${FREQ}" numOctaves="2" result="turbulence"/>`);
        expect(FILTER).toContain(`scale="${W * SCALE}"`);

        // offset check, as set in brush.service.ts
        const DIVIDER = 4;
        expect(FILTER).toContain(`<feOffset in="turbulence" dx="${(-W * SCALE) / DIVIDER}" dy="${(-W * SCALE) / DIVIDER}"/>`);
    });

    it('should apply a blured texture', () => {
        const TYPE = 'blured';
        service.textures[0].type = TYPE;
        const SPY = spyOn(service, 'createBluredFilter');
        service.createPath(ptArr);
        expect(SPY).toHaveBeenCalled();
    });

    it('should create a noise filter', () => {
        service.attr.texture = 1;

        const SPY = spyOn(service, 'createNoiseFilter');
        service.createPath(ptArr);
        expect(SPY).toHaveBeenCalled();
    });

    it('should return an empty html string if there is not enough points to compute', () => {
        const TEST_ARR = [ptA];
        const HTML_STR = service.createPath(TEST_ARR);
        expect(HTML_STR).toEqual('');
    });

    it('should not assign the attributes if they are undefined', () => {
        service.attr = { lineThickness: 0, texture: 0 };
        service.updateAttributes();
        service.interaction.emitToolsAttributes(undefined);
        expect(service.attr).toBeDefined();
    });

    it('should not create any filter if no valid texture type has been selected', () => {
        const SPY_BLUR = spyOn(service, 'createBluredFilter');
        const SPY_NOISE = spyOn(service, 'createNoiseFilter');

        service.textures[service.attr.texture].type = 'testTexture';

        service.createPath(ptArr);

        expect(SPY_BLUR).not.toHaveBeenCalled();
        expect(SPY_NOISE).not.toHaveBeenCalled();
    });
});
