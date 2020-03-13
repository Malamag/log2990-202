import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { MatAutocompleteModule, MatCardModule, MatChipsModule,
     MatFormFieldModule, MatIconModule, MatInputModule, MatSelectModule,} from '@angular/material';
import { GalleryComponent } from './gallery.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


fdescribe('GalleryComponent', () => {
    let component: GalleryComponent;
    let fixture: ComponentFixture<GalleryComponent>;
    let tagAdd: any;
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
            input : 'hello',
            value: 'hello',
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
    it('')
});
