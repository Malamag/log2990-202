import { Renderer2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { EraserService } from './eraser.service';
import { InteractionService } from '../service-interaction/interaction.service';
import { ColorPickingService } from '../colorPicker/color-picking.service';
import { ColorConvertingService } from '../colorPicker/color-converting.service';
import { Point } from './point';

describe('EraserService', () => {

    //let fakeInteractionService: InteractionService;
    //let fakeColorPickingService: ColorPickingService;
    let fakeColorConvertingService: ColorConvertingService
    let service: EraserService;
    // tslint:disable-next-line: no-any
    let rdStub: any;
    // tslint:disable-next-line: no-any
    let htmlElementStub: any;

    beforeEach(() => {
        htmlElementStub = {
            style: {
                pointerEvents: 'none',
            },
            innerHTML: "",
            getBoundingClientRect: () =>0,
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
        service = TestBed.get(EraserService);
    });

    it('should be created', () => {
        const SERVICE: EraserService = TestBed.get(EraserService);
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
    -
        it('should add an event listener for event of type toolChange on the eraser', () => {
            let colorPick: ColorPickingService = new ColorPickingService(fakeColorConvertingService);
            let interaction: InteractionService = new InteractionService();
            window.addEventListener = jasmine.createSpy();
            let test: EraserService = new EraserService(htmlElementStub, htmlElementStub, true, interaction, colorPick, rdStub, htmlElementStub, htmlElementStub);
            expect(test).toBeDefined();
            expect(window.addEventListener).toHaveBeenCalled();
        });

    it('should add the same point twice to currentPath', () => {
        const SPY = spyOn(service.currentPath, 'push');
        service.checkIfTouching = jasmine.createSpy();
        service.down(new Point(2, 1));
        expect(SPY).toHaveBeenCalledTimes(2);
    });

    it('should call updateProgress on mouse down', () => {
        const SPY = spyOn(service, 'updateProgress');
        service.checkIfTouching = jasmine.createSpy();
        service.down(new Point(2, 1));
        expect(SPY).toHaveBeenCalled();
    });

    it('should call checkIfTouching on mouse down', () => {
        const SPY = spyOn(service, 'checkIfTouching');
        service.down(new Point(2, 1));
        expect(SPY).toHaveBeenCalled();
    });

    it('should emit drawing done when something is erased from the drawing and the click is valid', () => {
        const SPY = spyOn(service.interaction, 'emitDrawingDone');
        service.erasedSomething = true;
        service.ignoreNextUp = false;
        service.up(new Point(2, 1), true);
        expect(SPY).toHaveBeenCalled();
    });

    it('should not emit drawing done when something is erased from the drawing and the click is invalid', () => {
        const SPY = spyOn(service.interaction, 'emitDrawingDone');
        service.erasedSomething = true;
        service.ignoreNextUp = true;
        service.up(new Point(2, 1), true);
        expect(SPY).not.toHaveBeenCalled();
    });

    it('should not emit drawing done when something there is nothing to be erase and the click is valid', () => {
        const SPY = spyOn(service.interaction, 'emitDrawingDone');
        service.erasedSomething = false;
        service.ignoreNextUp = true;
        service.up(new Point(2, 1), true);
        expect(SPY).not.toHaveBeenCalled();
    });

    it('should erase an element', () => {
        let dummyElement: Element = document.createElement('g');
        service.render.removeChild = jasmine.createSpy('removeChild', service.render.removeChild);
        service.selected = true;
        service.erase(dummyElement);
        expect(service.render.removeChild).toHaveBeenCalled();
    });

    it('should unhighlight an element', () => {
        let dummyElement: Element = document.createElement('g');
        let childDummyElement: Element = document.createElement('g');
        childDummyElement.className = "clone";
        dummyElement.appendChild(childDummyElement);
        const SPY = spyOn(service.render, 'removeChild');
        service.unhighlight(dummyElement);
        expect(SPY).toHaveBeenCalled();
    });

    it('should append a clone element of the highlighted element', () => {
        service.selected = true;
        let dummyElement: Element = document.createElement('g');
        let childDummyElement: Element = document.createElement('g');
        dummyElement.appendChild(childDummyElement);
        const SPY = spyOn(service.render,'insertBefore');
        service.highlight(dummyElement);
        expect(SPY).toHaveBeenCalled();

    });

    it('should not append a clone element of the highlighted element', () => {
        service.selected = false;
        let dummyElement: Element = document.createElement('g');
        let childDummyElement: Element = document.createElement('g');
        dummyElement.appendChild(childDummyElement);
        const SPY = spyOn(service.render,'insertBefore');
        service.highlight(dummyElement);
        expect(SPY).not.toHaveBeenCalled();

    });

    it('should set the attribute (stroke color, stroke width and class) of the clone to highlight', () => {
        service.selected = true;
        let dummyElement: Element = document.createElement('g');
        let childDummyElement: Element = document.createElement('g');
        dummyElement.appendChild(childDummyElement);
        const SPY = spyOn(service.render,'setAttribute');
        service.highlight(dummyElement);
        expect(SPY).toHaveBeenCalledTimes(3);
    });
    

    it('should get the attribute (stroke color, stroke width and class) of the original item to highlight', () => {
        service.selected = true;
        let dummyElement: Element = document.createElement('g');
        let childDummyElement: Element = document.createElement('g');
        dummyElement.appendChild(childDummyElement);
        const SPY = spyOn(childDummyElement,'getAttribute');
        service.highlight(dummyElement);
        expect(SPY).toHaveBeenCalledTimes(3);
    });

    it('should check if the first child element contains a class name clone', () => {
        service.selected = true;
        let dummyElement: Element = document.createElement('g');
        let childDummyElement: Element = document.createElement('g');
        dummyElement.appendChild(childDummyElement);
        const SPY = spyOn(childDummyElement.classList,'contains');
        service.highlight(dummyElement);
        expect(SPY).toHaveBeenCalled();
    });

    it('should check if the first child element contains a class name clone', () => {
        service.selected = true;
        let dummyElement: Element = document.createElement('g');
        let childDummyElement: Element = document.createElement('g');
        dummyElement.appendChild(childDummyElement);
        const SPY = spyOn(childDummyElement.classList,'contains');
        service.unhighlight(dummyElement);
        expect(SPY).toHaveBeenCalled();
    });

    it('should add a point to the current path on mouse move', () => {
        const SPY = spyOn(service.currentPath, 'push');
        service.checkIfTouching = jasmine.createSpy();
        service.down(new Point(2, 1));
        expect(SPY).toHaveBeenCalled();
    });
    
    /* it('should remove the first element of the current path and return it while the length of the current path is above 3', () => {
        const SPY = spyOn(service.currentPath, 'shift');
        service.currentPath.push(new Point(3,2),new Point(3,4),new Point(3,2),new Point(3,4))
        //console.log(service.currentPath);
        service.move(new Point(2, 3));
        service.checkIfTouching = jasmine.createSpy();
        expect(SPY).toHaveBeenCalledTimes(2);
    });  */

    it('should call updateProgress on mouse move', () => {
        const SPY = spyOn(service, 'updateProgress');
        service.checkIfTouching = jasmine.createSpy();
        service.move(new Point(2, 1));
        expect(SPY).toHaveBeenCalled();
    });

    it('should call checkIfTouching on mouse move', () => {
        const SPY = spyOn(service, 'checkIfTouching');
        service.move(new Point(2, 1));
        expect(SPY).toHaveBeenCalled();
    });

    it('should get the canvas bounding client rect when checking if touching', () => {
        service.currentPath.push(new Point(2,1));
        const SPY = spyOn(service.canvas, 'getBoundingClientRect');
        service.checkIfTouching();
        expect(SPY).toHaveBeenCalled();
    });

    it('should erase the first child if touching and on mouse down', () => {
        service.drawing.childElementCount 
        service.currentPath.push(new Point(2,1));
        const SPY = spyOn(service, 'erase');
        service.checkIfTouching();
        expect(SPY).toHaveBeenCalled();
    });

    




});
