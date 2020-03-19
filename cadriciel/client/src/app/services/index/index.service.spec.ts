import { HttpClient } from '@angular/common/http';
import { inject, TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material';
import { of } from 'rxjs';
import { Message } from '../../../../../common/communication/message';
import { SVGData } from '../../../svg-data';
import { ImageData } from '../../image-data';
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
    it('should return expected message (HttpClient called once)', inject([IndexService], (service: IndexService) => {
        const expectedMessage: Message = { body: 'Hello', title: 'World' };
        httpClientSpy.get.and.returnValue(of(expectedMessage));
        // check the content of the mocked call
        service.basicGet().subscribe((response: Message) => {
            expect(response.title).toEqual(expectedMessage.title, 'Title check');
            expect(response.body).toEqual(expectedMessage.body, 'body check');
        }, fail);
        // check if only one call was made
        expect(httpClientSpy.get.calls.count()).toBe(1, 'one call');
    }));
    it('should return the expected iamgeData informations', inject([IndexService], (service: IndexService) => {
        const expectedSvgData: SVGData = { height: '2500', width: '1080', bgColor: 'white', innerHTML: ['hello', 'hello'] };
        const expectedData: ImageData = { id: '570', svgElement: expectedSvgData, name: 'welcome', tags: ['hello', 'new'] };
        httpClientSpy.get.and.returnValue(of([expectedData]));
        service.getAllImages().subscribe((data) => {
            expect(data).toEqual([expectedData]);
        });
    }));
    it('should get the expected data', inject([IndexService], (service: IndexService) => {
        const expectedSvgData: SVGData = { height: '2500', width: '1080', bgColor: 'white', innerHTML: ['hello', 'hello'] };
        const expectedData: ImageData = { id: '570', svgElement: expectedSvgData, name: 'welcome', tags: ['hello', 'new'] };
        httpClientSpy.get.and.returnValue(of([expectedData]));
        const tags = ['hello', 'new'];
        service.getImagesByTags(tags).subscribe((data) => {
            expect(data).toEqual([expectedData]);
        });
    }));
    it('should throw an error that the element can not be deleted', inject([IndexService], (service: IndexService) => {
        const message = 'failed to delete';
        httpClientSpy.delete.and.throwError(message);
        const expectedError = new Error(message);
        const id = '570';
        try {
            expect(service.deleteImageById(id)).toThrowError('failed to delete');
        } catch (error) {
            expect(error).toEqual(expectedError);
        }
    }));
    it('should display a feedback', inject([IndexService], (service: IndexService) => {
        service['displayFeedback'] = jasmine.createSpy();
        const id = '570';
        const expectedSvgData: SVGData = { height: '2500', width: '1080', bgColor: 'white', innerHTML: ['hello', 'hello'] };
        const expectedData: ImageData = { id: '570', svgElement: expectedSvgData, name: 'welcome', tags: ['hello', 'new'] };
        httpClientSpy.delete.and.returnValue(of([expectedData]));
        service.deleteImageById(id);
        expect(service['displayFeedback']).toHaveBeenCalled();
    }));
    it('should patch the information', inject([IndexService], (service: IndexService) => {
        const expectedSvgData: SVGData = { height: '2500', width: '1080', bgColor: 'white', innerHTML: ['hello', 'hello'] };
        const expectedData: ImageData = { id: '570', svgElement: expectedSvgData, name: 'welcome', tags: ['hello', 'new'] };
        service.modifyImage(expectedData);
        expect(httpClientSpy.patch.calls.count()).toBe(0);
    }));
    it('should display a positive feedback', inject([IndexService], (service: IndexService) => {
        const expectedSvgData: SVGData = { height: '2500', width: '1080', bgColor: 'white', innerHTML: ['hello', 'hello'] };
        const expectedData: ImageData = { id: '570', svgElement: expectedSvgData, name: 'welcome', tags: ['hello', 'new'] };
        httpClientSpy.post.and.returnValue(of(expectedData));
        service['displayFeedback'] = jasmine.createSpy();
        service.saveImage(expectedData);
        expect(service['displayFeedback']).toHaveBeenCalled();
    }));
    it('should throw an error', inject([IndexService], (service: IndexService) => {
        const expectedSvgData: SVGData = { height: '2500', width: '1080', bgColor: 'white', innerHTML: ['hello', 'hello'] };
        const expectedData: ImageData = { id: '570', svgElement: expectedSvgData, name: 'welcome', tags: ['hello', 'new'] };
        const message = 'error while saving';
        const expectedError = new Error(message);
        httpClientSpy.post.and.throwError(message);
        try {
            expect(service.saveImage(expectedData)).toThrowError();
        } catch (error) {
            expect(error).toEqual(expectedError);
        }
    }));
    /*
    it('should open a snack bar', inject([IndexService], (service: IndexService) => {
        const openSpy = spyOn(service.snackBar, 'open');
        const feedback = 'hello';
        service.['displayFeedback'](feedback);
        expect(openSpy).toHaveBeenCalled();
    }));*/
});
