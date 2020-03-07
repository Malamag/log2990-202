import { TestBed } from '@angular/core/testing';

import { ImageFilterService } from './image-filter.service';

describe('ImageFilterService', () => {
    let service: ImageFilterService;
    let doodle: any;
    let filterStub: any;
    beforeEach(() => {
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
        const creatorSpy = spyOn(service.renderer, 'createElement');
        service.filterInit();
        expect(creatorSpy).toHaveBeenCalled();
    });
    it('create BNW filter should set attributes and append child', () => {
        service.filterInit = jasmine.createSpy().and.returnValue(filterStub);

        const creatorSpy = spyOn(service.renderer, 'createElement');
        const modifierSpy = spyOn(service.renderer, 'setAttribute');
        const appendSpy = spyOn(service.renderer, 'appendChild');
        service.createBNWFilter();

        expect(creatorSpy).toHaveBeenCalled();
        expect(modifierSpy).toHaveBeenCalled();
        expect(appendSpy).toHaveBeenCalled();
    });
    it('create Hue Rotate filter should set attributes and append a child', () => {
        service.filterInit = jasmine.createSpy().and.returnValue(filterStub);

        const creatorSpy = spyOn(service.renderer, 'createElement');
        const modifierSpy = spyOn(service.renderer, 'setAttribute');
        const appendSpy = spyOn(service.renderer, 'appendChild');
        service.createHueRotateFilter();

        expect(creatorSpy).toHaveBeenCalled();
        expect(modifierSpy).toHaveBeenCalled();
        expect(appendSpy).toHaveBeenCalled();
    });
    it('create noise filter should set attrbutes and append two children', () => {
        service.filterInit = jasmine.createSpy().and.returnValue(filterStub);
        const creatorSpy = spyOn(service.renderer, 'createElement');
        const modifierSpy = spyOn(service.renderer, 'setAttribute');
        const appendSpy = spyOn(service.renderer, 'appendChild');
        service.createNoiseFilter();

        expect(creatorSpy).toHaveBeenCalled();
        expect(modifierSpy).toHaveBeenCalled();
        expect(appendSpy).toHaveBeenCalledTimes(2);
    });
    it('create soft filter should create elements, set attributes and append children', () => {
        service.filterInit = jasmine.createSpy().and.returnValue(filterStub);
        const creatorSpy = spyOn(service.renderer, 'createElement');
        const modifierSpy = spyOn(service.renderer, 'setAttribute');
        const appendSpy = spyOn(service.renderer, 'appendChild');
        service.createSoftFilter();

        expect(creatorSpy).toHaveBeenCalled();
        expect(modifierSpy).toHaveBeenCalled();
        expect(appendSpy).toHaveBeenCalled();
    });
    it('create texture filter should create elements, set attributes and append children', () => {
        service.filterInit = jasmine.createSpy().and.returnValue(filterStub);
        const creatorSpy = spyOn(service.renderer, 'createElement');
        const modifierSpy = spyOn(service.renderer, 'setAttribute');
        const appendSpy = spyOn(service.renderer, 'appendChild');
        service.createTextureFilter();

        expect(creatorSpy).toHaveBeenCalled();
        expect(modifierSpy).toHaveBeenCalled();
        expect(appendSpy).toHaveBeenCalled();
    });
    it('should push all six filters in an array filter', () => {
        const filtersArray = service.createAllFilters();
        expect(filtersArray.length).toEqual(5);
    });
    it('should remove all the filters', () => {
        const num = -1;
        const removeSpy = spyOn(service.renderer, 'removeChild');
        const modifierSpy = spyOn(service.renderer, 'setAttribute');
        service.toggleFilter(doodle, num);
        expect(removeSpy).toHaveBeenCalled();
        expect(modifierSpy).toHaveBeenCalled();
    });
    it('should remove the current filter and set doodles filter attribute to a new filter', () => {
        const num = 1;
        const removeSpy = spyOn(service.renderer, 'removeChild');
        const modifierSpy = spyOn(service.renderer, 'setAttribute');
        const appendSpy = spyOn(service.renderer, 'appendChild');
        service.toggleFilter(doodle, num);
        expect(removeSpy).toHaveBeenCalled();
        expect(modifierSpy).toHaveBeenCalled();
        expect(appendSpy).toHaveBeenCalled();
        expect(service.currentFilter).toBe(service.filterArray[num]);
    });
});
