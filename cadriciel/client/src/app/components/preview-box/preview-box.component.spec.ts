import { async, TestBed } from '@angular/core/testing';
import { PreviewBoxComponent } from './preview-box.component';
import { Renderer2, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ExportFormComponent } from '../export-form/export-form.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

describe('PreviewBoxComponent', () => {
    let component: PreviewBoxComponent;
    //  let fixture: ComponentFixture<PreviewBoxComponent>;
    let rdStub: any;
    beforeEach(async(() => {
        rdStub = {};
        TestBed.configureTestingModule({
            declarations: [PreviewBoxComponent, ExportFormComponent],
            imports: [ReactiveFormsModule, FormsModule],
            providers: [{ provide: Renderer2, useValue: rdStub }],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
    }));

    beforeEach(() => {
        // fixture = TestBed.createComponent(PreviewBoxComponent);
        // component = fixture.componentInstance;
        // console.log(component);
        //  fixture.detectChanges();
    });

    it('should create', () => {
        component = new PreviewBoxComponent(rdStub);
        expect(component).toBeTruthy();
    });
});
