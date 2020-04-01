import { TestBed } from '@angular/core/testing';

import { ColorConvertingService } from '../colorPicker/color-converting.service';
import { ColorPickingService } from '../colorPicker/color-picking.service';
import { InteractionService } from '../service-interaction/interaction.service';
import { PipetteService } from './pipette.service';
import { Point } from './point';

describe('PipetteService', () => {
    let service: PipetteService;
    // tslint:disable-next-line: no-any - we want to allow stubs not implementing all methods
    let htmlCanvasStub: any;
    // tslint:disable-next-line: no-any
    let canvasContextStub: any;
    // tslint:disable-next-line: no-any
    let fakeData: any;
    let ptA: Point;
    let ptB: Point;
    const VAL = 255;

    // let ptArr: Point[];
    beforeEach(() => {
        fakeData = {
            data: [VAL, VAL, VAL, VAL],
        };

        canvasContextStub = {
            getImageData: (x: number, y: number, w: number, h: number) => fakeData,
        };

        htmlCanvasStub = {
            getContext: () => canvasContextStub,
        };

        TestBed.configureTestingModule({
            providers: [
                { provide: HTMLCanvasElement, useValue: htmlCanvasStub },
                { provide: Boolean, useValue: true },
                { provide: CanvasRenderingContext2D, useValue: canvasContextStub },
                { provide: Uint8ClampedArray, useValue: fakeData },
            ],
        });

        ptA = new Point(0, 0);
        ptB = new Point(1, 2);
        /*  ptArr = [ptA, ptB];*/
        service = TestBed.get(PipetteService);
    });

    it('should be created', () => {
        const TEST_SERVICE: PipetteService = TestBed.get(PipetteService);
        expect(TEST_SERVICE).toBeTruthy();
    });

    it('should get canvas context in subscription', () => {
        const IT_SERVICE = new InteractionService();

        const PIP_TEST = new PipetteService(true, IT_SERVICE, new ColorPickingService(new ColorConvertingService()));
        IT_SERVICE.emitCanvasContext(htmlCanvasStub);
        expect(PIP_TEST.canvasContext).toEqual(canvasContextStub);
    });

    it('should call image data conversion on mouse down', () => {
        const SPY = spyOn(service, 'imgDataConversion');
        service.down(ptA);
        expect(SPY).toHaveBeenCalled();
    });

    it('should emit the selected color with right click boolean', () => {
        const COLOR = '#FFFFFFFF';
        service.colorStr = COLOR;
        const SPY = spyOn(service, 'emitSelectedColor');
        service.down(ptA, true, true); // is right click and in the workspace
        expect(SPY).toHaveBeenCalledWith(COLOR, true);
    });

    it('should emit the converted preview color on mouse move', () => {
        const COLOR = '#ffffffff';
        service.colorStr = COLOR;
        const IMG_DATA_SPY = spyOn(service, 'imgDataConversion');
        const EMIT_SPY = spyOn(service.interact, 'emitPreviewColor');
        service.move(ptB);
        expect(IMG_DATA_SPY).toHaveBeenCalledWith(ptB);
        expect(EMIT_SPY).toHaveBeenCalledWith(COLOR);
    });

    it('should get the image data at the point on valid canvas context with data conversion', () => {
        // tslint:disable-next-line: no-string-literal
        service['canvasContext'] = canvasContextStub;

        canvasContextStub.getImageData = jasmine.createSpy().and.returnValue(fakeData);
        const BUILD_SPY = spyOn(service, 'buildImageData');
        const SQUARE_SIZE = 1; // 1px
        service.imgDataConversion(ptB);
        expect(canvasContextStub.getImageData).toHaveBeenCalledWith(ptB.x, ptB.y, SQUARE_SIZE, SQUARE_SIZE);
        expect(BUILD_SPY).toHaveBeenCalled();
    });

    it('should not get the image data on null canvas context', () => {
        // tslint:disable-next-line: no-string-literal
        service['canvasContext'] = null;
        canvasContextStub.getImageData = jasmine.createSpy().and.returnValue(fakeData);
        const BUILD_SPY = spyOn(service, 'buildImageData');
        service.imgDataConversion(ptB);
        expect(canvasContextStub.getImageData).not.toHaveBeenCalled();
        expect(BUILD_SPY).not.toHaveBeenCalled();
    });

    it('should convert the rgba values to a color hexadecimal string', () => {
        const DATA_ARR = [VAL, VAL, VAL, VAL];
        const EXP_STR = '#FFFFFFFF';
        service.clickedColor = DATA_ARR;
        const COLOR_STR = service.buildImageData();
        expect(COLOR_STR).toEqual(EXP_STR);
    });

    it('should call the rbgToHex converter on every array element', () => {
        const DATA_ARR = [VAL, VAL, VAL, VAL];
        service.clickedColor = DATA_ARR;
        const SPY = spyOn(service.cPick.colorConvert, 'rgbToHex');
        service.buildImageData();
        expect(SPY).toHaveBeenCalledTimes(DATA_ARR.length);
    });

    it('should set the secondary color on right click and emit it', () => {
        const FAKE_SEC_COLOR = '#000000ff';
        const SPY = spyOn(service.cPick, 'emitColors');
        service.emitSelectedColor(FAKE_SEC_COLOR, true);
        expect(SPY).toHaveBeenCalled();
    });

    it('should set the primary color on left click and emit it', () => {
        const FAKE_PRIM_COLOR = '#000000ff';
        const SPY = spyOn(service.cPick, 'emitColors');
        service.emitSelectedColor(FAKE_PRIM_COLOR, false);
        expect(SPY).toHaveBeenCalled();
    });

    it('should update the color picker display after choosing a color', () => {
        const SPY = spyOn(service.cPick, 'updateDisplay');
        const FAKE_COLOR = '#000000ff';
        service.emitSelectedColor(FAKE_COLOR);
        expect(SPY).toHaveBeenCalledWith(FAKE_COLOR);
    });

    it('should have a canvas context subscription in its constructor', () => {
        const IT_SERVICE = new InteractionService();
        const SPY = spyOn(IT_SERVICE.$canvasContext, 'subscribe');
        const PIP_TEST = new PipetteService(true, IT_SERVICE, new ColorPickingService(new ColorConvertingService()));
        expect(PIP_TEST).toBeTruthy();
        expect(SPY).toHaveBeenCalled();
    });

    it('should have all unimplemented methods from the bas class', () => {
        expect(service.updateDown()).not.toBeDefined();
        expect(service.updateUp()).not.toBeDefined();
        expect(service.cancel()).not.toBeDefined();
        expect(service.up()).not.toBeDefined();
        expect(service.doubleClick()).not.toBeDefined();
        expect(service.goingInsideCanvas()).not.toBeDefined();
        expect(service.goingOutsideCanvas()).not.toBeDefined();
    });
});
