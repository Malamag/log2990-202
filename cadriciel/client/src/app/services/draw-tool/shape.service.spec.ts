import { TestBed } from '@angular/core/testing';

import { ColorPickingService } from '../colorPicker/color-picking.service';
import { KeyboardHandlerService } from '../keyboard-handler/keyboard-handler.service';
import { InteractionService } from '../service-interaction/interaction.service';
import { ShapeService } from './shape.service';
import { Point } from './point';
import { ColorConvertingService } from '../colorPicker/color-converting.service';

export class FakeInteractionService extends InteractionService {}

describe('ShapeService', () => {
    let service: ShapeService;
    let kbServiceStub: any;
    let ptA: Point;
    let ptB: Point;
    let ptArr: Point[];
    //let interaction : InteractionService
    beforeEach(() => {
        kbServiceStub = {
            shiftDown: true,
            ctrlDown: true,
        };

        ptA = new Point(0, 0); // using a point to test position functions
        ptB = new Point(1, 2);
        ptArr = [ptA, ptB];

        TestBed.configureTestingModule({
            providers: [
                { provide: HTMLElement, useValue: {} },
                { provide: Boolean, useValue: true },
                { provide: ColorPickingService, useValue: {} },
                { provide: InteractionService, useValue: new InteractionService() },
                { provide: ColorPickingService, useValue: new ColorPickingService(new ColorConvertingService()) },
                { provide: KeyboardHandlerService, useValue: kbServiceStub },
            ],
        });

        service = TestBed.get(ShapeService);
        service.ignoreNextUp = false;
        service.isDown = false;
        service.attr = { plotType: 0, lineThickness: 5, numberOfCorners: 3 };
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should set the attributes in the subscription', () => {
        service.interaction.emitFormsAttributes({ plotType: 0, lineThickness: 0, numberOfCorners: 0 });
        const spyInteraction = spyOn(service.interaction.$formsAttributes, 'subscribe');
        service.updateAttributes();
        expect(spyInteraction).toHaveBeenCalled();
        expect(service.attr).toBeDefined();
    });
    it('should update progress on move', () => {
        const spy = spyOn(service, 'updateProgress');
        service.down(ptA); // simulating a mouse down at given point
        service.update(kbServiceStub);
        expect(spy).toHaveBeenCalled();
    });
    it('should update the current path on mouse down', () => {
        const spy = spyOn(service, 'updateProgress');
        service.down(ptA);
        expect(service.currentPath.length).toBe(2); // same point added twice to manage static mouse
        expect(service.currentPath).toContain(ptA);

        expect(spy).toHaveBeenCalled();
    });
    it('should update the drawing on mouse up', () => {
        service.down(ptA); // pressing the mouse
        const spy = spyOn(service, 'updateDrawing');
        service.up(ptA);
        expect(spy).toHaveBeenCalled();
    });
    it('should not update the drawing on mouse up', () => {
        service.ignoreNextUp = true;
        const spy = spyOn(service, 'updateDrawing');
        service.up(ptA);
        expect(spy).toHaveBeenCalledTimes(0);
    });
    it('should not update the progress on mouse move', () => {
        service.isDown = false;
        const spy = spyOn(service, 'updateProgress');
        service.move(ptA);
        expect(spy).toHaveBeenCalledTimes(0);
    });
    it('should update the progress on mouse mouve', () => {
        service.isDown = true;
        const spy = spyOn(service, 'updateProgress');
        service.move(ptA);
        expect(spy).toHaveBeenCalled();
    });
    it('should set the width and the height', () => {
        service.setdimensions(ptArr);
        expect(service.width).toEqual(ptB.x - ptA.x);
        expect(service.height).toEqual(ptB.y - ptA.y);
    });

    it('should not fill the shape', () => {
        const NOFILL_MODE: number = 0;
        service.attr.plotType = NOFILL_MODE;
        service.setAttributesToPath();
        const FILL: string = 'fill="none"';

        expect(service.svgString).toContain(FILL);
    });
    it('should not have a stroke and fill the shape', () => {
        service.attr = { plotType: 1, lineThickness: 5, numberOfCorners: 3 };
        service.setAttributesToPath();
        const STROKE_FILL: string = 'stroke="none"';
        const FILL: string = 'fill="#000000ff"'; // base color

        expect(service.svgString).toContain(STROKE_FILL);
        expect(service.svgString).toContain(FILL);
    });
});
