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
        const spyObj = spyOn(component.interaction, 'emitFormsAttributes');
        component.updateForms();
        expect(spyObj).toHaveBeenCalled();
    });

    it('should emit line attributes', () => {
        const spyObj = spyOn(component.interaction, 'emitLineAttributes');
        component.updateLine();
        expect(spyObj).toHaveBeenCalled();
    });

    it('should emit tools attributes', () => {
        const spyObj = spyOn(component.interaction, 'emitToolsAttributes');
        component.updateTools();
        expect(spyObj).toHaveBeenCalled();
    });

    it('should dispatch the window', () => {
        const spyObj = spyOn(window, 'dispatchEvent');
        component.resize();
        expect(spyObj).toHaveBeenCalled();
    });

    it('should call update functions', () => {
        const formsSpy = spyOn(component, 'updateForms');
        const toolsSpy = spyOn(component, 'updateTools');
        const lineSpy = spyOn(component, 'updateLine');
        component.ngAfterViewInit();
        expect(formsSpy).toHaveBeenCalled();
        expect(toolsSpy).toHaveBeenCalled();
        expect(lineSpy).toHaveBeenCalled();
    });

    it('should select tool', () => {
        component.interaction.emitSelectedTool('Rectangle');

        expect(component.selectedTool).toBe('Rectangle');
    });

    it('should not select tool', () => {
        const interactionStub = new InteractionService();
        interactionStub.emitSelectedTool('Ellipse');
        const componentStub = new ToolAttributesComponent(interactionStub);
        componentStub.ngOnInit();

        expect(componentStub.selectedTool).toBe('Crayon');
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
        const spy = spyOn(component.interaction, 'emitAerosolAttributes');
        component.updateAerosol();
        expect(spy).toHaveBeenCalled();
    });

    it('should not set the selected tool if it doesnt exist', () => {
        const DEF = 'Crayon';
        const BAD_TOOL = 'Ciseaux';
        component.interaction.emitSelectedTool(BAD_TOOL);
        component.ngOnInit();

        expect(component.selectedTool).toEqual(DEF);
    });
});
