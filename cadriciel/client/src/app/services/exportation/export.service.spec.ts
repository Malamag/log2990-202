import { TestBed } from '@angular/core/testing';

import { ExportService } from './export.service';
import { ElementRef } from '@angular/core';

describe('ExportService', () => {
    let service: ExportService;
    let elementStub: any;
    let nativeElemStub: any;
    beforeEach(() => {
        nativeElemStub = {
            toDataURL: (data: string) => 0,
            getContext: (ctx: string) => 0,
        };
        elementStub = {
            nativeElement: nativeElemStub,
        };
        TestBed.configureTestingModule({
            providers: [
                { provide: Node, useValue: elementStub },
                { provide: SVGElement, useValue: elementStub },
                { provide: ElementRef, useValue: elementStub },
            ],
        });
        service = TestBed.get(ExportService);
    });

    it('should be created', () => {
        const service: ExportService = TestBed.get(ExportService);
        expect(service).toBeTruthy();
    });

    it('should create an url from an svg element', () => {
        service.svgToURL = jasmine.createSpy().and.returnValue('fakeURL');

        const URL = service.svgToURL(elementStub);
        expect(URL).toBeDefined();
    });

    // check for a possible viewchild
    /*it('should build a download link', () => {
        const spy = spyOn(document, 'createElement');
        const FAKE_NAME = 'monDessin';
        const FAKE_TYPE = 'png';
        const FAKE_SRC = 'src';
        service.download(FAKE_NAME, FAKE_TYPE, FAKE_SRC);
        expect(spy).toHaveBeenCalledWith('a');
    });*/

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
});
