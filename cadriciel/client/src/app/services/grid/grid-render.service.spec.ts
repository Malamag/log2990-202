import { TestBed } from '@angular/core/testing';

import { GridRenderService } from './grid-render.service';

describe('GridRenderService', () => {
    let service: GridRenderService;
    let svgElemStub: any;
    beforeEach(() => {
        svgElemStub = {
            innerHTML: '<div>Hello World</div>',
            x1: '',
            x2: '',
            y1: '',
            y2: '',
        };
        TestBed.configureTestingModule({});
        service = TestBed.get(GridRenderService);
        service.grid = svgElemStub;
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
        service.render.appendChild = jasmine.createSpy().and.returnValue(0);
        const HEIGHT: number = 200;
        const WIDTH: number = 400;
        const COLOR: string = '#ffffff';
        const spy = spyOn(service, 'updateColor');
        service.initGrid(svgElemStub, WIDTH, HEIGHT, COLOR);
        expect(spy).toHaveBeenCalledWith(COLOR);
    });

    it('should set the new position attibutes on spacing update and update innerHTML', () => {
        const ELEM_NUM: number = 15;
        const SPACE: number = 30;
        const ATTR_SET_CALLS: number = 4;
        service.grid = svgElemStub;

        for (let i = 0; i < ELEM_NUM; ++i) {
            service['hGridLines'].push(svgElemStub);
            service['vGridLines'].push(svgElemStub);
        }
        const spy = spyOn(service.render, 'setAttribute');
        service.updateSpacing(SPACE);
        expect(spy).toHaveBeenCalledTimes(ELEM_NUM * ATTR_SET_CALLS);
    });

    it('should update line transparency with alpha hex input', () => {
        const ALPHA_PERCENT: number = 70;

        const colorSpy = spyOn(service['colConv'], 'alphaRGBToHex');
        service.updateTransparency(ALPHA_PERCENT);
        expect(colorSpy).toHaveBeenCalled();
    });

    it('should update the attributes after transparency change', () => {
        const ALPHA_PERCENT: number = 70;

        const spy = spyOn(service, 'updateAttributes');
        service.updateTransparency(ALPHA_PERCENT);
        expect(spy).toHaveBeenCalled();
    });

    it('should convert hex bg color to rgba on color update', () => {
        const BG_COLOR: string = '#ffffffff';
        service['colConv'].hexToRgba = jasmine.createSpy().and.returnValue([255, 255, 255, 255]);
        service.updateColor(BG_COLOR);
        expect(service['colConv'].hexToRgba).toHaveBeenCalledWith(BG_COLOR);
    });

    it('should turn change the grid color to white if the background is too dark', () => {
        const BG_RBGA: number[] = [127, 127, 127, 255];
        const FAKE_BG_COLOR: string = '#88888888'; // only to serve as a valid attribute to our function
        service['colConv'].hexToRgba = jasmine.createSpy().and.returnValue(BG_RBGA);
        const GRID_ALPHA: string = 'ff';
        service.gridAlpha = GRID_ALPHA;
        const WHITE: string = '#ffffff';
        const spy = spyOn(service, 'updateAttributes');
        service.updateColor(FAKE_BG_COLOR);
        expect(service['gridColor']).toEqual(WHITE);
        expect(spy).toHaveBeenCalledWith('style', `stroke:${WHITE + service.gridAlpha}`);
    });

    it('should turn change the grid color to black if the background is too pale', () => {
        const BG_RBGA: number[] = [129, 129, 255, 255];
        const FAKE_BG_COLOR: string = '#88888888'; // only to serve as a valid attribute to our function
        service['colConv'].hexToRgba = jasmine.createSpy().and.returnValue(BG_RBGA);

        const GRID_ALPHA: string = 'ff';
        service.gridAlpha = GRID_ALPHA;

        const WHITE: string = '#ffffff';
        service.gridColor = WHITE;

        const BLACK: string = '#000000';

        const spy = spyOn(service, 'updateAttributes');

        service.updateColor(FAKE_BG_COLOR);

        expect(service['gridColor']).toEqual(BLACK);
        expect(spy).toHaveBeenCalledWith('style', `stroke:${BLACK + service.gridAlpha}`);
    });

    it('should emit a signal with grid visibility boolean on toggle', () => {
        const spy = spyOn(service['itService'], 'emitGridVisibility');
        const SHOW: boolean = true;
        service.toggleGridVisibility(SHOW);
        expect(spy).toHaveBeenCalledWith(SHOW);
    });

    it('should be able to update the attributes on the line arrays', () => {
        const ELEM_NUM: number = 15;

        service.grid = svgElemStub;

        for (let i = 0; i < ELEM_NUM; ++i) {
            service['hGridLines'].push(svgElemStub);
            service['vGridLines'].push(svgElemStub);
        }

        const spy = spyOn(service.render, 'setAttribute');
        const ATTR_NAME: string = 'style';
        const ATTR_VALUE: string = 'stroke:#ffffffff';

        service.updateAttributes(ATTR_NAME, ATTR_VALUE);
        expect(spy).toHaveBeenCalledTimes(ELEM_NUM * 2); // 2 arrays
        expect(spy).toHaveBeenCalledWith(svgElemStub, ATTR_NAME, ATTR_VALUE);
    });

    it('should be able to remove the grid', () => {
        service.grid.innerHTML = svgElemStub.innerHTML;
        service.removeGrid();
        expect(service.grid.innerHTML).toEqual('');
    });

    it('should be able to render the grid based on the lines in the array', () => {
        const ELEM_NUM: number = 15;

        service.grid = svgElemStub;

        for (let i = 0; i < ELEM_NUM; ++i) {
            service['hGridLines'].push(svgElemStub);
            service['vGridLines'].push(svgElemStub);
        }

        const spy = spyOn(service.render, 'appendChild');
        service.renderBack();
        expect(spy).toHaveBeenCalledTimes(2 * ELEM_NUM);
        expect(spy).toHaveBeenCalledWith(service.grid, svgElemStub);
    });
});
