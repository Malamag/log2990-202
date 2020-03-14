import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
    MatButtonModule,
    MatDialog,
    MatIconModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatToolbarModule,
    MatTooltipModule,
} from '@angular/material';

import { E, G, O } from '@angular/cdk/keycodes';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { GridRenderService } from 'src/app/services/grid/grid-render.service';
import { KeyboardHandlerService } from 'src/app/services/keyboard-handler/keyboard-handler.service';
import { InteractionService } from 'src/app/services/service-interaction/interaction.service';
import { ModalWindowService } from 'src/app/services/window-handler/modal-window.service';
import { ExportFormComponent } from '../../export-form/export-form.component';
import { NewDrawComponent } from '../../new-draw/new-draw.component';
import { OptionBarComponent } from './option-bar.component';

describe('OptionBarComponent', () => {
    let component: OptionBarComponent;
    let fixture: ComponentFixture<OptionBarComponent>;
    // tslint:disable-next-line: no-any
    let winServiceStub: any;
    let kbService: KeyboardHandlerService;
    // tslint:disable-next-line: no-any
    let fakeKbEvent: any;
    // tslint:disable-next-line: no-any
    let gridRenderStub: any;

    beforeEach(async(() => {
        winServiceStub = {
            openWindow: () => 0,
        };
        gridRenderStub = {
            updateSpacing: () => 0,
            toggleGridVisibility: (show: boolean) => 0,
            updateTransparency: () => 0,
        };
        // that way, we will make sure the event corresponds to the handler's expectations
        fakeKbEvent = {
            ctrlKey: true,
            keyCode: 79,
            key: 'o',
            shiftKey: false,
            preventDefault: () => 0,
        };

        TestBed.configureTestingModule({
            declarations: [OptionBarComponent],
            imports: [MatButtonModule, MatToolbarModule, MatIconModule, MatTooltipModule, MatSlideToggleModule, MatSliderModule],
            providers: [
                { provide: MatDialog },
                { provide: ModalWindowService, useValue: winServiceStub },
                { provide: kbService, useValue: KeyboardHandlerService },
                { provide: KeyboardEvent, useValue: fakeKbEvent },
                { provide: GridRenderService, useValue: gridRenderStub },
            ],
            schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();

        window.confirm = () => true; // skips the confirmation box for the test
        kbService = TestBed.get(KeyboardHandlerService);
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(OptionBarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should add observers on construction', () => {
        window.addEventListener = jasmine.createSpy().and.callThrough();
        const TEST_SERVICE = new OptionBarComponent(winServiceStub, new InteractionService(), new KeyboardHandlerService(), gridRenderStub);
        expect(TEST_SERVICE).toBeTruthy();
        expect(window.addEventListener).toHaveBeenCalled();
    });

    it('should open the new form modal window on ctrl+o', () => {
        fakeKbEvent.keyCode = O; // ctrldown already true
        const spy = spyOn(component, 'openNewDrawForm');
        component.setShortcutEvent(fakeKbEvent);
        expect(spy).toHaveBeenCalled();
    });

    it('should open a modal window for the user guide', () => {
        component.winService.openWindow = () => 0; // fake window opener
        const spy = spyOn(component.winService, 'openWindow');
        component.openUserGuide();
        expect(spy).toHaveBeenCalled();
    });

    it('should emit a boolean using the observer', () => {
        const spy = spyOn(component.interaction, 'emitCancel');
        component.sendSigKill();
        expect(spy).toHaveBeenCalled();
    });

    it('should open a modal for the new draw form window', () => {
        const spyObj: jasmine.SpyObj<OptionBarComponent> = jasmine.createSpyObj('OptionBarComponent', ['openNewDrawForm']);
        spyObj.openNewDrawForm.and.callFake(() => {
            component.winService.openWindow(NewDrawComponent); //  to skip the confirm window
        });
        const spy = spyOn(component.winService, 'openWindow');
        component.openNewDrawForm();
        expect(spy).toHaveBeenCalled();
    });

    it('should call a new draw form on shortcut', () => {
        const spy = spyOn(component, 'openNewDrawForm');
        component.setShortcutEvent(fakeKbEvent);
        expect(spy).toHaveBeenCalled();
    });

    it('should open a modal for the export form window', () => {
        const spyObj: jasmine.SpyObj<OptionBarComponent> = jasmine.createSpyObj('OptionBarComponent', ['openExportForm']);
        spyObj.openExportForm.and.callFake(() => {
            component.winService.openWindow(ExportFormComponent); //  to skip the confirm window
        });
        const spy = spyOn(component.winService, 'openWindow');
        component.openNewDrawForm();
        expect(spy).toHaveBeenCalled();
    });

    it('should not open the new draw form on negative confimation', () => {
        window.confirm = jasmine.createSpy().and.returnValue(false);

        const spy = spyOn(component.winService, 'openWindow');
        component.openNewDrawForm();
        expect(spy).not.toHaveBeenCalled();
    });

    it('should open the new draw form on positive confimation', () => {
        window.confirm = jasmine.createSpy().and.returnValue(true);

        const spy = spyOn(component.winService, 'openWindow');
        component.openNewDrawForm();
        expect(spy).toHaveBeenCalled();
    });

    it('should call the window handler method to open the export form', () => {
        const spy = spyOn(component.winService, 'openWindow');
        component.openExportForm();
        expect(spy).toHaveBeenCalled();
    });

    it('should call grid toggle when G is pressed', () => {
        fakeKbEvent.keyCode = G;
        const spy = spyOn(component, 'toggleGrid');
        component.setShortcutEvent(fakeKbEvent);
        expect(spy).toHaveBeenCalled();
    });

    it('should open the exportationForm on ctrl+e', () => {
        fakeKbEvent.keyCode = E; // ctrldown already true
        const spy = spyOn(component, 'openExportForm');
        component.setShortcutEvent(fakeKbEvent);
        expect(spy).toHaveBeenCalled();
    });

    it('should call the grid spacing update with proper increment when numpad PLUS is pressed', () => {
        const NUMPAD_PLUS = 107;
        fakeKbEvent.keyCode = NUMPAD_PLUS;
        const BASE_VAL = 10;
        component.stepVal = BASE_VAL;
        const SPACE_ADD = 5;

        const spy = spyOn(component.gridService, 'updateSpacing');
        component.setShortcutEvent(fakeKbEvent);
        expect(spy).toHaveBeenCalled();
        expect(component.stepVal).toEqual(BASE_VAL + SPACE_ADD);
    });

    it('should call the grid spacing update with proper decrement when numpad MINUS is pressed', () => {
        const NUMPAD_MINUS = 109;
        fakeKbEvent.keyCode = NUMPAD_MINUS;
        const BASE_VAL = 30;
        component.stepVal = BASE_VAL;
        const SPACE_MINUS = 5;

        const spy = spyOn(component.gridService, 'updateSpacing');
        component.setShortcutEvent(fakeKbEvent);
        expect(spy).toHaveBeenCalled();
        expect(component.stepVal).toEqual(BASE_VAL - SPACE_MINUS);
    });

    it('should call the grid spacing update when shift and dash are pressed (- sign)', () => {
        fakeKbEvent.shiftKey = true;
        const DASH = 189;
        fakeKbEvent.keyCode = DASH;
        const BASE_VAL = 30;
        component.stepVal = BASE_VAL;
        const spy = spyOn(component.gridService, 'updateSpacing');
        component.setShortcutEvent(fakeKbEvent);
        expect(spy).toHaveBeenCalled();
    });

    it('should call the grid spacing update when shift and equal are pressed (+ sign)', () => {
        fakeKbEvent.shiftKey = true;
        const EQUAL = 187;
        fakeKbEvent.keyCode = EQUAL;
        const BASE_VAL = 30;
        component.stepVal = BASE_VAL;
        const spy = spyOn(component.gridService, 'updateSpacing');
        component.setShortcutEvent(fakeKbEvent);
        expect(spy).toHaveBeenCalled();
    });

    it('should not allow increments when max spacing is reached', () => {
        // maximum is set at 90 in the component
        const VALUE = 90;
        component.stepVal = VALUE;
        const NUMPAD_PLUS = 107;
        fakeKbEvent.keyCode = NUMPAD_PLUS;
        const spy = spyOn(component.gridService, 'updateSpacing');
        component.setShortcutEvent(fakeKbEvent);
        expect(spy).not.toHaveBeenCalled();
    });

    it('should not allow decrements when min spacing is reached', () => {
        // minimum is set at 10 in the component
        const VALUE = 10;
        component.stepVal = VALUE;
        const NUMPAD_MINUS = 109;
        fakeKbEvent.keyCode = NUMPAD_MINUS;
        const spy = spyOn(component.gridService, 'updateSpacing');
        component.setShortcutEvent(fakeKbEvent);
        expect(spy).not.toHaveBeenCalled();
    });

    it('should toggle the grid boolean and call the service toggle method', () => {
        component.gridSelected = true;
        const spy = spyOn(component.gridService, 'toggleGridVisibility');
        component.toggleGrid();
        expect(component.gridSelected).toBeFalsy();
        expect(spy).toHaveBeenCalledWith(false);
    });

    it('should call the grid service spacing update', () => {
        const spy = spyOn(component.gridService, 'updateSpacing');
        const VAL = 50;
        component.stepVal = VAL;
        component.updateSpacing();
        expect(spy).toHaveBeenCalledWith(VAL);
    });

    it('should call the grid service alpha update', () => {
        const spy = spyOn(component.gridService, 'updateTransparency');
        const ALPHA_VAL = 50;
        component.alphaVal = ALPHA_VAL;
        component.updateAlpha();
        expect(spy).toHaveBeenCalledWith(ALPHA_VAL);
    });

    it('should set the shortcut on keyboard event', () => {
        const spy = spyOn(component, 'setShortcutEvent');
        const TEST_COMPONENT = new OptionBarComponent(winServiceStub, new InteractionService(), kbService, gridRenderStub);
        window.dispatchEvent(new KeyboardEvent('keydown'));
        expect(TEST_COMPONENT).toBeTruthy();
        expect(spy).toHaveBeenCalled();
    });

    it('should not open the galley when user chooses to cancel action', () => {
        window.confirm = jasmine.createSpy().and.returnValue(false); // cancel action
        const spy = spyOn(component.winService, 'openWindow');
        component.openGallery();
        expect(spy).not.toHaveBeenCalled();
    });
});
