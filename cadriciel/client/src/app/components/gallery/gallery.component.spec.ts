import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
    MatAutocompleteModule, MatCardModule,
    MatChipsModule, MatDialogModule,
    MatFormFieldModule, MatIconModule,
    MatInputModule, MatProgressSpinnerModule,
    MatSelectModule, MatSnackBarModule
} from '@angular/material';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { ShownData } from 'src/app/shown-data';
import { ImageData } from '../../../../../image-data';
import { SVGData } from '../../../../../svg-data';
import { GalleryComponent } from './gallery.component';

describe('GalleryComponent', () => {
    let component: GalleryComponent;
    let fixture: ComponentFixture<GalleryComponent>;
    // tslint:disable-next-line: no-any
    let tagAdd: any;
    // tslint:disable-next-line: no-any
    let fakeAdd: any;
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
                    RouterTestingModule,
                ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(GalleryComponent);
        component = fixture.componentInstance;
        spyOn(component.connect, 'getImagesByTags').and.returnValue(of([]));
        spyOn(component.connect, 'getAllImages').and.returnValue(of([]));
        fixture.detectChanges();
        fakeAdd = {
            value: '',
            input: undefined,
        };
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

    afterEach(() => {
        component.shownDrawings = [];
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
        const SPY = spyOn(component.tagCtrl, 'setValue');
        component.addTag(tagAdd);
        expect(SPY).toHaveBeenCalled();
        expect(tagAdd.input.value).toEqual('');
        expect(component.tags.length).toBeGreaterThan(0);
    });
    it('should call renderer functions', () => {
        const CREATE_SPY = spyOn(component.render, 'createText');
        const APPEND_SPY = spyOn(component.render, 'appendChild');
        component.showMessage();
        expect(CREATE_SPY).toHaveBeenCalled();
        expect(APPEND_SPY).toHaveBeenCalled();
    });
    it('should not add the tag', () => {
        const SPY = spyOn(component.tags, 'push');
        component.addTag(fakeAdd);
        expect(SPY).toHaveBeenCalledTimes(0);
    });
    it('should throw the error and get all the images', () => {
        const ID = 'hello';
        component.connect.deleteImageById = jasmine.createSpy().and.throwError('lelement nexist pas');
        const TEXT = component.render.createText('Aucun dessin ne se trouve sur le serveur');
        component.delete(ID);
        expect(component.text).toEqual(TEXT);
    });
    it('should delete locally the id', () => {
        const ID = '570';
        component.connect.deleteImageById = jasmine.createSpy().and.throwError('lelement nexist pas');
        const SVG_DATA: SVGData = { height: '2500', width: '1080', bgColor: 'white', innerHTML: ['hello', 'hello'] };
        const SVG = component.render.createElement('div');
        const DATA: ShownData = {
            id: '570', svgElement: SVG, name: 'welcome', tags: ['hello', 'new'],
            data: SVG_DATA, width: +SVG_DATA.width, height: +SVG_DATA.height
        };
        component.shownDrawings = [DATA];
        const SPY = spyOn(component.shownDrawings, 'splice');
        component.delete(ID);
        expect(SPY).toHaveBeenCalled();
    });
    it('should not delete locally the id', () => {
        const ID = '170';
        component.connect.deleteImageById = jasmine.createSpy().and.throwError('lelement nexist pas');
        const SVG_DATA: SVGData = { height: '2500', width: '1080', bgColor: 'white', innerHTML: ['hello', 'hello'] };
        const SVG = component.render.createElement('div');
        const DATA: ShownData = {
            id: '570', svgElement: SVG, name: 'welcome', tags: ['hello', 'new'],
            data: SVG_DATA, width: +SVG_DATA.width, height: +SVG_DATA.height
        };
        component.shownDrawings = [DATA];
        const SPY = spyOn(component.shownDrawings, 'splice');
        component.delete(ID);
        expect(SPY).toHaveBeenCalledTimes(0);
    });
    it('should show a message instead of images', () => {
        component.connect.getAllImages = jasmine.createSpy().and.returnValue(of([]));
        const APPEND_SPY = spyOn(component.render, 'appendChild');
        component.getAllImages();
        of([]).subscribe(() => {
            expect(APPEND_SPY).toHaveBeenCalled();
        });
    });
    it('should create an svg and get tags', () => {
        const SVG_DATA: SVGData = { height: '2500', width: '1080', bgColor: 'white', innerHTML: ['hello', 'hello'] };
        const DATA: ImageData = { id: '570', svgElement: SVG_DATA, name: 'welcome', tags: ['hello', 'new'] };
        component.connect.getAllImages = jasmine.createSpy().and.returnValue(of([DATA, DATA]));
        const CREATE_SPY = spyOn(component, 'createSVG');
        const GET_SPY = spyOn(component, 'getAllTags');
        component.getAllImages();
        of([DATA, DATA]).subscribe(() => {
            expect(CREATE_SPY).toHaveBeenCalled();
            expect(GET_SPY).toHaveBeenCalled();
        });
    });
    it('should get all images', () => {
        component.tags = [];
        const GET_SPY = spyOn(component, 'getAllImages');
        component.getImagesByTags();
        expect(GET_SPY).toHaveBeenCalled();
    });
    it(' should show the message that there is no elements with corresponding tags', () => {
        component.tags = ['hello', 'hello'];
        const TEXT = component.render.createText('Aucun dessin correspond a vos critères de recherche');
        component.connect.getImagesByTags = jasmine.createSpy().and.returnValue(of([]));
        component.getImagesByTags();
        of([]).subscribe(() => {
            expect(component.text.textContent).toEqual(TEXT.textContent);
        });
    });
    it('should call create an svg', () => {
        component.tags = ['hello', 'hello'];
        const SVG_DATA: SVGData = { height: '2500', width: '1080', bgColor: 'white', innerHTML: ['hello', 'hello'] };
        const DATA: ImageData = { id: '570', svgElement: SVG_DATA, name: 'welcome', tags: ['hello', 'new'] };
        const SPY = spyOn(component, 'createSVG');
        component.connect.getImagesByTags = jasmine.createSpy().and.returnValues(of([DATA, DATA]));
        component.getImagesByTags();
        of([DATA, DATA]).subscribe(() => {
            expect(SPY).toHaveBeenCalled();
        });
    });
    it('possible tags length should be greater than zero', () => {
        component.possibleTags = [];
        const SVG_DATA: SVGData = { height: '2500', width: '1080', bgColor: 'white', innerHTML: ['hello', 'hello'] };
        const DATA: ImageData = { id: '570', svgElement: SVG_DATA, name: 'welcome', tags: ['hello', 'new'] };
        const DATA_CONTAINER = [DATA];
        component.getAllTags(DATA_CONTAINER);
        expect(component.possibleTags.length).toBeGreaterThan(0);
    });
    it('possible tag length should remain the same', () => {
        component.possibleTags = ['hello'];
        const SVG_DATA: SVGData = { height: '2500', width: '1080', bgColor: 'white', innerHTML: ['hello', 'hello'] };
        const DATA: ImageData = { id: '570', svgElement: SVG_DATA, name: 'welcome', tags: ['hello'] };
        const dataContainer = [DATA];
        component.getAllTags(dataContainer);
        expect(component.possibleTags.length).toEqual(1);
    });
    it('should push the the value in tags container', () => {
        const SPY = spyOn(component.tags, 'push');
        component.selected(fakeEvent);
        expect(SPY).toHaveBeenCalled();
    });
    it('should call continue drawing', () => {
        const SPY = spyOn(component.continueDraw, 'continueDrawing');
        const SVG_DATA: SVGData = { height: '2500', width: '1080', bgColor: 'white', innerHTML: ['hello', 'hello'] };
        component.continueDrawing(SVG_DATA);
        expect(SPY).toHaveBeenCalled();
    });
    it('should create an svg with renderer', () => {
        const SVG_DATA: SVGData = { height: '2500', width: '1080', bgColor: 'white', innerHTML: ['hello', 'hello'] };
        const CREATE_SPY = spyOn(component.render, 'createElement');
        const ATTRIBUTE_SPY = spyOn(component.render, 'setAttribute');
        const APPEND_SPY = spyOn(component.render, 'appendChild');
        component.createSVG(SVG_DATA);
        const NB_CALLS_CREATE = 4;
        const NB_CALLS_ATTR = 5;
        expect(CREATE_SPY).toHaveBeenCalledTimes(NB_CALLS_CREATE);
        expect(ATTRIBUTE_SPY).toHaveBeenCalledTimes(NB_CALLS_ATTR);
        expect(APPEND_SPY).toHaveBeenCalled();
    });
    it('should not add another hash to the background color', () => {
        const SVG_DATA: SVGData = { height: '2500', width: '1080', bgColor: '#ffffff', innerHTML: ['hello', 'hello'] };
        component.createSVG(SVG_DATA);
        expect(SVG_DATA.bgColor).toEqual('#ffffff');
    });
    it('should lower case the value and filter the value from possible tags container', () => {
        const VALUE = 'black';
        const FILTER_SPY = spyOn(component.possibleTags, 'filter');
        component.filter(VALUE);
        expect(FILTER_SPY).toHaveBeenCalled();
    });

    it('should stop event propagation on key down', () => {
        const SPY = spyOn(component, 'blockEvent');
        fixture.debugElement.query(By.css('.gallery')).triggerEventHandler('keydown', {
            key: '0'
        });

        expect(SPY).toHaveBeenCalled();
    });

    it('should call stop propagation when blocking an event', () => {
        const EV = new KeyboardEvent('keydown', {
            key: 'P'
        });

        const SPY = spyOn(EV, 'stopPropagation');
        component.blockEvent(EV);
        expect(SPY).toHaveBeenCalled();
    });

    it('should append child if the g tag is defined', () => {
        spyOn(component.render, 'createElement').and.returnValue({ innerHTML: 'g' });
        component.render.setAttribute = jasmine.createSpy().and.returnValue('');
        const SPY = spyOn(component.render, 'appendChild');
        const TEST_DATA: SVGData = {
            width: '100',
            height: '100',
            bgColor: 'ffffff',
            innerHTML: ['<div>Hello World</div>']
        };
        component.createSVG(TEST_DATA);
        expect(SPY).toHaveBeenCalledTimes(2);

    });

    it('should slice the possible tags array if the tag is undefined', () => {
        const SPY = spyOn(component.possibleTags, 'slice');
        component.addTag(fakeAdd);
        component.tagCtrl.setValue(undefined);
        expect(SPY).toHaveBeenCalled();
    });

    it('should call the filtermethod if the tag is defined', () => {
        const SPY = spyOn(component, 'filter');
        component.addTag(tagAdd);
        component.tagCtrl.setValue(tagAdd);
        expect(SPY).toHaveBeenCalled();
    });
});
