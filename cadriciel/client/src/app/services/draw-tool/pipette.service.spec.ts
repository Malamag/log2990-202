import { TestBed } from '@angular/core/testing';

import { PipetteService } from './pipette.service';
import { Point } from './point';
import { InteractionService } from '../service-interaction/interaction.service';
import { ColorPickingService } from '../colorPicker/color-picking.service';
import { ColorConvertingService } from '../colorPicker/color-converting.service';

describe('PipetteService', () => {
    let service: PipetteService;
    let htmlCanvasStub: any;
    let ptA: Point;
    //let ptB: Point;
    // let ptArr: Point[];
    beforeEach(() => {
        htmlCanvasStub = {
            getContext: () => 0,
        };
        TestBed.configureTestingModule({
            providers: [
                { provide: HTMLCanvasElement, useValue: htmlCanvasStub },
                { provide: Boolean, useValue: true },
            ],
        });

        ptA = new Point(0, 0);
        //ptB = new Point(1, 2);
        /*  ptArr = [ptA, ptB];*/
        service = TestBed.get(PipetteService);
    });

    it('should be created', () => {
        const service: PipetteService = TestBed.get(PipetteService);
        expect(service).toBeTruthy();
    });

    it('should get canvas context on service construction', () => {
        const spy = spyOn(htmlCanvasStub, 'getContext');
        new PipetteService(true, htmlCanvasStub, new InteractionService(), new ColorPickingService(new ColorConvertingService()));
        expect(spy).toHaveBeenCalled();
        expect(service['canvasContext']).not.toBeNull();
    });

    it('should call image data conversion on mouse down', () => {
        const spy = spyOn(service, 'imgDataConversion');
        service.down(ptA);
        expect(spy).toHaveBeenCalled();
    });
});
