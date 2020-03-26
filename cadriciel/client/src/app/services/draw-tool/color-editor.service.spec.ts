import { Renderer2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ColorEditorService } from './color-editor.service';
import { Point } from './point';
//import { ColorConvertingService } from '../colorPicker/color-converting.service';

describe('ColorEditorService', () => {
    //let fakeColorConvertingService: ColorConvertingService;
    let service : ColorEditorService
    // tslint:disable-next-line: no-any
    let rdStub: any;
    // tslint:disable-next-line: no-any
    let htmlElementStub: any;
    beforeEach(() => {
        htmlElementStub = {
            style: {
                pointerEvents: 'none',
            },
            innerHTML: '',
            getBoundingClientRect: () => 0,
        };
        rdStub = {
            createElement: () => document.createElement('g'),
            setAttribute: () => 0,
            appendChild: () => 0,
            insertBefore: () => 0,
            removeChild: () => 0,
        };
        TestBed.configureTestingModule({
            providers: [
                { provide: HTMLElement, useValue: htmlElementStub },
                { provide: Boolean, useValue: false },
                { provide: Number, useValue: 0 },
                { provide: String, useValue: '' },
                { provide: Renderer2, useValue: rdStub },
            ],
        });
        service = TestBed.get(ColorEditorService);
    });

    it('should be created', () => {
        const SERVICE: ColorEditorService = TestBed.get(ColorEditorService);
        expect(SERVICE).toBeTruthy();
    });

    it('should set the attributes in the subscription', () => {
        service.interaction.emitToolsAttributes({ lineThickness: 0, texture: 0 }); // mocking attributes
        const SPY_INTERACTION = spyOn(service.interaction.$toolsAttributes, 'subscribe');
        service.updateAttributes();
        expect(SPY_INTERACTION).toHaveBeenCalled();
        expect(service.attr).toBeDefined();
    });

    it('should emit the colors when updating the attributes', () => {
        const SPY = spyOn(service.colorPick, 'emitColors');
        service.updateAttributes();
        expect(SPY).toHaveBeenCalled();
    });
    
    it('should add the same point twice to currentPath', () => {
        const SPY = spyOn(service.currentPath, 'push');
        service.checkIfTouching = jasmine.createSpy();
        service.down(new Point(2, 1), true, true);
        expect(SPY).toHaveBeenCalledTimes(2);
    });
    it('should call updateProgress on mouse down', () => {
        const SPY = spyOn(service, 'updateProgress');
        service.checkIfTouching = jasmine.createSpy();
        service.down(new Point(2, 1),true,true);
        expect(SPY).toHaveBeenCalled();
    });

    it('should call checkIfTouching on mouse down', () => {
        const SPY = spyOn(service, 'checkIfTouching');
        service.down(new Point(2, 1),true,true);
        expect(SPY).toHaveBeenCalled();
    });

    it('should emit drawing done when change color once from the drawing and the click is valid', () => {
        const SPY = spyOn(service.interaction, 'emitDrawingDone');
        service.changedColorOnce = true;
        service.ignoreNextUp = false;
        service.up(new Point(2, 1), true);
        expect(SPY).toHaveBeenCalled();
    });
    it('should not emit drawing done when change color once from the drawing and the click is invalid', () => {
        const SPY = spyOn(service.interaction, 'emitDrawingDone');
        service.changedColorOnce = true;
        service.ignoreNextUp = true;
        service.up(new Point(2, 1), true);
        expect(SPY).not.toHaveBeenCalled();
    });

    it('should not emit drawing done when something there is no color to be changed and the click is valid', () => {
        const SPY = spyOn(service.interaction, 'emitDrawingDone');
        service.changedColorOnce = false;
        service.ignoreNextUp = true;
        service.up(new Point(2, 1), true);
        expect(SPY).not.toHaveBeenCalled();
    });

    it('should change color border when right click', () => {
        const dummyElement: Element = document.createElement('g');
        const childDummyElement: Element = document.createElement('g');
        dummyElement.appendChild(childDummyElement);
        const SPY = spyOn(service, 'changeBorder');
        service.isRightClick = true;
        service.selected = true;
        service.changeColor(dummyElement);
        expect(SPY).toHaveBeenCalled();
    });

    it('should change color fill when left click', () => {
        const dummyElement: Element = document.createElement('g');
        const childDummyElement: Element = document.createElement('g');
        dummyElement.appendChild(childDummyElement);
        const SPY = spyOn(service, 'changeFill');
        service.isRightClick = false;
        service.selected = true;
        service.changeColor(dummyElement);
        expect(SPY).toHaveBeenCalled();
    });

});
