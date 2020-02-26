import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PreviewBoxComponent } from './preview-box.component';
import { ElementRef } from '@angular/core';

describe('PreviewBoxComponent', () => {
    let component: PreviewBoxComponent;
    let fixture: ComponentFixture<PreviewBoxComponent>;
    let elementStub: any;
    let nativeElemStub: any;
    beforeEach(async(() => {
        nativeElemStub = {
            toDataURL: (data: string) => 0,
            getContext: (ctx: string) => 2, // true in an if-clause
        };
        elementStub = {
            nativeElement: nativeElemStub,
        };
        TestBed.configureTestingModule({
            declarations: [PreviewBoxComponent],
            providers: [
                { provide: ElementRef, useValue: elementStub },
                { provide: SVGElement, useValue: nativeElemStub },
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PreviewBoxComponent);

        component = fixture.componentInstance;

        fixture.detectChanges();
    });

    it('should create', () => {
        console.log(component.draw);
        expect(component).toBeTruthy();
        console.log(component.previewBoxRef.nativeElement);
    });
});
