import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatOptionModule, MatSelectModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ExportFormComponent } from './export-form.component';

import { DoodleFetchService } from 'src/app/services/doodle-fetch/doodle-fetch.service';
import { SvgDrawComponent } from '../draw-view/svg-draw/svg-draw.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ExportService } from 'src/app/services/exportation/export.service';
import { ImageFilterService } from 'src/app/services/exportation/image-filter/image-filter.service';
import { ModalWindowService } from 'src/app/services/window-handler/modal-window.service';

describe('ExportFormComponent', () => {
    let component: ExportFormComponent;
    let fixture: ComponentFixture<ExportFormComponent>;
    let dFetchStub: any;
    let expService: ExportService;
    let imgFilterService: ImageFilterService;
    let winService: ModalWindowService;

    beforeEach(async(() => {
        dFetchStub = {
            askForDoodle: () => 0,
            getDrawing: () => 0,
        };

        TestBed.configureTestingModule({
            declarations: [ExportFormComponent, SvgDrawComponent],
            imports: [
                MatDialogModule,
                MatFormFieldModule,
                ReactiveFormsModule,
                FormsModule,
                BrowserAnimationsModule,
                MatInputModule,
                MatButtonModule,
                MatDialogModule,
                MatOptionModule,
                MatSelectModule,
            ],
            providers: [{ provide: DoodleFetchService, useValue: dFetchStub }, ExportService, ImageFilterService, ModalWindowService],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
    }));

    beforeEach(() => {
        dFetchStub.askForDoodle();
        fixture = TestBed.createComponent(ExportFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        expService = TestBed.get(ExportService);
        winService = TestBed.get(ModalWindowService);
        imgFilterService = TestBed.get(ImageFilterService);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should build the form on initialisation', () => {
        const spy = spyOn(component, 'initForm');
        component.ngOnInit();
        expect(spy).toHaveBeenCalled();
    });

    /* it('should ask for doodle on initialisation', () => {
        const spy = spyOn(dFetchStub, 'askForDoodle');
        component.ngOnInit();
        expect(spy).toHaveBeenCalled();
    });*/

    it('should create an export form with formbuilder', () => {
        component.initForm();
        expect(component.initForm).toBeDefined();
    });

    it('should initialize the doodle after content init', () => {
        component.ngAfterContentInit();
        expect(component.doodle).toBeDefined();
    });

    it('should call the exportation method on submission', () => {
        const spy = spyOn(component, 'exportation');
        /*const SUB_BTN: HTMLButtonElement = fixture.debugElement.query(By.css('button[type=submit]')).nativeElement;
        SUB_BTN.click();*/
        component.onSubmit();
        expect(spy).toHaveBeenCalled();
    });

    it('should close the form after submission', () => {
        const spy = spyOn(component, 'closeForm');
        component.exportation = () => 0;
        component.onSubmit();
        expect(spy).toHaveBeenCalled();
    });

    it('should disable the export button on invalid inputs', () => {
        // by default, the export type is undefined --> invalid
        const spy = spyOn(component, 'onSubmit');
        const SUB_BTN: HTMLButtonElement = fixture.debugElement.query(By.css('button[type=submit]')).nativeElement;

        SUB_BTN.click();
        expect(spy).not.toHaveBeenCalled();
    });

    it('should call the canavs exportation method from ExportationService', () => {
        const spy = spyOn(expService, 'exportInCanvas');
        const FAKE_NAME = 'monDessin';
        const FAKE_TYPE = 'png';
        component.exportation(FAKE_NAME, FAKE_TYPE);
        expect(spy).toHaveBeenCalled();
    });

    it('should close the window on cancel click', () => {
        const CANCEL_BTN: HTMLButtonElement = fixture.debugElement.query(By.css('#quitButton')).nativeElement;
        const spy = spyOn(component, 'closeForm');
        CANCEL_BTN.click();
        expect(spy).toHaveBeenCalled();
    });

    it('should close the form on cancel using the window service', () => {
        const spy = spyOn(winService, 'closeWindow');
        component.closeForm();
        expect(spy).toHaveBeenCalled();
    });

    it('shoud toggle the filter application on click', () => {
        const FILTER_NUM = 1;
        const spy = spyOn(imgFilterService, 'toggleFilter');
        component.applyFilter(FILTER_NUM);
        expect(spy).toHaveBeenCalled();
    });
});
