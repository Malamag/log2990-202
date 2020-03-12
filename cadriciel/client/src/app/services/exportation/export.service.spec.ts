import { TestBed } from '@angular/core/testing';

import { ElementRef } from '@angular/core';
import { ExportService } from './export.service';

describe('ExportService', () => {
    let service: ExportService;
    // tslint:disable-next-line: no-any
    let elementStub: any;
    // tslint:disable-next-line: no-any
    let nativeElemStub: any;
    // tslint:disable-next-line: no-any
    let ctxStub: any;
    beforeEach(() => {
        ctxStub = {
            drawImage: (img: CanvasImageSource, dx: number, dy: number) => 1,
        };
        nativeElemStub = {
            toDataURL: (data: string) => 0,
            getContext: (ctx: string) => 2, // true in an if-clause
        };
        elementStub = {
            nativeElement: nativeElemStub,
        };
        TestBed.configureTestingModule({
            providers: [
                { provide: Node, useValue: elementStub },
                { provide: SVGElement, useValue: elementStub },
                { provide: ElementRef, useValue: elementStub },
                { provide: CanvasRenderingContext2D, useValue: ctxStub },
            ],
        });
        service = TestBed.get(ExportService);
    });

    it('should be created', () => {
        const testService: ExportService = TestBed.get(ExportService);
        expect(testService).toBeTruthy();
    });

    it('should create an url from an svg element', () => {
        service.svgToURL = jasmine.createSpy().and.returnValue('fakeURL');

        const URL = service.svgToURL(elementStub);
        expect(URL).toBeDefined();
    });

    it('should export canvas in svg from image url', () => {
        const TYPE = 'svg';
        const NAME = 'monDessin';
        service.imageURL = 'someURL';
        const spy = spyOn(service, 'download');
        service.exportCanvas(NAME, TYPE, elementStub);
        expect(spy).toHaveBeenCalledWith(NAME, TYPE, service.imageURL);
    });

    it('should export canvas with data encode if jpeg or png', () => {
        const TYPE = 'png';
        const NAME = 'monDessin';

        const spy = spyOn(service, 'download');

        service.exportCanvas(NAME, TYPE, elementStub);
        expect(spy).toHaveBeenCalledWith(NAME, TYPE, 0);
    });

    it('should produce an url during exportation', () => {
        const spy = spyOn(service, 'svgToURL');
        service.exportInCanvas(elementStub, elementStub);
        expect(spy).toHaveBeenCalledWith(elementStub);
    });

    it('should load an image in a <canvas> element', () => {
        const spy = spyOn(service, 'loadImageInCanvas');
        service.svgToURL = () => '';

        service.exportInCanvas(elementStub, elementStub);
        expect(spy).toHaveBeenCalled();
    });

    it('should draw an image in the <canvas> element on load', () => {
        const IMG: HTMLImageElement = new Image();

        const spy = spyOn(ctxStub, 'drawImage');
        IMG.onload = () => {
            ctxStub.drawImage(IMG, 0, 0);
        };
        IMG.dispatchEvent(new Event('load'));
        service.loadImageInCanvas(IMG, ctxStub, elementStub);
        expect(spy).toHaveBeenCalled();
    });

    it('should call canvas exportation if name and type are defined', () => {
        const IMG: HTMLImageElement = new Image();
        const NAME = 'fakeName';
        const TYPE = 'fakeType';
        const spy = spyOn(service, 'exportCanvas');
        IMG.onload = () => {
            service.exportCanvas(NAME, TYPE, elementStub);
        };
        IMG.dispatchEvent(new Event('load'));
        service.loadImageInCanvas(IMG, ctxStub, elementStub, NAME, TYPE);
        expect(spy).toHaveBeenCalled();
    });
});
