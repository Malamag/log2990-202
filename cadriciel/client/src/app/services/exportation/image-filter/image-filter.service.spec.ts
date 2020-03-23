import { TestBed } from '@angular/core/testing';

import { ImageFilterService } from './image-filter.service';

describe('ImageFilterService', () => {
    let service: ImageFilterService;

    // tslint:disable-next-line: no-any
    let doodle: any;
    // tslint:disable-next-line: no-any
    let filterStub: any;
    beforeEach(() => {
        doodle = {};
        filterStub = {
            id: 0,
        };
        TestBed.configureTestingModule({});
    });
    beforeEach(() => {
        service = TestBed.get(ImageFilterService);
        service.currentFilter = service.createBNWFilter();
    });
    it('should be created', () => {
        expect(service).toBeTruthy();
    });
    it('should create an element', () => {
        const CREATOR_SPY = spyOn(service.renderer, 'createElement');
        service.filterInit();
        expect(CREATOR_SPY).toHaveBeenCalled();
    });
    it('create BNW filter should set attributes and append child', () => {
        service.filterInit = jasmine.createSpy().and.returnValue(filterStub);

        const CREATOR_SPY = spyOn(service.renderer, 'createElement');
        const MODIFIER_SPY = spyOn(service.renderer, 'setAttribute');
        const APPEND_SPY = spyOn(service.renderer, 'appendChild');
        service.createBNWFilter();

        expect(CREATOR_SPY).toHaveBeenCalled();
        expect(MODIFIER_SPY).toHaveBeenCalled();
        expect(APPEND_SPY).toHaveBeenCalled();
    });
    it('create Hue Rotate filter should set attributes and append a child', () => {
        service.filterInit = jasmine.createSpy().and.returnValue(filterStub);

        const CREATOR_SPY = spyOn(service.renderer, 'createElement');
        const MODIFIER_SPY = spyOn(service.renderer, 'setAttribute');
        const APPEND_SPY = spyOn(service.renderer, 'appendChild');
        service.createHueRotateFilter();

        expect(CREATOR_SPY).toHaveBeenCalled();
        expect(MODIFIER_SPY).toHaveBeenCalled();
        expect(APPEND_SPY).toHaveBeenCalled();
    });
    it('create noise filter should set attrbutes and append two children', () => {
        service.filterInit = jasmine.createSpy().and.returnValue(filterStub);
        const CREATOR_SPY = spyOn(service.renderer, 'createElement');
        const MODIFIER_SPY = spyOn(service.renderer, 'setAttribute');
        const APPEND_SPY = spyOn(service.renderer, 'appendChild');
        service.createNoiseFilter();

        expect(CREATOR_SPY).toHaveBeenCalled();
        expect(MODIFIER_SPY).toHaveBeenCalled();
        expect(APPEND_SPY).toHaveBeenCalledTimes(2);
    });
    it('create soft filter should create elements, set attributes and append children', () => {
        service.filterInit = jasmine.createSpy().and.returnValue(filterStub);
        const CREATOR_SPY = spyOn(service.renderer, 'createElement');
        const MODIFIER_SPY = spyOn(service.renderer, 'setAttribute');
        const APPEND_SPY = spyOn(service.renderer, 'appendChild');
        service.createSoftFilter();

        expect(CREATOR_SPY).toHaveBeenCalled();
        expect(MODIFIER_SPY).toHaveBeenCalled();
        expect(APPEND_SPY).toHaveBeenCalled();
    });
    it('create texture filter should create elements, set attributes and append children', () => {
        service.filterInit = jasmine.createSpy().and.returnValue(filterStub);
        const CREATOR_SPY = spyOn(service.renderer, 'createElement');
        const MODIFIER_SPY = spyOn(service.renderer, 'setAttribute');
        const APPEND_SPY = spyOn(service.renderer, 'appendChild');
        service.createTextureFilter();

        expect(CREATOR_SPY).toHaveBeenCalled();
        expect(MODIFIER_SPY).toHaveBeenCalled();
        expect(APPEND_SPY).toHaveBeenCalled();
    });
    it('should push all six filters in an array filter', () => {
        const FILTERS_ARRAY = service.createAllFilters();
        const EXP_LEN = 5;
        expect(FILTERS_ARRAY.length).toEqual(EXP_LEN);
    });
    it('should remove all the filters', () => {
        const NUM = -1;
        const REMOVE_SPY = spyOn(service.renderer, 'removeChild');
        const MODIFIER_SPY = spyOn(service.renderer, 'setAttribute');
        service.toggleFilter(doodle, NUM);
        expect(REMOVE_SPY).toHaveBeenCalled();
        expect(MODIFIER_SPY).toHaveBeenCalled();
    });
    it('should remove the current filter and set doodles filter attribute to a new filter', () => {
        const NUM = 1;
        const REMOVE_SPY = spyOn(service.renderer, 'removeChild');
        const MODIFIER_SPY = spyOn(service.renderer, 'setAttribute');
        const APPEND_SPY = spyOn(service.renderer, 'appendChild');
        service.toggleFilter(doodle, NUM);
        expect(REMOVE_SPY).toHaveBeenCalled();
        expect(MODIFIER_SPY).toHaveBeenCalled();
        expect(APPEND_SPY).toHaveBeenCalled();
        expect(service.currentFilter).toBe(service.filterArray[NUM]);
    });
});
