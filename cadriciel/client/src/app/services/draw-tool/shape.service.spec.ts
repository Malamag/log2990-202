import { TestBed } from '@angular/core/testing';

import { FormsAttribute } from '../attributes/attribute-form';
import { ColorConvertingService } from '../colorPicker/color-converting.service';
import { ColorPickingService } from '../colorPicker/color-picking.service';
import { KeyboardHandlerService } from '../keyboard-handler/keyboard-handler.service';
import { InteractionService } from '../service-interaction/interaction.service';
import { Point } from './point';
import { ShapeService } from './shape.service';

export class FakeInteractionService extends InteractionService { }

describe('ShapeService', () => {
    let service: ShapeService;
    // tslint:disable-next-line: no-any
    let kbServiceStub: any;
    let ptA: Point;
    let ptB: Point;
    let ptArr: Point[];
    // let interaction : InteractionService
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
                { provide: HTMLElement, useValue: { getAttribute: () => 0 } },
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
        // tslint:disable-next-line: no-string-literal
        service['attr'] = { plotType: 0, lineThickness: 5, numberOfCorners: 3 };
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should set the attributes in the subscription', () => {
        service.interaction.emitFormsAttributes({ plotType: 0, lineThickness: 0, numberOfCorners: 0 });
        const SPY_INTERACTION = spyOn(service.interaction.$formsAttributes, 'subscribe');
        service.updateAttributes();
        expect(SPY_INTERACTION).toHaveBeenCalled();

        // tslint:disable-next-line: no-string-literal
        expect(service['attr']).toBeDefined();
    });

    it('should update the current path on mouse down', () => {
        const SPY = spyOn(service, 'updateProgress');
        service.down(ptA);
        expect(service.currentPath.length).toBe(2); // same point added twice to manage static mouse
        expect(service.currentPath).toContain(ptA);

        expect(SPY).toHaveBeenCalled();
    });
    it('should update the drawing on mouse up', () => {
        service.down(ptA); // pressing the mouse
        const SPY = spyOn(service, 'updateDrawing');
        service.up(ptA);
        expect(SPY).toHaveBeenCalled();
    });
    it('should not update the drawing on mouse up', () => {
        service.ignoreNextUp = true;
        const SPY = spyOn(service, 'updateDrawing');
        service.up(ptA);
        expect(SPY).toHaveBeenCalledTimes(0);
    });
    it('should not update the progress on mouse move', () => {
        service.isDown = false;
        const SPY = spyOn(service, 'updateProgress');
        service.move(ptA);
        expect(SPY).toHaveBeenCalledTimes(0);
    });
    it('should update the progress on mouse mouve', () => {
        service.isDown = true;
        const SPY = spyOn(service, 'updateProgress');
        service.move(ptA);
        expect(SPY).toHaveBeenCalled();
    });
    it('should set the width and the height', () => {
        service.setdimensions(ptArr);
        // tslint:disable-next-line: no-string-literal
        expect(service['width']).toEqual(ptB.x - ptA.x);
        // tslint:disable-next-line: no-string-literal
        expect(service['height']).toEqual(ptB.y - ptA.y);
    });

    it('should not fill the shape', () => {
        const NOFILL_MODE = 0;
        // tslint:disable-next-line: no-string-literal
        service['attr'].plotType = NOFILL_MODE;
        service.setAttributesToPath();
        const FILL = 'fill="none"';

        // tslint:disable-next-line: no-string-literal
        expect(service['svgString']).toContain(FILL);
    });
    it('should not have a stroke and fill the shape', () => {
        // tslint:disable-next-line: no-string-literal
        service['attr'] = { plotType: 1, lineThickness: 5, numberOfCorners: 3 };
        service.setAttributesToPath();
        const STROKE_FILL = 'stroke="none"';
        const FILL = 'fill="#000000ff"'; // base color

        // tslint:disable-next-line: no-string-literal
        expect(service['svgString']).toContain(STROKE_FILL);
        // tslint:disable-next-line: no-string-literal
        expect(service['svgString']).toContain(FILL);
    });

    it('should not update progress if the key is not down', () => {
        service.isDown = false;
        const SPY = spyOn(service, 'updateProgress');
        service.updateDown(kbServiceStub);
        expect(SPY).not.toHaveBeenCalled();
    });

    it('should update progress if the key is down', () => {
        service.isDown = true;
        const SPY = spyOn(service, 'updateProgress');
        service.updateDown(kbServiceStub);
        expect(SPY).toHaveBeenCalled();
    });

    it('should update the attributes on subscription activation if the object is defined', () => {
        const TEST_ATTR: FormsAttribute = { plotType: 1, lineThickness: 50, numberOfCorners: 4 };
        service.updateAttributes();
        service.interaction.emitFormsAttributes(TEST_ATTR);
        expect(service.attr).toEqual(TEST_ATTR);
    });

    it('should not update the attributes on subscription if the object is undefined', () => {
        const TEST_ATTR: FormsAttribute = { plotType: 1, lineThickness: 50, numberOfCorners: 4 };

        service.attr = TEST_ATTR;
        service.updateAttributes();

        service.interaction.emitFormsAttributes(undefined);

        expect(service.attr).toBeDefined(); // attributes have not been updated
    });

    it('should have the inherited methods signatures', () => {
        expect(service.doubleClick(new Point(0, 0))).not.toBeDefined(); // test for coverage purposes
        expect(service.goingOutsideCanvas()).not.toBeDefined();
        expect(service.goingInsideCanvas()).not.toBeDefined();
        expect(service.updateUp(0)).not.toBeDefined();

    });

});
