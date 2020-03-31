import { TestBed } from '@angular/core/testing';

import { ElementRef } from '@angular/core';
import { SvgDrawComponent } from 'src/app/components/draw-view/svg-draw/svg-draw.component';
import { Canvas } from '../../models/canvas.model';

import { CanvasBuilderService } from './canvas-builder.service';

describe('CanvasBuilderService', () => {
    let service: CanvasBuilderService;
    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [],
        }).compileComponents();
        service = TestBed.get(CanvasBuilderService);
    });

    it('should be created', () => {
        const TEST_SERVICE: CanvasBuilderService = TestBed.get(CanvasBuilderService);
        expect(TEST_SERVICE).toBeTruthy();
    });

    it('should create a canvas from form data', () => {
        // validators in NewDrawComponent filtering bad inputs
        const DIMENSIONS = 50;
        const CANVAS: Canvas = { canvasWidth: DIMENSIONS, canvasHeight: DIMENSIONS, canvasColor: '#ffffff' };

        service.setCanvasFromForm(DIMENSIONS, DIMENSIONS, 'ffffff');
        expect(service.newCanvas).toEqual(CANVAS);
    });

    it('should get default sizes near from full screen size', () => {
        const DEFW = service.getDefWidth();
        const DEFH = service.getDefHeight();
        const APPROX_DIFF = -300;
        expect(DEFW).toBeCloseTo(window.innerWidth, APPROX_DIFF); // approximation
        expect(DEFH).toBeCloseTo(window.innerHeight, APPROX_DIFF); // top bar and side nav space
    });

    it('should whipe an existing doodle', () => {
        const ELEM: ElementRef = new ElementRef(SvgDrawComponent);
        const DRAW = '<rect />';
        ELEM.nativeElement.innerHTML = DRAW;

        service.wipeDraw(ELEM);
        expect(ELEM.nativeElement.innerHTML).not.toContain(DRAW);
    });

    it('should get a valid default color', () => {
        const COL = service.getDefColor();
        expect(COL).toMatch(/^[a-fA-F0-9]{6}$/);
    });

    it('should get a white default color', () => {
        const WHITE = 'ffffff';
        expect(service.getDefColor()).toEqual(WHITE);
    });

    it('should emit the new canvas', () => {
        const SPY = spyOn(service.canvSubject, 'next');
        service.emitCanvas();
        expect(SPY).toHaveBeenCalled();
        expect(SPY).toHaveBeenCalledWith(service.newCanvas);
    });

    it('should return a default canvas with default attributes', () => {
        const DEF_W = 200;
        const DEF_H = 100;
        const DEF_COLOR = '#ffffffff';
        service.getDefWidth = jasmine.createSpy().and.returnValue(DEF_W);
        service.getDefHeight = jasmine.createSpy().and.returnValue(DEF_H);
        service.getDefColor = jasmine.createSpy().and.returnValue(DEF_COLOR);

        const DEF_CANVAS = service.getDefCanvas();
        expect(service.getDefWidth).toHaveBeenCalled();
        expect(service.getDefHeight).toHaveBeenCalled();
        expect(service.getDefColor).toHaveBeenCalled();
        expect(DEF_CANVAS.canvasWidth).toEqual(DEF_W);
        expect(DEF_CANVAS.canvasHeight).toEqual(DEF_H);
        expect(DEF_CANVAS.canvasColor).toEqual(DEF_COLOR);
    });
});
