import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule, MatIconModule, MatRadioModule, MatSliderModule, MatToolbarModule } from '@angular/material';
import { ColorPickerComponent } from '../../../color-picker/color-picker.component';
import { ToolAttributesComponent } from './tool-attributes.component';

import { InteractionService } from 'src/app/services/service-interaction/interaction.service';

describe('ToolAttributesComponent', () => {
    let component: ToolAttributesComponent;
    let fixture: ComponentFixture<ToolAttributesComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ToolAttributesComponent, ColorPickerComponent],
            // providers:[{provide: InteractionService, useValue:interactionStub}],
            imports: [
                MatSliderModule,
                FormsModule,
                MatIconModule,
                MatToolbarModule,
                MatSliderModule,
                ReactiveFormsModule,
                MatFormFieldModule,
                MatRadioModule,
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ToolAttributesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should subscribe to the tools on init and select a default', () => {
        const TOOL = 'Crayon';
        component.interaction.emitSelectedTool(TOOL);
        component.ngOnInit();
        expect(component.selectedTool).toEqual(TOOL);
    });

    it('should emit forms attributes', () => {
        const SPY_OBJ = spyOn(component.interaction, 'emitFormsAttributes');
        component.updateForms();
        expect(SPY_OBJ).toHaveBeenCalled();
    });

    it('should emit line attributes', () => {
        const SPY_OBJ = spyOn(component.interaction, 'emitLineAttributes');
        component.updateLine();
        expect(SPY_OBJ).toHaveBeenCalled();
    });

    it('should emit tools attributes', () => {
        const SPY_OBJ = spyOn(component.interaction, 'emitToolsAttributes');
        component.updateTools();
        expect(SPY_OBJ).toHaveBeenCalled();
    });

    it('should dispatch the window', () => {
        const SPY_OBJ = spyOn(window, 'dispatchEvent');
        component.resize();
        expect(SPY_OBJ).toHaveBeenCalled();
    });

    it('should call update functions', () => {
        const FORM_SPY = spyOn(component, 'updateForms');
        const TOOL_SPY = spyOn(component, 'updateTools');
        const LINE_SPY = spyOn(component, 'updateLine');
        component.ngAfterViewInit();
        expect(FORM_SPY).toHaveBeenCalled();
        expect(TOOL_SPY).toHaveBeenCalled();
        expect(LINE_SPY).toHaveBeenCalled();
    });

    it('should select tool', () => {
        component.interaction.emitSelectedTool('Rectangle');

        expect(component.selectedTool).toBe('Rectangle');
    });

    it('should not select tool', () => {
        const INTERACTION_STUB = new InteractionService();
        INTERACTION_STUB.emitSelectedTool('Ellipse');
        const COMPONENT_STUB = new ToolAttributesComponent(INTERACTION_STUB);
        COMPONENT_STUB.ngOnInit();

        expect(COMPONENT_STUB.selectedTool).toBe('Crayon');
    });

    it('selectedTool should be rectangle', () => {
        component.interaction.emitSelectedTool('Rectangle');
        component.ngOnInit();
        expect(component.selectedTool).toBe('Rectangle');
    });

    it('should change the pipette preview fill in the subscription', () => {
        const COLOR_TEST = '#fffffff';
        component.interaction.emitPreviewColor(COLOR_TEST);
        component.ngOnInit(); // initializes the subscription

        expect(component.pipettePreviewFill).toEqual(COLOR_TEST);
    });

    it('should emit the aerosol attributes on update', () => {
        const SPY = spyOn(component.interaction, 'emitAerosolAttributes');
        component.updateAerosol();
        expect(SPY).toHaveBeenCalled();
    });

    it('should not set the selected tool if it doesnt exist', () => {
        const DEF = 'Crayon';
        const BAD_TOOL = 'Ciseaux';
        component.interaction.emitSelectedTool(BAD_TOOL);
        component.ngOnInit();

        expect(component.selectedTool).toEqual(DEF);
    });
});
