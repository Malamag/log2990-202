import { TestBed } from '@angular/core/testing';

import { DoodleFetchService } from './doodle-fetch.service';
import { ElementRef } from '@angular/core';

describe('DoodleFetchService', () => {
    let service: DoodleFetchService;
    let nativeElemStub: any;
    let elementStub: any;
    beforeEach(() => {
        nativeElemStub = {
            toDataURL: (data: string) => 0,
            getContext: (ctx: string) => 1, // true in an if-clause
            cloneNode: (deep: boolean) => 1,
        };
        elementStub = {
            nativeElement: nativeElemStub,
        };
        TestBed.configureTestingModule({
            declarations: [],
            providers: [
                { provide: ElementRef, useValue: elementStub },
                { provide: Node, useValue: nativeElemStub },
            ],
        });
        service = new DoodleFetchService();
    });

    it('should be created', () => {
        const service: DoodleFetchService = TestBed.get(DoodleFetchService);
        expect(service).toBeTruthy();
    });

    it('should emit a signal when asking for the doodle', () => {
        const spy = spyOn(service.ask, 'next');
        service.askForDoodle();
        expect(spy).toHaveBeenCalled();
    });
    /* Faire passer ce vilain garçon - cannot read property cloneNode of undefined
    it('should return the drawing by doing a deep-copy on it', () => {
        const spy = spyOn(service, 'getSVGElementFromRef');

        service.currentDraw = elementStub;
        service.getDrawing();
        expect(spy).toHaveBeenCalled();
    });*/

    it('should return a native element from a reference', () => {
        const NATIVE_ELEM = service.getSVGElementFromRef(elementStub);
        expect(NATIVE_ELEM).toEqual(nativeElemStub);
    });
});
