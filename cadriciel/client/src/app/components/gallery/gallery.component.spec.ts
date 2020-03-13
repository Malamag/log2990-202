import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { MatAutocompleteModule, MatCardModule, MatChipsModule,
     MatFormFieldModule, MatIconModule, MatInputModule, MatSelectModule,} from '@angular/material';
import { GalleryComponent } from './gallery.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Subject } from 'rxjs';


fdescribe('GalleryComponent', () => {
    let component: GalleryComponent;
    let fixture: ComponentFixture<GalleryComponent>;
    let tagAdd: any;
    let ret: any;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [GalleryComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
            imports:
        [ MatFormFieldModule,
        MatIconModule,
        MatAutocompleteModule,
        MatChipsModule,
        MatCardModule,
        MatSelectModule,
        MatInputModule,
        HttpClientModule,
        BrowserAnimationsModule,
      ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(GalleryComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        tagAdd = {
            input : {
                value: 'hello',
            },
            value: 'hello',
        }
        ret = {
            id: 2,
            name: 'hello',
            svgElement: {
                bgColor: 'hello',
                canvasStyle: 'hello',
                innerHTML: ['hello', 'hello'],
            }
        }
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('should get all the images', () => {
        const SPY = spyOn(component, 'getAllImages');
        component.ngAfterViewInit()
        expect(SPY).toHaveBeenCalled()
    })
    it('should not remove a tag from an empty container', () => {
        const TAG = 'hello' ;
        component.tags = [];
        const SPY = spyOn(component.tags, 'splice');
        component.removeTag(TAG);
        expect(SPY).toHaveBeenCalledTimes(0); 
    })
    it('should remove the tag', () => {
        const TAG = 'hello' ;
        component.tags = ['hello'];
        const SPY = spyOn(component.tags, 'splice');
        component.removeTag(TAG);
        expect(SPY).toHaveBeenCalled();
    })
    it('should add the value and should empty the input value', () => {
        const spy = spyOn(component.tagCtrl, 'setValue');
        component.addTag(tagAdd);
        expect(spy).toHaveBeenCalled()
        expect(tagAdd.input.value).toEqual(' ')
        expect(component.tags.length).toBeGreaterThan(0);
    })
    it('should call renderer functions', () => {
        const createSpy = spyOn(component.render, 'createText');
        const appendSpy = spyOn(component.render, 'appendChild');
        component.showMessage()
        expect(createSpy).toHaveBeenCalled()
        expect(appendSpy).toHaveBeenCalled()
    })
    it('should throw the error and get all the images', () =>{
        const id = 'hello';
        component.index.deleteImageById = jasmine.createSpy().and.throwError('lelement nexist pas');
        const spy = spyOn(component, 'getAllImages')
        const text = component.render.createText("l'élément ne peut pas être effacé car il n'existe pas sur le serveur")
        component.delete(id);
        expect(spy).toHaveBeenCalled()
        expect(component.text).toEqual(text)
    })
    it('should show a message instead of images', () => {
        const obs = new Subject<ImageData[]>()
        const observable = obs.asObservable()
        obs.next([])
        component.index.getAllImages = jasmine.createSpy().and.returnValue(observable)
        const appendSpy = spyOn(component.render, 'appendChild')
        component.getAllImages()
        expect(appendSpy).toHaveBeenCalled()
    })
    it('should create an svg and get tags', () => {
        const obs = new Subject<ImageData[]>()
        const observable = obs.asObservable()
        obs.next([ret, ret])
        component.index.getAllImages = jasmine.createSpy().and.returnValue(observable);
        const createSpy = spyOn(component, 'createSVG');
        const getSpy = spyOn(component, 'getAllTags');
        component.getAllImages();
        expect(createSpy).toHaveBeenCalled();
        expect(getSpy).toHaveBeenCalled();
    })
});
