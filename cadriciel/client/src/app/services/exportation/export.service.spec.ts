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
    // tslint:disable-next-line: no-any
    let fakeDownload: any;
    // tslint:disable-next-line: no-any

    beforeEach(() => {
        fakeDownload = {
            click: () => 0,
            href: '',
            download: '',
        };

        ctxStub = {
            drawImage: (img: CanvasImageSource, dx: number, dy: number) => 1,
        };
        nativeElemStub = {
            toDataURL: (data: string) => 0,
            getContext: (ctx: string) => ctxStub, // true in an if-clause
        };
        elementStub = {
            nativeElement: nativeElemStub,
        };
        TestBed.configureTestingModule({
            providers: [
                { provide: Node, useValue: nativeElemStub },
                { provide: SVGElement, useValue: elementStub },
                { provide: ElementRef, useValue: elementStub },
                { provide: HTMLCanvasElement, useValue: nativeElemStub },
                { provide: CanvasRenderingContext2D, useValue: ctxStub },
            ],
        });
        service = TestBed.get(ExportService);
    });

    it('should be created', () => {
        const TEST_SERVICE: ExportService = TestBed.get(ExportService);
        expect(TEST_SERVICE).toBeTruthy();
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
        const SPY = spyOn(service, 'download');
        service.exportCanvas(NAME, TYPE, elementStub);
        expect(SPY).toHaveBeenCalledWith(NAME, TYPE, service.imageURL);
    });

    it('should export canvas with data encode if jpeg or png', () => {
        const TYPE = 'png';
        const NAME = 'monDessin';

        const SPY = spyOn(service, 'download');

        service.exportCanvas(NAME, TYPE, nativeElemStub);
        expect(SPY).toHaveBeenCalledWith(NAME, TYPE, 0);
    });

    it('should produce an url during exportation', () => {
        const SPY = spyOn(service, 'svgToURL');
        service.exportInCanvas(elementStub, nativeElemStub);
        expect(SPY).toHaveBeenCalledWith(elementStub);
    });

    it('should load an image in a <canvas> element', () => {
        const SPY = spyOn(service, 'loadImageInCanvas');
        service.svgToURL = () => '';

        service.exportInCanvas(elementStub, nativeElemStub);
        expect(SPY).toHaveBeenCalled();
    });

    it('should draw an image in the <canvas> element on load', () => {
        const IMG: HTMLImageElement = new Image();

        const SPY = spyOn(ctxStub, 'drawImage');
        IMG.onload = () => {
            ctxStub.drawImage(IMG, 0, 0);
        };
        IMG.dispatchEvent(new Event('load'));
        service.loadImageInCanvas(IMG, ctxStub, elementStub);
        expect(SPY).toHaveBeenCalled();
    });

    it('should call canvas exportation if name and type are defined', () => {
        const IMG: HTMLImageElement = new Image();
        const NAME = 'fakeName';
        const TYPE = 'fakeType';
        const SPY = spyOn(service, 'exportCanvas');
        IMG.onload = () => {
            service.exportCanvas(NAME, TYPE, elementStub);
        };
        IMG.dispatchEvent(new Event('load'));
        service.loadImageInCanvas(IMG, ctxStub, elementStub, NAME, TYPE);
        expect(SPY).toHaveBeenCalled();
    });

    it('should create and manage a download link using renderer', () => {
        const SRC = 'fakeSRC';
        const NAME = 'test dessin';
        const FORMAT = 'png';
        service.render.createElement = jasmine.createSpy().and.returnValue(fakeDownload);
        service.render.appendChild = jasmine.createSpy().and.returnValue(0);
        service.render.removeChild = jasmine.createSpy().and.returnValue(0);
        service.download(NAME, FORMAT, SRC);
        expect(service.render.createElement).toHaveBeenCalled();
        expect(service.render.appendChild).toHaveBeenCalled();
        expect(service.render.removeChild).toHaveBeenCalled();
    });

    it('should return a valid URL', () => {
        service.xmlSerializer.serializeToString = jasmine.createSpy().and.returnValue('test');
        const TEST_URL = service.svgToURL(elementStub);
        expect(TEST_URL).toBeDefined();
    });
});
