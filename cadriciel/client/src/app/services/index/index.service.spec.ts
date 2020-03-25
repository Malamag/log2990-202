import { HttpClient } from '@angular/common/http';
import { inject, TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material';
import { of } from 'rxjs';
import { ImageData } from '../../../../../image-data';
import { SVGData } from '../../../../../svg-data';
import { IndexService } from './index.service';
import SpyObj = jasmine.SpyObj;
describe('IndexService', () => {
    let httpClientSpy: SpyObj<HttpClient>;
    beforeEach(() => {
        httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'delete', 'patch', 'post']);
    });
    beforeEach(() =>
        TestBed.configureTestingModule({
            providers: [{ provide: HttpClient, useValue: httpClientSpy }],
            imports: [
                MatSnackBarModule,
            ]
        }),
    );
    afterEach(() => {
        httpClientSpy.patch.calls.reset();
    });
    it('should return the expected iamgeData informations', inject([IndexService], (service: IndexService) => {
        const EXPECTED_SVG_DATA: SVGData = { height: '2500', width: '1080', bgColor: 'white', innerHTML: ['hello', 'hello'] };
        const EXPECTED_DATA: ImageData = { id: '570', svgElement: EXPECTED_SVG_DATA, name: 'welcome', tags: ['hello', 'new'] };
        httpClientSpy.get.and.returnValue(of([EXPECTED_DATA]));
        service.getAllImages().subscribe((data) => {
            expect(data).toEqual([EXPECTED_DATA]);
        });
    }));
    it('should get the expected data', inject([IndexService], (service: IndexService) => {
        const EXPECTED_SVG_DATA: SVGData = { height: '2500', width: '1080', bgColor: 'white', innerHTML: ['hello', 'hello'] };
        const EXPECTED_DATA: ImageData = { id: '570', svgElement: EXPECTED_SVG_DATA, name: 'welcome', tags: ['hello', 'new'] };
        httpClientSpy.get.and.returnValue(of([EXPECTED_DATA]));
        const tags = ['hello', 'new'];
        service.getImagesByTags(tags).subscribe((data) => {
            expect(data).toEqual([EXPECTED_DATA]);
        });
    }));
    it('should throw an error that the element can not be deleted', inject([IndexService], (service: IndexService) => {
        const MESSAGE = 'failed to delete';
        httpClientSpy.delete.and.throwError(MESSAGE);
        const EXPECTED_ERROR = new Error(MESSAGE);
        const id = '570';
        try {
            expect(service.deleteImageById(id)).toThrowError('failed to delete');
        } catch (error) {
            expect(error).toEqual(EXPECTED_ERROR);
        }
    }));
    it('should display a feedback', inject([IndexService], (service: IndexService) => {
        // tslint:disable-next-line: no-string-literal
        service['displayFeedback'] = jasmine.createSpy();
        const ID = '570';
        const EXPECTED_SVG_DATA: SVGData = { height: '2500', width: '1080', bgColor: 'white', innerHTML: ['hello', 'hello'] };
        const EXPECTED_DATA: ImageData = { id: '570', svgElement: EXPECTED_SVG_DATA, name: 'welcome', tags: ['hello', 'new'] };
        httpClientSpy.delete.and.returnValue(of([EXPECTED_DATA]));
        service.deleteImageById(ID);
        of([EXPECTED_DATA]).subscribe(() => {
            // tslint:disable-next-line: no-string-literal
            expect(service['displayFeedback']).toHaveBeenCalled();
        });
    }));
    it('should patch the information', inject([IndexService], (service: IndexService) => {
        const EXPECTED_SVG_DATA: SVGData = { height: '2500', width: '1080', bgColor: 'white', innerHTML: ['hello', 'hello'] };
        const EXPECTED_DATA: ImageData = { id: '570', svgElement: EXPECTED_SVG_DATA, name: 'welcome', tags: ['hello', 'new'] };
        service.modifyImage(EXPECTED_DATA);
        expect(httpClientSpy.patch.calls.count()).toBe(0);
    }));
    it('should display a positive feedback', inject([IndexService], (service: IndexService) => {
        const EXPECTED_SVG_DATA: SVGData = { height: '2500', width: '1080', bgColor: 'white', innerHTML: ['hello', 'hello'] };
        const EXPECTED_DATA: ImageData = { id: '570', svgElement: EXPECTED_SVG_DATA, name: 'welcome', tags: ['hello', 'new'] };
        httpClientSpy.post.and.returnValue(of(EXPECTED_DATA));
        // tslint:disable-next-line: no-string-literal
        service['displayFeedback'] = jasmine.createSpy();
        service.saveImage(EXPECTED_DATA);
        // tslint:disable-next-line: no-string-literal
        expect(service['displayFeedback']).toHaveBeenCalled();
    }));
    it('should throw an error', inject([IndexService], (service: IndexService) => {
        const EXPECTED_SVG_DATA: SVGData = { height: '2500', width: '1080', bgColor: 'white', innerHTML: ['hello', 'hello'] };
        const EXPECTED_DATA: ImageData = { id: '570', svgElement: EXPECTED_SVG_DATA, name: 'welcome', tags: ['hello', 'new'] };
        const message = 'error while saving';
        const expectedError = new Error(message);
        httpClientSpy.post.and.throwError(message);
        try {
            expect(service.saveImage(EXPECTED_DATA)).toThrowError();
        } catch (error) {
            expect(error).toEqual(expectedError);
        }
    }));

    it('should open a snack bar', inject([IndexService], (service: IndexService) => {
        const openSpy = spyOn(service.snackBar, 'open');
        const feedback = 'hello';
        // tslint:disable-next-line: no-string-literal
        service['displayFeedback'](feedback);
        expect(openSpy).toHaveBeenCalled();
    }));
});
