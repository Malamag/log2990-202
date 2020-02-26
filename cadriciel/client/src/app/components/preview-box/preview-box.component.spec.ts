import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgDrawComponent } from '../draw-view/svg-draw/svg-draw.component';
import { PreviewBoxComponent } from './preview-box.component';
import { ElementRef } from '@angular/core';

describe('PreviewBoxComponent', () => {
    let component: PreviewBoxComponent;
    let fixture: ComponentFixture<PreviewBoxComponent>;
    let elementStub: any;
    let nativeElemStub: any;

    beforeEach(async(() => {
        nativeElemStub = {
            appendChild: () => 0,
        };
        elementStub = {
            nativeElement: nativeElemStub,
        };
        TestBed.configureTestingModule({
            declarations: [PreviewBoxComponent, SvgDrawComponent],
            providers: [
                { provide: SVGElement, useValue: {} },
                { provide: ElementRef, useValue: elementStub },
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PreviewBoxComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        component.previewBoxRef = elementStub;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
