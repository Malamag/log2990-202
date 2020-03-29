import { Renderer2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ColorConvertingService } from '../colorPicker/color-converting.service';
import { ColorPickingService } from '../colorPicker/color-picking.service';
import { InteractionService } from '../service-interaction/interaction.service';
import { ElementInfo } from './element-info.service';
import { EraserService } from './eraser.service';
import { Point } from './point';

describe('EraserService', () => {

    // let fakeInteractionService: InteractionService;
    // let fakeColorPickingService: ColorPickingService;
    // tslint:disable-next-line: prefer-const
    let fakeColorConvertingService: ColorConvertingService;
    let service: EraserService;
    // tslint:disable-next-line: no-any
    let rdStub: any;
    // tslint:disable-next-line: no-any
    let htmlElementStub: any;
    // tslint:disable-next-line: no-any
    let firstChild: any;
    // tslint:disable-next-line: no-any
    let fakeChild: any;
    beforeEach(() => {
        fakeChild = {
            getTotalLength : () => 1,
            getPointAtLength: (v: number) => new Point(1, 1),
            isPointInStroke: (p: Point) => false,
            isPointInFill: (p: Point) => false,
            getAttribute: (s: string) => 'none',
        };
        firstChild = {
            firstElementChild: firstChild,
            getTotalLength : () => 1,
            getPointAtLength: (v: number) => new Point(1, 1),
            isPointInStroke: (p: Point) => true,
            isPointInFill: (p: Point) => true,
        };
        htmlElementStub = {
            style: {
                pointerEvents: 'none',
            },
            innerHTML: '',
            getBoundingClientRect: () => 0,
            firstElementChild: firstChild,
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
    it('should add an event listener for event of type toolChange on the eraser', () => {
        const colorPick: ColorPickingService = new ColorPickingService(fakeColorConvertingService);
        const interaction: InteractionService = new InteractionService();
        window.addEventListener = jasmine.createSpy();
        const test: EraserService = new EraserService(
            htmlElementStub,
            htmlElementStub,
            true,
            interaction,
            colorPick,
            rdStub,
            htmlElementStub,
            htmlElementStub);
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
        service.up(new Point(2, 1), false);
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
        const dummyElement: Element = document.createElement('g');
        service.render.removeChild = jasmine.createSpy('removeChild', service.render.removeChild);
        service.selected = true;
        service.erase(dummyElement);
        expect(service.render.removeChild).toHaveBeenCalled();
    });

    it('should unhighlight an element', () => {
        const dummyElement: Element = document.createElement('g');
        const childDummyElement: Element = document.createElement('g');
        childDummyElement.className = 'clone';
        dummyElement.appendChild(childDummyElement);
        const SPY = spyOn(service.render, 'removeChild');
        service.unhighlight(dummyElement);
        expect(SPY).toHaveBeenCalled();
    });

    it('should append a clone element of the highlighted element', () => {
        service.selected = true;
        const dummyElement: Element = document.createElement('g');
        const childDummyElement: Element = document.createElement('g');
        dummyElement.appendChild(childDummyElement);
        const SPY = spyOn(service.render, 'insertBefore');
        service.highlight(dummyElement);
        expect(SPY).toHaveBeenCalled();

    });

    it('should not append a clone element of the highlighted element', () => {
        service.selected = false;
        const dummyElement: Element = document.createElement('g');
        const childDummyElement: Element = document.createElement('g');
        dummyElement.appendChild(childDummyElement);
        const SPY = spyOn(service.render, 'insertBefore');
        service.highlight(dummyElement);
        expect(SPY).not.toHaveBeenCalled();

    });

    it('should set the attribute (stroke color, stroke width and class) of the clone to highlight', () => {
        service.selected = true;
        const NB_CALLS = 3;
        const dummyElement: Element = document.createElement('g');
        const childDummyElement: Element = document.createElement('g');
        dummyElement.appendChild(childDummyElement);
        const SPY = spyOn(service.render, 'setAttribute');
        service.highlight(dummyElement);
        expect(SPY).toHaveBeenCalledTimes(NB_CALLS);
    });

    it('should get the attribute (stroke color, stroke width and class) of the original item to highlight', () => {
        service.selected = true;
        const NB_CALLS = 3;
        const dummyElement: Element = document.createElement('g');
        const childDummyElement: Element = document.createElement('g');
        dummyElement.appendChild(childDummyElement);
        const SPY = spyOn(childDummyElement, 'getAttribute');
        service.highlight(dummyElement);
        expect(SPY).toHaveBeenCalledTimes(NB_CALLS);
    });

    it('should check if the first child element contains a class name clone', () => {
        service.selected = true;
        const dummyElement: Element = document.createElement('g');
        const childDummyElement: Element = document.createElement('g');
        dummyElement.appendChild(childDummyElement);
        const SPY = spyOn(childDummyElement.classList, 'contains');
        service.highlight(dummyElement);
        expect(SPY).toHaveBeenCalled();
    });

    it('should check if the first child element contains a class name clone', () => {
        service.selected = true;
        const dummyElement: Element = document.createElement('g');
        const childDummyElement: Element = document.createElement('g');
        dummyElement.appendChild(childDummyElement);
        const SPY = spyOn(childDummyElement.classList, 'contains');
        service.unhighlight(dummyElement);
        expect(SPY).toHaveBeenCalled();
    });

    it('should add a point to the current path on mouse move', () => {
        const SPY = spyOn(service.currentPath, 'push');
        service.checkIfTouching = jasmine.createSpy();
        service.down(new Point(2, 1));
        expect(SPY).toHaveBeenCalled();
    });

    it('should remove the first element of the current path and return it while the length of the current path is above 3', () => {
        const SPY = spyOn(service.currentPath, 'shift');
        service.checkIfTouching = jasmine.createSpy();
        const Y = 3;
        service.currentPath = [new Point(1, 0), new Point(1, 2)];
        service.move(new Point(2, Y));
        expect(SPY).toHaveBeenCalled();
    });

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
        service.currentPath.push(new Point(2, 1));
        const SPY = spyOn(service.canvas, 'getBoundingClientRect');
        service.checkIfTouching();
        expect(SPY).toHaveBeenCalled();
    });

    it('should erase the first child if touching and on mouse down', () => {
        service.isDown = true;
        const dummyElement: Element = document.createElement('g');
        const childDummyElement: Element = document.createElement('g');
        const grandChildDummyElement: Element = document.createElement('g');
        childDummyElement.appendChild(grandChildDummyElement);
        dummyElement.appendChild(childDummyElement);
        service.drawing = dummyElement as HTMLElement;

        spyOn(htmlElementStub, 'firstElementChild');

        service.currentPath.push(new Point(2, 1));
        const SPY = spyOn(service, 'erase');
        spyOn(ElementInfo, 'translate').and.returnValue(new Point(0, 0));
        spyOn(Point, 'rectOverlap').and.returnValue(true);
        spyOn(service, 'checkIfPathIntersection').and.returnValue(true);
        service.checkIfTouching();
        expect(SPY).toHaveBeenCalled();
    });
    it('should unhighlight the first child if touching and on mouse down', () => {
        service.isDown = true;
        const dummyElement: Element = document.createElement('g');
        const childDummyElement: Element = document.createElement('g');
        const grandChildDummyElement: Element = document.createElement('g');
        childDummyElement.appendChild(grandChildDummyElement);
        dummyElement.appendChild(childDummyElement);
        service.drawing = dummyElement as HTMLElement;

        spyOn(htmlElementStub, 'firstElementChild');

        service.currentPath.push(new Point(2, 1));
        const SPY = spyOn(service, 'unhighlight');
        spyOn(ElementInfo, 'translate').and.returnValue(new Point(0, 0));
        spyOn(Point, 'rectOverlap').and.returnValue(false);
        spyOn(service, 'checkIfPathIntersection').and.returnValue(true);
        service.checkIfTouching();
        expect(SPY).toHaveBeenCalled();
    });
    it('should erase the first child if touching and on mouse up', () => {
        service.isDown = false;
        const dummyElement: Element = document.createElement('g');
        const childDummyElement: Element = document.createElement('g');
        const grandChildDummyElement: Element = document.createElement('g');
        const secondChildDummyElement: Element = document.createElement('g');
        childDummyElement.appendChild(grandChildDummyElement);
        dummyElement.appendChild(childDummyElement);
        dummyElement.appendChild(secondChildDummyElement);
        service.drawing = dummyElement as HTMLElement;

        spyOn(htmlElementStub, 'firstElementChild');

        service.currentPath.push(new Point(2, 1));
        const UNHEIGHLIGHT_SPY = spyOn(service, 'unhighlight');
        const SPY = spyOn(service, 'highlight');
        spyOn(ElementInfo, 'translate').and.returnValue(new Point(0, 0));
        spyOn(Point, 'rectOverlap').and.returnValue(true);
        spyOn(service, 'checkIfPathIntersection').and.returnValue(true);
        service.checkIfTouching();
        expect(SPY).toHaveBeenCalled();
        expect(UNHEIGHLIGHT_SPY).toHaveBeenCalled();
    });
    it('should unhighlight if not touching', () => {
        service.isDown = true;
        const dummyElement: Element = document.createElement('g');
        const childDummyElement: Element = document.createElement('g');
        const grandChildDummyElement: Element = document.createElement('g');
        childDummyElement.appendChild(grandChildDummyElement);
        dummyElement.appendChild(childDummyElement);
        service.drawing = dummyElement as HTMLElement;

        spyOn(htmlElementStub, 'firstElementChild');

        service.currentPath.push(new Point(2, 1));
        const SPY = spyOn(service, 'unhighlight');
        spyOn(ElementInfo, 'translate').and.returnValue(new Point(0, 0));
        spyOn(Point, 'rectOverlap').and.returnValue(true);
        spyOn(service, 'checkIfPathIntersection').and.returnValue(false);
        service.checkIfTouching();
        expect(SPY).toHaveBeenCalled();
    });
    it('should return in intersection', () => {
        let TOUCHING = false;
        TOUCHING = service.checkIfPathIntersection(firstChild, firstChild, 1, new Point(0, 0), TOUCHING);
        expect(TOUCHING).toBeTruthy();
    });
    it('should not return in intersection', () => {
        let TOUCHING = false;
        TOUCHING = service.checkIfPathIntersection(firstChild, fakeChild, 1, new Point(0, 0), TOUCHING);
        expect(TOUCHING).toBeFalsy();
    });
    it('should return an empty string', () => {
        const POINTS_CONTAINER = [new Point(0, 0)];
        const RET = service.createPath(POINTS_CONTAINER);
        expect(RET).toEqual('');
    });
    it('should contain a g tag', () => {
        const POINTS_CONTAINER = [new Point(0, 0), new Point(1, 1)];
        const EXPECTED_CONTAIN = '<g';
        const RET = service.createPath(POINTS_CONTAINER);
        expect(RET).toContain(EXPECTED_CONTAIN);
    });
    it('should empty the cyrrent path container', () => {
        service.currentPath = [new Point(1, 1)];
        service.goingOutsideCanvas();
        expect(service.currentPath).toEqual([]);
    });
// tslint:disable-next-line: max-file-line-count
});
