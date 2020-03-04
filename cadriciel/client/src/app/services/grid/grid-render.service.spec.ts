import { TestBed } from '@angular/core/testing';

import { GridRenderService } from './grid-render.service';

describe('GridRenderService', () => {
    let service: GridRenderService;
    let svgElemStub: any;
    beforeEach(() => {
        svgElemStub = {
            innerHTML: '<div>Hello World</div>',
        };
        TestBed.configureTestingModule({
            providers: [],
        });
        service = TestBed.get(GridRenderService);
    });

    it('should be created', () => {
        const service: GridRenderService = TestBed.get(GridRenderService);
        expect(service).toBeTruthy();
    });

    it('should render a verical line with its attributes', () => {
        const ATTR_NUM = 3;
        service.render.createElement = jasmine.createSpy().and.returnValue(svgElemStub);
        const setAttrSpy = spyOn(service.render, 'setAttribute');
        const LINE = service.renderVerticalLine();
        expect(setAttrSpy).toHaveBeenCalledTimes(ATTR_NUM);
        expect(service.render.createElement).toHaveBeenCalled();
        expect(LINE).toBeDefined();
    });

    it('should render a horizontal line with its attributes', () => {
        const ATTR_NUM: number = 3;
        service.render.createElement = jasmine.createSpy().and.returnValue(svgElemStub);
        const setAttrSpy = spyOn(service.render, 'setAttribute');
        const LINE = service.renderHorizontalLine();
        expect(setAttrSpy).toHaveBeenCalledTimes(ATTR_NUM);
        expect(service.render.createElement).toHaveBeenCalled();
        expect(LINE).toBeDefined();
    });

    it('should render the proper number of horizontal lines from draw height and step', () => {
        const STEP: number = 5;
        const HEIGHT: number = 200; // 1 line every 5px for 200px
        service.drawHeight = HEIGHT;
        const renderSpy = spyOn(service, 'renderHorizontalLine');
        const setAttrSpy = spyOn(service.render, 'setAttribute');
        service.renderHorizontalLines(STEP);
        expect(renderSpy).toHaveBeenCalledTimes(HEIGHT / STEP);

        const ATTR_NUM: number = 2; // setting y1 and y2
        expect(setAttrSpy).toHaveBeenCalledTimes(ATTR_NUM * (HEIGHT / STEP));
    });

    it('should populate the horizontal grid lines array', () => {
        const STEP: number = 5;
        const HEIGHT: number = 200;
        service.drawHeight = HEIGHT;
        const spy = spyOn(service['hGridLines'], 'push');
        service.renderHorizontalLines(STEP);

        expect(spy).toHaveBeenCalledTimes(HEIGHT / STEP);
    });

    it('should render the proper number of vertical lines from draw width and step', () => {
        const STEP: number = 10;
        const WIDTH: number = 400; // 1 line every 5px for 200px
        service.drawWidth = WIDTH;
        const renderSpy = spyOn(service, 'renderVerticalLine');
        const setAttrSpy = spyOn(service.render, 'setAttribute');
        service.renderVerticalLines(STEP);
        expect(renderSpy).toHaveBeenCalledTimes(WIDTH / STEP);

        const ATTR_NUM: number = 2; // setting x1 and yx
        expect(setAttrSpy).toHaveBeenCalledTimes(ATTR_NUM * (WIDTH / STEP));
    });

    it('should populate the vertical grid lines array', () => {
        const STEP: number = 10;
        const WIDTH: number = 400;
        service.drawWidth = WIDTH;
        const spy = spyOn(service['vGridLines'], 'push');
        service.renderVerticalLines(STEP);

        expect(spy).toHaveBeenCalledTimes(WIDTH / STEP);
    });

    it('should render horizontal lines on init with default steps', () => {
        service.render.appendChild = jasmine.createSpy().and.returnValue(0);
        const HEIGHT: number = 200;
        const WIDTH: number = 400;
        const COLOR: string = '#ffffff';
        const spy = spyOn(service, 'renderHorizontalLines');
        service.initGrid(svgElemStub, WIDTH, HEIGHT, COLOR);
        expect(spy).toHaveBeenCalled();
    });

    it('should render vertical lines on init with default steps', () => {
        service.render.appendChild = jasmine.createSpy().and.returnValue(0);
        const HEIGHT: number = 200;
        const WIDTH: number = 400;
        const COLOR: string = '#ffffff';
        const spy = spyOn(service, 'renderVerticalLines');
        service.initGrid(svgElemStub, WIDTH, HEIGHT, COLOR);
        expect(spy).toHaveBeenCalled();
    });

    it('should append all the lines to the grid svg element', () => {
        service.grid = svgElemStub;
        const HEIGHT: number = 200;
        const WIDTH: number = 400;
        const COLOR: string = '#ffffff';
        const spy = spyOn(service.render, 'appendChild');
        service.initGrid(svgElemStub, WIDTH, HEIGHT, COLOR);

        const H_LINE_CALLS: number = HEIGHT / service['defSteps'];
        const V_LINE_CALLS: number = WIDTH / service['defSteps'];
        expect(spy).toHaveBeenCalledTimes(H_LINE_CALLS + V_LINE_CALLS);
    });

    it('should call color update function on grid init', () => {
        service.grid = svgElemStub;
        service.render.appendChild = jasmine.createSpy().and.returnValue(0);
        const HEIGHT: number = 200;
        const WIDTH: number = 400;
        const COLOR: string = '#ffffff';
        const spy = spyOn(service, 'updateColor');
        service.initGrid(svgElemStub, WIDTH, HEIGHT, COLOR);
        expect(spy).toHaveBeenCalledWith(COLOR);
    });

    it('should set the new position attibutes on spacing update', () => {
        const ELEM_NUM: number = 15;
        const SPACE: number = 30;

        for (let i = 0; i < ELEM_NUM; ++i) {
            service['hGridLines'].push(svgElemStub);
            service['vGridLines'].push(svgElemStub);
        }
        const spy = spyOn(service.render, 'setAttribute');
        service.updateSpacing(SPACE);
        expect(spy).toHaveBeenCalledTimes(ELEM_NUM * 4);
    });
});
