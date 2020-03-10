import { TestBed } from '@angular/core/testing';
import { ColorConvertingService } from '../colorPicker/color-converting.service';
import { ColorPickingService } from '../colorPicker/color-picking.service';
import { InteractionService } from '../service-interaction/interaction.service';
import { PipetteService } from './pipette.service';
import { Point } from './point';

describe('PipetteService', () => {
    let service: PipetteService;
    let htmlCanvasStub: any;
    let canvasContextStub: any;
    let fakeData: any;
    let ptA: Point;
    let ptB: Point;
    // let ptArr: Point[];
    beforeEach(() => {
        fakeData = {
            data: [255, 255, 255, 255]
        }
        canvasContextStub = {
            getImageData: (x: number, y: number, w: number, h: number) => fakeData
        }
        htmlCanvasStub = {
            getContext: () => canvasContextStub,

        };
        TestBed.configureTestingModule({
            providers: [
                { provide: HTMLCanvasElement, useValue: htmlCanvasStub },
                { provide: Boolean, useValue: true },
                { provide: CanvasRenderingContext2D, useValue: canvasContextStub },
                { provide: Uint8ClampedArray, useValue: fakeData }
            ],
        });

        ptA = new Point(0, 0);
        ptB = new Point(1, 2);
        /*  ptArr = [ptA, ptB];*/
        service = TestBed.get(PipetteService);
    });

    it('should be created', () => {
        const testService: PipetteService = TestBed.get(PipetteService);
        expect(testService).toBeTruthy();
    });

    it('should get canvas context on service construction', () => {
        const spy = spyOn(htmlCanvasStub, 'getContext');
        const PIPETTE: PipetteService = new PipetteService(
            true,
            htmlCanvasStub,
            new InteractionService(),
            new ColorPickingService(new ColorConvertingService()),
        );
        expect(spy).toHaveBeenCalled();
        expect(PIPETTE).toBeTruthy();

        /* tslint:disable:no-string-literal */
        expect(service['canvasContext']).not.toBeNull();
    });

    it('should call image data conversion on mouse down', () => {
        const spy = spyOn(service, 'imgDataConversion');
        service.down(ptA);
        expect(spy).toHaveBeenCalled();
    });

    it('should emit the selected color with right click boolean', () => {
        const COLOR = '#FFFFFFFF';
        service.colorStr = COLOR;
        const spy = spyOn(service, 'emitSelectedColor');
        service.down(ptA, true, true); // is right click and in the workspace
        expect(spy).toHaveBeenCalledWith(COLOR, true);
    });

    it('should emit the converted preview color on mouse move', () => {
        const COLOR = '#ffffffff';
        service.colorStr = COLOR;
        const imgDataSpy = spyOn(service, 'imgDataConversion');
        const emitSpy = spyOn(service.interact, 'emitPreviewColor');
        service.move(ptB);
        expect(imgDataSpy).toHaveBeenCalledWith(ptB);
        expect(emitSpy).toHaveBeenCalledWith(COLOR);

    });

    it('should get the image data at the point on valid canvas context with data conversion', () => {
        service['canvasContext'] = canvasContextStub;
        canvasContextStub.getImageData = jasmine.createSpy().and.returnValue(fakeData);
        const buildSpy = spyOn(service, 'buildImageData');
        const SQUARE_SIZE = 1; // 1px
        service.imgDataConversion(ptB);
        expect(canvasContextStub.getImageData).toHaveBeenCalledWith(ptB.x, ptB.y, SQUARE_SIZE, SQUARE_SIZE);
        expect(buildSpy).toHaveBeenCalled();
    });

    it('should not get the image data on null canvas context', () => {
        service['canvasContext'] = null;
        canvasContextStub.getImageData = jasmine.createSpy().and.returnValue(fakeData);
        const buildSpy = spyOn(service, 'buildImageData');
        service.imgDataConversion(ptB);
        expect(canvasContextStub.getImageData).not.toHaveBeenCalled();
        expect(buildSpy).not.toHaveBeenCalled();
    });

    it('should convert the rgba values to a color hexadecimal string', () => {
        const DATA_ARR = [255, 255, 255, 255];
        const EXP_STR = '#FFFFFFFF';
        service.clickedColor = DATA_ARR;
        const COLOR_STR = service.buildImageData();
        expect(COLOR_STR).toEqual(EXP_STR);

    });

    it('should call the rbgToHex converter on every array element', () => {
        const DATA_ARR = [255, 255, 255, 255];
        service.clickedColor = DATA_ARR;
        const spy = spyOn(service.cPick.colorConvert, 'rgbToHex');
        service.buildImageData();
        expect(spy).toHaveBeenCalledTimes(DATA_ARR.length)
    });

    it('should set the secondary color on right click and emit it', () => {
        const FAKE_SEC_COLOR = '#000000ff';
        const spy = spyOn(service.cPick, 'emitColors');
        service.emitSelectedColor(FAKE_SEC_COLOR, true);
        expect(spy).toHaveBeenCalled();
        expect(service.cPick.colors.secColor).toEqual(FAKE_SEC_COLOR)
    })

    it('should set the primary color on left click and emit it', () => {
        const FAKE_PRIM_COLOR = '#000000ff';
        const spy = spyOn(service.cPick, 'emitColors');
        service.emitSelectedColor(FAKE_PRIM_COLOR, false);
        expect(spy).toHaveBeenCalled();
        expect(service.cPick.colors.secColor).toEqual(FAKE_PRIM_COLOR)
    });

    it('should update the color picker display after choosing a color', () => {
        const spy = spyOn(service.cPick, 'updateDisplay');
        const FAKE_COLOR = '#000000ff';
        service.emitSelectedColor(FAKE_COLOR);
        expect(spy).toHaveBeenCalledWith(FAKE_COLOR);

    });

});
