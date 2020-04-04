import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatDialog,
     MatFormFieldModule, MatIconModule,
      MatRadioModule, MatSliderModule, MatToolbarModule,
       MatTooltipModule } from '@angular/material';
import { RouterTestingModule } from '@angular/router/testing';
import { menuItems, toolsItems, welcomeItem } from '../../functionality';
import { ColorPickerComponent } from '../color-picker/color-picker.component';
import { DrawViewComponent } from './draw-view.component';
import { OptionBarComponent } from './option-bar/option-bar.component';
import { SvgDrawComponent } from './svg-draw/svg-draw.component';
import { ToolAttributesComponent } from './tool-box/tool-attributes/tool-attributes.component';
import { ToolBoxComponent } from './tool-box/tool-box.component';

describe('DrawViewComponent', () => {
    let component: DrawViewComponent;
    let fixture: ComponentFixture<DrawViewComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                DrawViewComponent,
                OptionBarComponent,
                ToolBoxComponent,
                ToolAttributesComponent,
                SvgDrawComponent,
                ColorPickerComponent,
            ],
            providers: [{ provide: menuItems, toolsItems, welcomeItem }, { provide: MatDialog }],
            imports: [
                MatButtonModule,
                MatTooltipModule,
                MatIconModule,
                MatToolbarModule,
                MatSliderModule,
                FormsModule,
                MatFormFieldModule,
                ReactiveFormsModule,
                MatRadioModule,
                HttpClientModule,
                RouterTestingModule,
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DrawViewComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should call dispatch the window', () => {
        const SPY_OBJ = spyOn(window, 'dispatchEvent');
        component.adaptWindowSize();
        expect(SPY_OBJ).toHaveBeenCalled();
    });
    it('After building the template the reference should be emiited by the observer', () => {
        const OBJ_SPY = spyOn(component.interaction, 'emitRef');
        component.ngAfterViewInit();
        expect(component.workingSpaceRef).toBeUndefined();
        expect(OBJ_SPY).toHaveBeenCalled();
    });
});
