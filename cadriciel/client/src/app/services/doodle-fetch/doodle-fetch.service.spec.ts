import { ElementRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { GridRenderService } from '../grid/grid-render.service';
import { DoodleFetchService } from './doodle-fetch.service';

describe('DoodleFetchService', () => {
    let service: DoodleFetchService;
    let spyObj: jasmine.SpyObj<GridRenderService>;
    // tslint:disable-next-line: no-any
    let nativeElemStub: any;
    // tslint:disable-next-line: no-any
    let elementStub: any;
    // tslint:disable-next-line: no-any
    let childElemStub: any;
    beforeEach(() => {
        childElemStub = {
            innerHTML: '<div>Hello World!</div>'
        };
        nativeElemStub = {
            toDataURL: (data: string) => 0,
            getContext: (ctx: string) => 1, // true in an if-clause
            cloneNode: (deep: boolean) => 1,
            children: [childElemStub, childElemStub, childElemStub]
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
        service.currentDraw = elementStub;
        spyObj = jasmine.createSpyObj('GridRenderService', ['renderBack', 'removeGrid']);
        // tslint:disable-next-line: no-string-literal
        service['gService'] = spyObj;
    });

    it('should be created', () => {
        const TEST_SERVICE: DoodleFetchService = TestBed.get(DoodleFetchService);
        expect(TEST_SERVICE).toBeTruthy();
    });

    it('should emit a signal when asking for the doodle', () => {
        const SPY = spyOn(service.ask, 'next');
        service.askForDoodle();
        expect(SPY).toHaveBeenCalled();
    });

    it('should return a native element from a reference', () => {
        const NATIVE_ELEM = service.getSVGElementFromRef(elementStub);
        expect(NATIVE_ELEM).toEqual(nativeElemStub);
    });

    it('should remove the grid when getting the doodle and put it back', () => {
        service.getSVGElementFromRef = jasmine.createSpy().and.returnValue(nativeElemStub);
        service.getDrawingWithoutGrid();
        expect(spyObj.removeGrid).toHaveBeenCalledBefore(spyObj.renderBack);
        expect(service.getSVGElementFromRef).toHaveBeenCalledBefore(spyObj.renderBack);
        expect(spyObj.renderBack).toHaveBeenCalled();
    });

    it('should remove and put the grid back when getting the doodle string', () => {

        service.currentDraw = elementStub;

        service.getDrawingDataNoGrid();
        expect(spyObj.removeGrid).toHaveBeenCalledBefore(spyObj.renderBack);
        expect(spyObj.renderBack).toHaveBeenCalled();
    });

    it('should fill the innerHTML array for SVGData interface', () => {
        service.currentDraw = elementStub;
        const TEST_W = 200;
        const TEST_H = 400;
        const TEST_COLOR = '#ffffffff';
        service.widthAttr = TEST_W;
        service.heightAttr = TEST_H;
        service.backColor = TEST_COLOR;
        const TEST_RET = service.getDrawingDataNoGrid();
        expect(TEST_RET.innerHTML.length).toEqual(nativeElemStub.children.length);
    });

    it('should push an empty html string on error', () => {

        elementStub.nativeElement.children = [undefined];
        service.currentDraw = elementStub;
        const TEST_DATA = service.getDrawingDataNoGrid();
        expect(TEST_DATA.innerHTML[0]).toEqual('');
    });
});
