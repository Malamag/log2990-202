import { TestBed } from '@angular/core/testing';

import { ElementRef } from '@angular/core';
import { DoodleFetchService } from './doodle-fetch.service';

describe('DoodleFetchService', () => {
    let service: DoodleFetchService;
    // tslint:disable-next-line: no-any
    let nativeElemStub: any;
    // tslint:disable-next-line: no-any
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
        service = TestBed.get(DoodleFetchService);
    });

    it('should be created', () => {
        const testService: DoodleFetchService = TestBed.get(DoodleFetchService);
        expect(testService).toBeTruthy();
    });

    it('should emit a signal when asking for the doodle', () => {
        const spy = spyOn(service.ask, 'next');
        service.askForDoodle();
        expect(spy).toHaveBeenCalled();
    });

    it('should return a native element from a reference', () => {
        const NATIVE_ELEM = service.getSVGElementFromRef(elementStub);
        expect(NATIVE_ELEM).toEqual(nativeElemStub);
    });

    it('should remove the grid when getting the doodle and put it back', () => {
        // tslint:disable-next-line: no-string-literal
        const spyRem = spyOn(service['gService'], 'removeGrid');
        // tslint:disable-next-line: no-string-literal
        const spyRenderBack = spyOn(service['gService'], 'renderBack');
        service.getSVGElementFromRef = jasmine.createSpy().and.returnValue(nativeElemStub);
        service.getDrawingWithoutGrid();
        expect(spyRem).toHaveBeenCalledBefore(spyRenderBack);
        expect(service.getSVGElementFromRef).toHaveBeenCalledBefore(spyRenderBack);
        expect(spyRenderBack).toHaveBeenCalled();
    });
});
