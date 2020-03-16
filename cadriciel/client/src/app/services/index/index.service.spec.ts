import { HttpClient } from '@angular/common/http';
import { inject, TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material';
import { of } from 'rxjs';
import { Message } from '../../../../../common/communication/message';
import { SVGData } from '../../../svgData';
import { ImageData } from '../../imageData';
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
    })
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
        const expectedSvgData: SVGData = { height: '2500', width: '1080', bgColor: 'white', innerHTML: ['hello', 'hello'] }
        const expectedData: ImageData = { id: '570', svgElement: expectedSvgData, name: 'welcome', tags: ['hello', 'new'] }
        httpClientSpy.get.and.returnValue(of([expectedData]));
        service.getAllImages().subscribe((data) => {
            expect(data).toEqual([expectedData])
        })
    }));
    it('should get the expected data', inject([IndexService], (service: IndexService) => {
        const expectedSvgData: SVGData = { height: '2500', width: '1080', bgColor: 'white', innerHTML: ['hello', 'hello'] }
        const expectedData: ImageData = { id: '570', svgElement: expectedSvgData, name: 'welcome', tags: ['hello', 'new'] }
        httpClientSpy.get.and.returnValue(of([expectedData]));
        const tags = ['hello', 'new']
        service.getImagesByTags(tags).subscribe((data) => {
            expect(data).toEqual([expectedData])
        })
    }))
    it('should throw an error in the console', inject([IndexService], (service: IndexService) => {
        httpClientSpy.delete.and.throwError('failed to delete');
        const id = '570';
        expect(service.deleteImageById(id)).toThrowError('failed to delete');
    }))
    it('should display a feedback', inject([IndexService], (service: IndexService) => {
        const spy = spyOn(service, 'displayFeedback');
        const id = '570';
        const expectedSvgData: SVGData = { height: '2500', width: '1080', bgColor: 'white', innerHTML: ['hello', 'hello'] }
        const expectedData: ImageData = { id: '570', svgElement: expectedSvgData, name: 'welcome', tags: ['hello', 'new'] }
        httpClientSpy.delete.and.returnValue(of([expectedData]))
        service.deleteImageById(id);
        expect(spy).toHaveBeenCalled()
    }))
    it('should patch the information', inject([IndexService], (service: IndexService) => {
        const spy = spyOn(httpClientSpy, 'patch')
        const expectedSvgData: SVGData = { height: '2500', width: '1080', bgColor: 'white', innerHTML: ['hello', 'hello'] }
        const expectedData: ImageData = { id: '570', svgElement: expectedSvgData, name: 'welcome', tags: ['hello', 'new'] }
        service.modifyImage(expectedData)
        expect(spy).toHaveBeenCalled()
    }))
});
