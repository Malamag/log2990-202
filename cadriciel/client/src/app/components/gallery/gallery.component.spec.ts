import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, ElementRef, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatAutocompleteModule, MatCardModule,
     MatChipsModule, MatDialogModule,
      MatFormFieldModule, MatIconModule,
       MatInputModule, MatProgressSpinnerModule,
        MatSelectModule, MatSnackBarModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { SVGData } from 'src/svgData';
import { ImageData } from '../../imageData';
import { GalleryComponent } from './gallery.component';

describe('GalleryComponent', () => {
    let component: GalleryComponent;
    let fixture: ComponentFixture<GalleryComponent>;
    // tslint:disable-next-line: no-any
    let tagAdd: any;
    // tslint:disable-next-line: no-any
    let fakeEvent: any;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [GalleryComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            imports:
                [MatFormFieldModule,
                    MatIconModule,
                    MatAutocompleteModule,
                    MatChipsModule,
                    MatCardModule,
                    MatSelectModule,
                    MatInputModule,
                    HttpClientModule,
                    BrowserAnimationsModule,
                    MatDialogModule,
                    MatProgressSpinnerModule,
                    MatSnackBarModule,
                ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(GalleryComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        tagAdd = {
            input: {
                value: 'hello',
            },
            value: 'hello',
        };
        fakeEvent = {
            option: {
                value: 'hello',
            },
        };
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('should get all the images', () => {
        const SPY = spyOn(component, 'getAllImages');
        component.ngAfterViewInit();
        expect(SPY).toHaveBeenCalled();
    });
    it('should not remove a tag from an empty container', () => {
        const TAG = 'hello';
        component.tags = [];
        const SPY = spyOn(component.tags, 'splice');
        component.removeTag(TAG);
        expect(SPY).toHaveBeenCalledTimes(0);
    });
    it('should remove the tag', () => {
        const TAG = 'hello';
        component.tags = ['hello'];
        const SPY = spyOn(component.tags, 'splice');
        component.removeTag(TAG);
        expect(SPY).toHaveBeenCalled();
    });
    it('should add the value and should empty the input value', () => {
        const spy = spyOn(component.tagCtrl, 'setValue');
        component.addTag(tagAdd);
        expect(spy).toHaveBeenCalled();
        expect(tagAdd.input.value).toEqual(' ');
        expect(component.tags.length).toBeGreaterThan(0);
    });
    it('should call renderer functions', () => {
        const createSpy = spyOn(component.render, 'createText');
        const appendSpy = spyOn(component.render, 'appendChild');
        component.showMessage();
        expect(createSpy).toHaveBeenCalled();
        expect(appendSpy).toHaveBeenCalled();
    });
    it('should throw the error and get all the images', () => {
        const id = 'hello';
        component.index.deleteImageById = jasmine.createSpy().and.throwError('lelement nexist pas');
        const text = component.render.createText('Aucun dessin ne se trouve sur le serveur');
        component.delete(id);
        expect(component.text).toEqual(text);
    });
    it('should show a message instead of images', () => {
        component.index.getAllImages = jasmine.createSpy().and.returnValue(of([]));
        const appendSpy = spyOn(component.render, 'appendChild');
        component.getAllImages();
        of([]).subscribe(() => {
            expect(appendSpy).toHaveBeenCalled();
        })
    });
    // tslint:disable-next-line: no-any
    it('should create an svg and get tags', async(done: any) => {
        const svgData: SVGData = { height: '2500', width: '1080', bgColor: 'white', innerHTML: ['hello', 'hello'] };
        const data: ImageData = { id: '570', svgElement: svgData, name: 'welcome', tags: ['hello', 'new'] };
        component.index.getAllImages = jasmine.createSpy().and.returnValue(of([data, data]));
        const createSpy = spyOn(component, 'createSVG');
        const getSpy = spyOn(component, 'getAllTags');
        component.getAllImages();
        of([data, data]).subscribe(() => {
            expect(createSpy).toHaveBeenCalled();
            expect(getSpy).toHaveBeenCalled();
            done();
        })
    });
    it('should get all images', () => {
        component.tags = [];
        const getSpy = spyOn(component, 'getAllImages');
        component.getImagesByTags();
        expect(getSpy).toHaveBeenCalled();
    });
    it(' should show the message that there is no elements with corresponding tags', () => {
        component.tags = ['hello', 'hello'];
        const text = component.render.createText('Aucun dessin correspond a vos critères de recherche');
        component.index.getImagesByTags = jasmine.createSpy().and.returnValue(of([]));
        component.getImagesByTags();
        of([]).subscribe(() => {
            expect(component.text.textContent).toEqual(text.textContent);
        })
    });
    it('should call create an svg', () => {
        component.tags = ['hello', 'hello'];
        const svgData: SVGData = { height: '2500', width: '1080', bgColor: 'white', innerHTML: ['hello', 'hello'] };
        const data: ImageData = { id: '570', svgElement: svgData, name: 'welcome', tags: ['hello', 'new'] };
        const spy = spyOn(component, 'createSVG');
        component.index.getImagesByTags = jasmine.createSpy().and.returnValues(of([data, data]));
        component.getImagesByTags();
        of([data, data]).subscribe(() => {
            expect(spy).toHaveBeenCalled();
        })
    });
    it('possible tags length should be greater than zero', () => {
        component.possibleTags = [];
        const svgData: SVGData = { height: '2500', width: '1080', bgColor: 'white', innerHTML: ['hello', 'hello'] };
        const data: ImageData = { id: '570', svgElement: svgData, name: 'welcome', tags: ['hello', 'new'] };
        const dataContainer = [data];
        component.getAllTags(dataContainer);
        expect(component.possibleTags.length).toBeGreaterThan(0);
    });
    it('possible tag length should remain the same', () => {
        component.possibleTags = ['hello'];
        const svgData: SVGData = { height: '2500', width: '1080', bgColor: 'white', innerHTML: ['hello', 'hello'] };
        const data: ImageData = { id: '570', svgElement: svgData, name: 'welcome', tags: ['hello'] };
        const dataContainer = [data];
        component.getAllTags(dataContainer);
        expect(component.possibleTags.length).toEqual(1);
    });
    it('should push the the value in tags container', () => {
        const spy = spyOn(component.tags, 'push');
        component.selected(fakeEvent);
        expect(spy).toHaveBeenCalled();
    });
    it('should set attributes and emit the redone for the canvas', () => {
        const askSpy = spyOn(component.doodle, 'askForDoodle');
        const emitSpy = spyOn(component.interact, 'emitCanvasRedone');
        const parent = component.render.createElement('div');
        const ref = new ElementRef(parent);
        component.doodle.currentDraw = ref;
        const firstChild = component.render.createElement('div');
        component.render.appendChild(component.doodle.currentDraw.nativeElement, firstChild);
        const svgData: SVGData = { height: '2500', width: '1080', bgColor: 'white', innerHTML: ['hello', 'hello'] };
        component.continueDrawing(svgData);
        expect(firstChild.innerHTML).toEqual('hello');
        expect(askSpy).toHaveBeenCalled();
        expect(emitSpy).toHaveBeenCalled();
    });
    it('should create an svg with renderer', () => {
        const svgData: SVGData = { height: '2500', width: '1080', bgColor: 'white', innerHTML: ['hello', 'hello'] };
        const createSpy = spyOn(component.render, 'createElement');
        const attributeSpy = spyOn(component.render, 'setAttribute');
        const appendSpy = spyOn(component.render, 'appendChild');
        component.createSVG(svgData);
        expect(createSpy).toHaveBeenCalledTimes(4);
        expect(attributeSpy).toHaveBeenCalledTimes(5);
        expect(appendSpy).toHaveBeenCalled();
    });
    it('should lower case the value and filter the value from possible tags container', () => {
        const value = 'black';
        const filterSpy = spyOn(component.possibleTags, 'filter');
        component.filter(value);
        expect(filterSpy).toHaveBeenCalled();
    });
});
