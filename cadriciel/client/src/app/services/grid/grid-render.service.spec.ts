import { TestBed } from '@angular/core/testing';

import { GridRenderService } from './grid-render.service';

describe('GridRenderService', () => {
    let service: GridRenderService;
    const FULL_HEX = 255;
    // tslint:disable-next-line: no-any
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
        const TEST_SERVICE: GridRenderService = TestBed.get(GridRenderService);
        expect(TEST_SERVICE).toBeTruthy();
    });

    it('should render a verical line with its attributes', () => {
        const ATTR_NUM = 3;
        service.render.createElement = jasmine.createSpy().and.returnValue(svgElemStub);
        const SET_ATTR_SPY = spyOn(service.render, 'setAttribute');
        const LINE = service.renderVerticalLine();
        expect(SET_ATTR_SPY).toHaveBeenCalledTimes(ATTR_NUM);
        expect(service.render.createElement).toHaveBeenCalled();
        expect(LINE).toBeDefined();
    });

    it('should render a horizontal line with its attributes', () => {
        const ATTR_NUM = 3;
        service.render.createElement = jasmine.createSpy().and.returnValue(svgElemStub);
        const SET_ATTR_SPY = spyOn(service.render, 'setAttribute');
        const LINE = service.renderHorizontalLine();
        expect(SET_ATTR_SPY).toHaveBeenCalledTimes(ATTR_NUM);
        expect(service.render.createElement).toHaveBeenCalled();
        expect(LINE).toBeDefined();
    });

    it('should render the proper number of horizontal lines from draw height and step', () => {
        const STEP = 5;
        const HEIGHT = 200; // 1 line every 5px for 200px
        service.drawHeight = HEIGHT;
        const RENDER_SPY = spyOn(service, 'renderHorizontalLine');
        const SET_ATTR_SPY = spyOn(service.render, 'setAttribute');
        service.renderHorizontalLines(STEP);
        expect(RENDER_SPY).toHaveBeenCalledTimes(HEIGHT / STEP);

        const ATTR_NUM = 2; // setting y1 and y2
        expect(SET_ATTR_SPY).toHaveBeenCalledTimes(ATTR_NUM * (HEIGHT / STEP));
    });

    it('should populate the horizontal grid lines array', () => {
        const STEP = 5;
        const HEIGHT = 200;
        service.drawHeight = HEIGHT;

        // tslint:disable-next-line: no-string-literal
        const SPY = spyOn(service['hGridLines'], 'push');
        service.renderHorizontalLines(STEP);

        expect(SPY).toHaveBeenCalledTimes(HEIGHT / STEP);
    });

    it('should render the proper number of vertical lines from draw width and step', () => {
        const STEP = 10;
        const WIDTH = 400; // 1 line every 5px for 200px
        service.drawWidth = WIDTH;
        const RENDER_SPY = spyOn(service, 'renderVerticalLine');
        const SET_ATTR_SPY = spyOn(service.render, 'setAttribute');
        service.renderVerticalLines(STEP);
        expect(RENDER_SPY).toHaveBeenCalledTimes(WIDTH / STEP);

        const ATTR_NUM = 2; // setting x1 and yx
        expect(SET_ATTR_SPY).toHaveBeenCalledTimes(ATTR_NUM * (WIDTH / STEP));
    });

    it('should populate the vertical grid lines array', () => {
        const STEP = 10;
        const WIDTH = 400;
        service.drawWidth = WIDTH;
        // tslint:disable-next-line: no-string-literal
        const SPY = spyOn(service['vGridLines'], 'push');
        service.renderVerticalLines(STEP);

        expect(SPY).toHaveBeenCalledTimes(WIDTH / STEP);
    });

    it('should render horizontal lines on init with default steps', () => {
        service.render.appendChild = jasmine.createSpy().and.returnValue(0);
        const HEIGHT = 200;
        const WIDTH = 400;
        const COLOR = '#ffffff';
        const SPY = spyOn(service, 'renderHorizontalLines');
        service.initGrid(svgElemStub, WIDTH, HEIGHT, COLOR);
        expect(SPY).toHaveBeenCalled();
    });

    it('should render vertical lines on init with default steps', () => {
        service.render.appendChild = jasmine.createSpy().and.returnValue(0);
        const HEIGHT = 200;
        const WIDTH = 400;
        const COLOR = '#ffffff';
        const SPY = spyOn(service, 'renderVerticalLines');
        service.initGrid(svgElemStub, WIDTH, HEIGHT, COLOR);
        expect(SPY).toHaveBeenCalled();
    });

    it('should append all the lines to the grid svg element', () => {
        const HEIGHT = 200;
        const WIDTH = 400;
        const COLOR = '#ffffff';
        const SPY = spyOn(service.render, 'appendChild');
        service.initGrid(svgElemStub, WIDTH, HEIGHT, COLOR);

        const H_LINE_CALLS: number = HEIGHT / service.defSteps;
        const V_LINE_CALLS: number = WIDTH / service.defSteps;
        expect(SPY).toHaveBeenCalledTimes(H_LINE_CALLS + V_LINE_CALLS);
    });

    it('should call color update function on grid init', () => {
        service.render.appendChild = jasmine.createSpy().and.returnValue(0);
        const HEIGHT = 200;
        const WIDTH = 400;
        const COLOR = '#ffffff';
        const SPY = spyOn(service, 'updateColor');
        service.initGrid(svgElemStub, WIDTH, HEIGHT, COLOR);
        expect(SPY).toHaveBeenCalledWith(COLOR);
    });

    it('should set the new position attibutes on spacing update and update innerHTML', () => {
        const ELEM_NUM = 15;
        const SPACE = 30;
        const ATTR_SET_CALLS = 4;
        service.grid = svgElemStub;

        for (let i = 0; i < ELEM_NUM; ++i) {
            // tslint:disable-next-line: no-string-literal
            service['hGridLines'].push(svgElemStub);
            // tslint:disable-next-line: no-string-literal
            service['vGridLines'].push(svgElemStub);
        }
        const SPY = spyOn(service.render, 'setAttribute');
        service.updateSpacing(SPACE);
        expect(SPY).toHaveBeenCalledTimes(ELEM_NUM * ATTR_SET_CALLS);
    });

    it('should update line transparency with alpha hex input', () => {
        const ALPHA_PERCENT = 70;

        // tslint:disable-next-line: no-string-literal
        const COLOR_SPY = spyOn(service['colConv'], 'alphaRGBToHex');
        service.updateTransparency(ALPHA_PERCENT);
        expect(COLOR_SPY).toHaveBeenCalled();
    });

    it('should update the attributes after transparency change', () => {
        const ALPHA_PERCENT = 70;

        const SPY = spyOn(service, 'updateAttributes');
        service.updateTransparency(ALPHA_PERCENT);
        expect(SPY).toHaveBeenCalled();
    });

    it('should convert hex bg color to rgba on color update', () => {
        const BG_COLOR = '#ffffffff';
        // tslint:disable-next-line: no-string-literal
        service['colConv'].hexToRgba = jasmine.createSpy().and.returnValue([FULL_HEX, FULL_HEX, FULL_HEX, FULL_HEX]);
        service.updateColor(BG_COLOR);
        // tslint:disable-next-line: no-string-literal
        expect(service['colConv'].hexToRgba).toHaveBeenCalledWith(BG_COLOR);
    });

    it('should turn change the grid color to white if the background is too dark', () => {
        const DARK_VAL = 127;
        const BG_RBGA: number[] = [DARK_VAL, DARK_VAL, DARK_VAL, FULL_HEX];
        const FAKE_BG_COLOR = '#88888888'; // only to serve as a valid attribute to our function
        // tslint:disable-next-line: no-string-literal
        service['colConv'].hexToRgba = jasmine.createSpy().and.returnValue(BG_RBGA);
        const GRID_ALPHA = 'ff';
        service.gridAlpha = GRID_ALPHA;
        const WHITE = '#ffffff';
        const SPY = spyOn(service, 'updateAttributes');
        service.updateColor(FAKE_BG_COLOR);
        expect(service.gridColor).toEqual(WHITE);
        expect(SPY).toHaveBeenCalledWith('style', `stroke:${WHITE + service.gridAlpha}`);
    });

    it('should turn change the grid color to black if the background is too pale', () => {
        const PALE_VAL = 129;
        const BG_RBGA: number[] = [PALE_VAL, PALE_VAL, FULL_HEX, FULL_HEX];
        const FAKE_BG_COLOR = '#88888888'; // only to serve as a valid attribute to our function
        // tslint:disable-next-line: no-string-literal
        service['colConv'].hexToRgba = jasmine.createSpy().and.returnValue(BG_RBGA);

        const GRID_ALPHA = 'ff';
        service.gridAlpha = GRID_ALPHA;

        const WHITE = '#ffffff';
        service.gridColor = WHITE;

        const BLACK = '#000000';

        const SPY = spyOn(service, 'updateAttributes');

        service.updateColor(FAKE_BG_COLOR);

        expect(service.gridColor).toEqual(BLACK);
        expect(SPY).toHaveBeenCalledWith('style', `stroke:${BLACK + service.gridAlpha}`);
    });

    it('should emit a signal with grid visibility boolean on toggle', () => {
        // tslint:disable-next-line: no-string-literal
        const SPY = spyOn(service['itService'], 'emitGridVisibility');
        const SHOW = true;
        service.toggleGridVisibility(SHOW);
        expect(SPY).toHaveBeenCalledWith(SHOW);
    });

    it('should be able to update the attributes on the line arrays', () => {
        const ELEM_NUM = 15;

        service.grid = svgElemStub;

        for (let i = 0; i < ELEM_NUM; ++i) {
            // tslint:disable-next-line: no-string-literal
            service['hGridLines'].push(svgElemStub);
            // tslint:disable-next-line: no-string-literal
            service['vGridLines'].push(svgElemStub);
        }

        const SPY = spyOn(service.render, 'setAttribute');
        const ATTR_NAME = 'style';
        const ATTR_VALUE = 'stroke:#ffffffff';

        service.updateAttributes(ATTR_NAME, ATTR_VALUE);
        expect(SPY).toHaveBeenCalledTimes(ELEM_NUM * 2); // 2 arrays
        expect(SPY).toHaveBeenCalledWith(svgElemStub, ATTR_NAME, ATTR_VALUE);
    });

    it('should be able to remove the grid', () => {
        service.grid.innerHTML = svgElemStub.innerHTML;
        service.removeGrid();
        expect(service.grid.innerHTML).toEqual('');
    });

    it('should be able to render the grid based on the lines in the array', () => {
        const ELEM_NUM = 15;

        service.grid = svgElemStub;

        for (let i = 0; i < ELEM_NUM; ++i) {
            // tslint:disable-next-line: no-string-literal
            service['hGridLines'].push(svgElemStub);
            // tslint:disable-next-line: no-string-literal
            service['vGridLines'].push(svgElemStub);
        }

        const SPY = spyOn(service.render, 'appendChild');
        service.renderBack();
        expect(SPY).toHaveBeenCalledTimes(2 * ELEM_NUM);
        expect(SPY).toHaveBeenCalledWith(service.grid, svgElemStub);
    });
});
