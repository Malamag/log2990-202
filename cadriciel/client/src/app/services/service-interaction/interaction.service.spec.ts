import { TestBed } from '@angular/core/testing';

import { ElementRef } from '@angular/core';
import { Observable } from 'rxjs';
import { AerosolAttributes } from '../attributes/aerosol-attribute';
import { FormsAttribute } from '../attributes/attribute-form';
import { LineAttributes } from '../attributes/line-attributes';
import { ToolsAttributes } from '../attributes/tools-attribute';
import { InteractionService } from './interaction.service';

describe('InteractionService', () => {
    let service: InteractionService;
    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.get(InteractionService);
    });

    it('should be created', () => {
        const testService: InteractionService = TestBed.get(InteractionService);
        expect(testService).toBeTruthy();
    });

    it('should emit the line attributes', () => {
        const spy = spyOn(service.lineAttributes, 'next');
        const ATTR: LineAttributes = {
            junction: false,
            lineThickness: 0,
            junctionDiameter: 0,
        }; // junction presence, thickness & junction diam.
        service.emitLineAttributes(ATTR);
        expect(spy).toHaveBeenCalled();
    });

    it('should emit the tool attributes', () => {
        const spy = spyOn(service.toolsAttributes, 'next');
        const ATTR: ToolsAttributes = { lineThickness: 0, texture: 0 }; // thickness & texture number
        service.emitToolsAttributes(ATTR);
        expect(spy).toHaveBeenCalled();
    });

    it('should emit the selected tool', () => {
        const spy = spyOn(service.selectedTool, 'next');
        const ATTR = ''; // tool name
        service.emitSelectedTool(ATTR);
        expect(spy).toHaveBeenCalled();
    });

    it('should emit the forms attributes', () => {
        const spy = spyOn(service.formsAttributes, 'next');
        const ATTR: FormsAttribute = { plotType: 0, lineThickness: 0, numberOfCorners: 0 }; // plot type, border thickness, num. of corners
        service.emitFormsAttributes(ATTR);
        expect(spy).toHaveBeenCalled();
    });

    it('should emit a kill signal for the tools', () => {
        const spy = spyOn(service.cancelTools, 'next');
        const willCancel = true;
        service.emitCancel(willCancel);
        expect(spy).toHaveBeenCalled();
    });

    it('should emit a DOM element reference', () => {
        const spy = spyOn(service.ref, 'next');
        const elRef = new ElementRef(null);
        service.emitRef(elRef);
        expect(spy).toHaveBeenCalled();
    });

    it('should emit a signal for a drawing completed', () => {
        const spy = spyOn(service.drawingDone, 'next');

        service.emitDrawingDone();
        expect(spy).toHaveBeenCalled();
    });

    it('should emit a boolean array for the elements to enable and disable', () => {
        const spy = spyOn(service.enableDisableButtons, 'next');
        const ENABLE_DISABLE = [true, false, false, true];
        service.emitEnableDisable(ENABLE_DISABLE);
        expect(spy).toHaveBeenCalled();
    });

    it('should emit when the canvas has been restarted', () => {
        const spy = spyOn(service.drawingContinued, 'next');
        service.emitContinueDrawing();
        expect(spy).toHaveBeenCalled();
    });

    it('should emit the grid visibility', () => {
        const spy = spyOn(service.showGrid, 'next');
        service.emitGridVisibility(true);
        expect(spy).toHaveBeenCalled();
    });

    it('should emit the canvas conversion boolean', () => {
        const spy = spyOn(service.convertSvg2Canvas, 'next');
        service.emitSvgCanvasConversion(true);
        expect(spy).toHaveBeenCalled();
    });

    it('should emit the preview color for the pipette tool', () => {
        const COLOR = '#f09fff';
        const spy = spyOn(service.previewColor, 'next');
        service.emitPreviewColor(COLOR);
        expect(spy).toHaveBeenCalled();
    });

    it('should emit the aerosol attributes', () => {
        const spy = spyOn(service.aerosolAttributes, 'next');
        const DIAM = 50;
        const EM_PER_SEC = 25;
        const ATTR = new AerosolAttributes(EM_PER_SEC, DIAM);
        service.emitAerosolAttributes(ATTR);
        expect(spy).toHaveBeenCalled();
    });

    it('selectedTool should have its own observable', () => {
        expect(service.$selectedTool).toEqual(jasmine.any(Observable));
    });

    it('formsAttributes should have its own observable', () => {
        expect(service.$formsAttributes).toEqual(jasmine.any(Observable));
    });

    it('toolsAttributes should have its own observable', () => {
        expect(service.$toolsAttributes).toEqual(jasmine.any(Observable));
    });

    it('lineAttributes should have its own observable', () => {
        expect(service.$lineAttributes).toEqual(jasmine.any(Observable));
    });

    it('cancelTools should have its own observable', () => {
        expect(service.$cancelToolsObs).toEqual(jasmine.any(Observable));
    });

    it('DOM element reference should have its own observable', () => {
        expect(service.$refObs).toEqual(jasmine.any(Observable));
    });
});
