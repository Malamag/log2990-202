import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { menuItems, toolsItems, welcomeItem } from '../../functionality';
import { DrawViewComponent } from './draw-view.component';
import { OptionBarComponent } from './option-bar/option-bar.component';
import { SvgDrawComponent } from './svg-draw/svg-draw.component';
import { ToolAttributesComponent } from './tool-box/tool-attributes/tool-attributes.component';
import { ToolBoxComponent } from './tool-box/tool-box.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
    MatButtonModule,
    MatDialog,
    MatFormFieldModule,
    MatIconModule,
    MatRadioModule,
    MatSliderModule,
    MatToolbarModule,
    MatTooltipModule,
} from '@angular/material';
import { ColorPickerComponent } from '../color-picker/color-picker.component';
import { HttpClientModule } from '@angular/common/http';

describe('DrawViewComponent', () => {
    let component: DrawViewComponent;
    let fixture: ComponentFixture<DrawViewComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [DrawViewComponent, OptionBarComponent, ToolBoxComponent, ToolAttributesComponent, SvgDrawComponent, ColorPickerComponent],
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
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DrawViewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should call dispatch the window', () => {
        const spyObj = spyOn(window, 'dispatchEvent');
        component.adaptWindowSize();
        expect(spyObj).toHaveBeenCalled();
    });
    it('After building the template the reference should be emiited by the observer', () => {
        const objSpy = spyOn(component.interaction, 'emitRef');
        component.ngAfterViewInit();
        expect(component.workingSpaceRef).toBeDefined();
        expect(objSpy).toHaveBeenCalled();
    });
});
