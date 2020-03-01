import { async, TestBed, ComponentFixture } from '@angular/core/testing';
import { PreviewBoxComponent } from './preview-box.component';
import { Renderer2, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ExportFormComponent } from '../export-form/export-form.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

describe('PreviewBoxComponent', () => {
    let component: PreviewBoxComponent;
    let fixture: ComponentFixture<PreviewBoxComponent>;
    let rdStub: any;
    beforeEach(async(() => {
        rdStub = {
            appendChild: () => 0,
        };
        TestBed.configureTestingModule({
            declarations: [PreviewBoxComponent, ExportFormComponent],
            imports: [ReactiveFormsModule, FormsModule],
            providers: [{ provide: Renderer2, useValue: rdStub }],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PreviewBoxComponent);
        component = fixture.componentInstance;
        component.render = rdStub;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should scale the svg on initialisation', () => {
        const spy = spyOn(component, 'scaleSVG');
        component.ngOnInit();
        expect(spy).toHaveBeenCalled();
    });

    it('should initialize the preview box after getting a reference to the svg', () => {
        const spy = spyOn(component.render, 'appendChild');
        component.ngAfterViewInit();
        expect(spy).toHaveBeenCalledWith(component.previewBoxRef.nativeElement, component.draw);
    });
});
