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
    it('should create a container named eraser-brush', () => {
        let ptArr : Point[] = [];
        ptArr.push(new Point(2,3),new Point(2,2));
        const PATH = service.createPath(ptArr);
        expect(PATH).toContain('name = "eraser-brush"');
      });
    
      
    it('should have a fill attribute', () => {
        let ptArr : Point[] = [];
        ptArr.push(new Point(2,3),new Point(2,2));
        service.chosenColor.primColor = 'blue'
        const PATH = service.createPath(ptArr);
        expect(PATH).toContain('fill="blue"');
      });

      it('should have a stroke width attribute of 3', () => {
        let ptArr : Point[] = [];
        ptArr.push(new Point(2,3),new Point(2,2));
        const PATH = service.createPath(ptArr);
        expect(PATH).toContain('stroke-width="3"');
      });

      it('should have a stroke attribute', () => {
        let ptArr : Point[] = [];
        ptArr.push(new Point(2,3),new Point(2,2));
        service.chosenColor.secColor = 'blue'
        const PATH = service.createPath(ptArr);
        expect(PATH).toContain('stroke="blue"');
      });

      
});
