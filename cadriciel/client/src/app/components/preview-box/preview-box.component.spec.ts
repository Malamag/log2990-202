import { CUSTOM_ELEMENTS_SCHEMA, Renderer2 } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ExportFormComponent } from '../export-form/export-form.component';
import { PreviewBoxComponent } from './preview-box.component';

fdescribe('PreviewBoxComponent', () => {
    let component: PreviewBoxComponent;
    let fixture: ComponentFixture<PreviewBoxComponent>;
    // tslint:disable-next-line: no-any
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

    it('should scale down the height according to the users screen size', () => {
        const TEST_SCALE = 4;

        const TEST_H = 800;
        component.svgH = TEST_H;

        const SCREEN_H = window.innerHeight;

        component.scaleSVG(TEST_SCALE);

        /* The division may give a result containing decimals. */
        expect(Math.abs(component.svgH - (SCREEN_H / TEST_SCALE))).toBeLessThanOrEqual(1);

    });

    it('should scale down the width to preserve the screen ratio', () => {
        const TEST_SCALE = 4;

        const TEST_H = 800; // Large doodle dimensions
        const TEST_W = 1200;

        component.svgH = TEST_H;
        component.svgW = TEST_W;

        const W_LIMIT = window.innerWidth / TEST_SCALE;

        component.scaleSVG(TEST_SCALE);

        expect(component.svgW).toBeLessThanOrEqual(W_LIMIT);
    });

});
