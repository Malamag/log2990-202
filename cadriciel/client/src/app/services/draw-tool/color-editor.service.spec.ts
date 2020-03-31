import { Renderer2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ToolsAttributes } from '../attributes/tools-attribute';
import { KeyboardHandlerService } from '../keyboard-handler/keyboard-handler.service';
import { CanvasInteraction } from './canvas-interaction.service';
import { ColorEditorService } from './color-editor.service';
import { ElementInfo } from './element-info.service';
import { Point } from './point';
// import { ColorConvertingService } from '../colorPicker/color-converting.service';
const TEST_PT = new Point(1, 1);
describe('ColorEditorService', () => {
    // let fakeColorConvertingService: ColorConvertingService;
    let service: ColorEditorService;
    // tslint:disable-next-line: no-any
    let rdStub: any;
    // tslint:disable-next-line: no-any
    let htmlElementStub: any;
    // tslint:disable-next-line: no-any
    let elemStub: any;
    // tslint:disable-next-line: no-any
    let childElemStub: any;
    // tslint:disable-next-line: no-any
    let classlistStub: any;
    let ptA: Point;
    let ptB: Point;
    beforeEach(() => {
        classlistStub = {
            contains: (classStr: string) => false,
            tagName: 'filter'
        };
        childElemStub = {
            innerHTML: 'Hello World',
            tagName: 'filter',
            children: [{ classList: classlistStub, tagName: 'filter' }, { classList: classlistStub, tagName: 'rect' }],
            childElementCount: 2

        };
        elemStub = {
            getTotalLength: () => 2, // random value for test purpose
            isPointInStroke: () => true,
            isPointInFill: () => true,
            getAttribute: () => '',
            getPointAtLength: () => TEST_PT,
            children: [htmlElementStub, htmlElementStub],
            childElementCount: 2
        };
        htmlElementStub = {
            style: {
                pointerEvents: 'none',
            },
            innerHTML: '',
            getBoundingClientRect: () => 0,
            firstElementChild: {
                innerHTML: 'test',
                firstElementChild: {
                    innerHTML: 'test2'
                }
            },
            children: [childElemStub, childElemStub],
            childElementCount: 2,
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
                { provide: Element, useValue: elemStub },
                { provide: SVGGeometryElement, useValue: elemStub },
                { provide: HTMLElement, useValue: htmlElementStub },
                { provide: Boolean, useValue: false },
                { provide: Number, useValue: 0 },
                { provide: String, useValue: '' },
                { provide: Renderer2, useValue: rdStub },
                { provide: DOMPoint, useValue: TEST_PT }
            ],
        });
        service = TestBed.get(ColorEditorService);
        ptA = new Point(0, 0);
        ptB = new Point(1, 1);
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
        service.down(new Point(2, 1), true, true);
        expect(SPY).toHaveBeenCalled();
    });

    it('should call checkIfTouching on mouse down', () => {
        const SPY = spyOn(service, 'checkIfTouching');
        service.down(new Point(2, 1), true, true);
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

    it('should set the stroke attribute to the chosen secondary color if the color is different or there is no color', () => {
        const dummyElement: HTMLElement = document.createElement('g');
        service.chosenColor.secColor = 'red';
        dummyElement.setAttribute('stroke', 'blue');
        const SPY = spyOn(service.render, 'setAttribute');
        service.changeBorder(dummyElement);
        expect(SPY).toHaveBeenCalled();
    });

    it('should not set the stroke attribute to the chosen secondary color if the color is different or there is no color', () => {
        const dummyElement: HTMLElement = document.createElement('g');
        service.chosenColor.secColor = 'blue';
        dummyElement.setAttribute('stroke', 'blue');
        const SPY = spyOn(service.render, 'setAttribute');
        service.changeBorder(dummyElement);
        expect(SPY).not.toHaveBeenCalled();
    });

    it('should set the fill attribute to the chosen secondary color if the color is different or there is no color', () => {
        const dummyElement: HTMLElement = document.createElement('g');
        service.chosenColor.primColor = 'red';
        dummyElement.setAttribute('fill', 'blue');
        const SPY = spyOn(service.render, 'setAttribute');
        service.changeFill(dummyElement);
        expect(SPY).toHaveBeenCalled();
    });

    it('should not set the fill attribute to the chosen secondary color if the color is different or there is no color', () => {
        const dummyElement: HTMLElement = document.createElement('g');
        service.chosenColor.primColor = 'blue';
        dummyElement.setAttribute('fill', 'blue');
        const SPY = spyOn(service.render, 'setAttribute');
        service.changeFill(dummyElement);
        expect(SPY).not.toHaveBeenCalled();
    });

    it('should add a point to the current path on mouse move', () => {
        const SPY = spyOn(service.currentPath, 'push');
        service.checkIfTouching = jasmine.createSpy();
        service.move(new Point(2, 1));
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

    // replace name.
    it('should create a container named colorEditor-brush', () => {
        const ptArr: Point[] = [];
        // tslint:disable-next-line: no-magic-numbers
        ptArr.push(new Point(2, 3), new Point(2, 2));
        const PATH = service.createPath(ptArr);
        expect(PATH).toContain('name = "colorEditor-brush"');
    });

    it('should have a fill attribute', () => {
        const ptArr: Point[] = [];
        // tslint:disable-next-line: no-magic-numbers
        ptArr.push(new Point(2, 3), new Point(2, 2));
        service.chosenColor.primColor = 'blue';
        const PATH = service.createPath(ptArr);
        expect(PATH).toContain('fill="blue"');
    });

    it('should have a stroke width attribute of 3', () => {
        const ptArr: Point[] = [];
        // tslint:disable-next-line: no-magic-numbers
        ptArr.push(new Point(2, 3), new Point(2, 2));
        const PATH = service.createPath(ptArr);
        expect(PATH).toContain('stroke-width="3"');
    });

    it('should have a stroke attribute', () => {
        const ptArr: Point[] = [];
        // tslint:disable-next-line: no-magic-numbers
        ptArr.push(new Point(2, 3), new Point(2, 2));
        service.chosenColor.secColor = 'blue';
        const PATH = service.createPath(ptArr);
        expect(PATH).toContain('stroke="blue"');
    });

    it('should return true if the color editor is touching an element', () => {
        const TEST_TOUCH = service.checkIfPathIntersection(elemStub, elemStub, 2, new Point(1, 1), true);
        expect(TEST_TOUCH).toBe(true);
    });

    it('should call the changeColor method if the mouse is down and the click is touching an element', () => {
        service.isDown = true;
        service.inProgress = htmlElementStub;
        service.currentPath = [ptA, ptB, ptA];
        service.drawing = htmlElementStub;
        spyOn(CanvasInteraction, 'getPreciseBorder').and.returnValue([[2, true], [0, true], [1, true], [2, true]]);
        spyOn(service, 'checkIfPathIntersection').and.returnValue(true);
        spyOn(Point, 'rectOverlap').and.returnValue(true);
        spyOn(ElementInfo, 'translate').and.returnValue(new Point(0, 0));
        const SPY = spyOn(service, 'changeColor');
        service.checkIfTouching();
        expect(SPY).toHaveBeenCalled();
    });

    it('should not call the changeColor method if the mouse is up and the click is touching an element', () => {
        service.isDown = false;
        service.inProgress = htmlElementStub;
        service.currentPath = [ptA, ptB, ptA];
        service.drawing = htmlElementStub;
        spyOn(CanvasInteraction, 'getPreciseBorder').and.returnValue([[2, true], [0, true], [1, true], [2, true]]);
        spyOn(service, 'checkIfPathIntersection').and.returnValue(true);
        spyOn(Point, 'rectOverlap').and.returnValue(true);
        spyOn(ElementInfo, 'translate').and.returnValue(new Point(0, 0));
        const SPY = spyOn(service, 'changeColor');
        service.checkIfTouching();
        expect(SPY).not.toHaveBeenCalled();
    });
    it('should not change the color if not touching and mouse is down', () => {
        service.isDown = true;
        service.inProgress = htmlElementStub;
        service.currentPath = [ptA, ptB, ptA];
        service.drawing = htmlElementStub;
        htmlElementStub.getBoundingClientRect = () => 1;
        service.canvas = htmlElementStub;
        spyOn(CanvasInteraction, 'getPreciseBorder').and.returnValue([[2, true], [0, true], [1, true], [2, true]]);
        spyOn(service, 'checkIfPathIntersection').and.returnValue(false);
        spyOn(Point, 'rectOverlap').and.returnValue(true);
        spyOn(ElementInfo, 'translate').and.returnValue(new Point(0, 0));
        const SPY = spyOn(service, 'changeColor');
        service.checkIfTouching();
        expect(SPY).not.toHaveBeenCalled();
    });

    it('should empty the inProgress innerHTML and empty the array when going outside canvas', () => {
        service.currentPath = [ptA, ptB];
        service.inProgress.innerHTML = 'test';
        service.goingOutsideCanvas();
        expect(service.currentPath).toEqual([]);
        expect(service.inProgress.innerHTML).toEqual('');
    });

    it('should shift through the current path if it has too many points on move', () => {
        service.currentPath = [ptA, ptB, ptA, ptB, ptA];
        spyOn(service, 'updateProgress').and.returnValue();
        spyOn(service, 'checkIfTouching').and.returnValue();
        const SPY = spyOn(service.currentPath, 'shift').and.callThrough();
        service.move(ptA);
        expect(SPY).toHaveBeenCalled();
    });

    it('should not call changeFill on left click and filter tagName', () => {
        elemStub.children = [{ tagName: 'filter' }];
        elemStub.childElementCount = 1;
        service.selected = true;
        service.isRightClick = false;
        const SPY = spyOn(service, 'changeFill');
        service.changeColor(elemStub);
        expect(SPY).not.toHaveBeenCalled();
    });

    it('should not call the translate method if the color editor doesnt overlap an element', () => {
        service.isDown = false;
        service.inProgress = htmlElementStub;
        service.currentPath = [ptA, ptB, ptA];
        service.drawing = htmlElementStub;
        spyOn(CanvasInteraction, 'getPreciseBorder').and.returnValue([[2, true], [0, true], [1, true], [2, true]]);

        spyOn(Point, 'rectOverlap').and.returnValue(false);
        htmlElementStub = null;
        service.canvas = htmlElementStub;
        const SPY = spyOn(ElementInfo, 'translate');
        service.checkIfTouching();
        expect(SPY).not.toHaveBeenCalled();
    });

    it('should set touching as true if the element as the fill attribute and the point is in fill', () => {
        spyOn(elemStub, 'isPointInStroke').and.returnValue(false);
        spyOn(elemStub, 'isPointInFill').and.returnValue(true);
        spyOn(elemStub, 'getAttribute').and.returnValue('attr');
        const TEST_TOUCH = service.checkIfPathIntersection(elemStub, elemStub, 2, new Point(0, 0), true);
        expect(TEST_TOUCH).toBe(true);

    });

    it('should not modify touching if the element doesnt have the fill attribute and the point is not in fill', () => {
        spyOn(elemStub, 'isPointInStroke').and.returnValue(false);
        spyOn(elemStub, 'isPointInFill').and.returnValue(false);
        spyOn(elemStub, 'getAttribute').and.returnValue(null);
        const TEST_TOUCH = service.checkIfPathIntersection(elemStub, elemStub, 2, new Point(0, 0), false);
        expect(TEST_TOUCH).toBe(false);
    });

    it('should not call emitDrawingDone if the color has not been changed', () => {
        const SPY = spyOn(service.interaction, 'emitDrawingDone');
        service.ignoreNextUp = false;
        service.changedColorOnce = false;
        service.up(new Point(0, 0), true);
        expect(SPY).not.toHaveBeenCalled();
    });

    it('should not change fill color if the element is not selected', () => {
        service.selected = false;
        service.isRightClick = false;
        const SPY = spyOn(service, 'changeFill');
        service.changeColor(elemStub);
        expect(SPY).not.toHaveBeenCalled();
    });

    it('should not set the attributes if they are undefined', () => {
        const TEST_ATTR: ToolsAttributes = { lineThickness: 25, texture: 0 };
        service.attr = TEST_ATTR;
        service.updateAttributes(); // init subscription
        service.interaction.emitToolsAttributes(undefined);
        expect(service.attr).toEqual(TEST_ATTR);
    });

    it('should not check for path intersection if there is no first child', () => {
        classlistStub.contains = () => true;
        service.isDown = true;
        service.currentPath = [ptA, ptB, ptA];
        service.drawing = htmlElementStub;
        htmlElementStub.getBoundingClientRect = () => 1;
        service.canvas = htmlElementStub;

        htmlElementStub.firstElementChild = null;
        service.inProgress = htmlElementStub;
        spyOn(CanvasInteraction, 'getPreciseBorder').and.returnValue([[2, true], [0, true], [1, true], [2, true]]);
        spyOn(service, 'checkIfPathIntersection').and.returnValue(false);
        spyOn(Point, 'rectOverlap').and.returnValue(true);
        spyOn(ElementInfo, 'translate').and.returnValue(new Point(0, 0));
        service.checkIfTouching();
        expect(service.checkIfPathIntersection).not.toHaveBeenCalled();
    });

    it('should not check for path intersection if there is no first child to the first child', () => {
        service.isDown = true;
        service.inProgress = htmlElementStub;
        service.currentPath = [ptA, ptB, ptA];
        service.drawing = htmlElementStub;
        htmlElementStub.firstElementChild.firstElementChild = null;
        service.inProgress = htmlElementStub;
        spyOn(CanvasInteraction, 'getPreciseBorder').and.returnValue([[2, true], [0, true], [1, true], [2, true]]);
        spyOn(service, 'checkIfPathIntersection').and.returnValue(true);
        spyOn(Point, 'rectOverlap').and.returnValue(true);
        spyOn(ElementInfo, 'translate').and.returnValue(new Point(0, 0));

        service.checkIfTouching();
        expect(service.checkIfPathIntersection).not.toHaveBeenCalled();

    });

    it('should have the signatures of the inherited methods', () => { // for coverage purposes
        expect(service.doubleClick(new Point(0, 0))).not.toBeDefined();
        expect(service.goingInsideCanvas()).not.toBeDefined();
        expect(service.updateDown(new KeyboardHandlerService())).not.toBeDefined();
        expect(service.updateUp(0)).not.toBeDefined();
    });
    // tslint:disable-next-line: max-file-line-count
});
