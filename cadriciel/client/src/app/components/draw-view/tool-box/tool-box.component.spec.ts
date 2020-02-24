import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import {
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatRadioModule,
    MatSliderModule,
    MatToolbarModule,
    MatTooltipModule,
} from '@angular/material';
import { ToolBoxComponent } from './tool-box.component';
import { ColorPickerComponent } from '../../color-picker/color-picker.component';

describe('ToolBoxComponent', () => {
    let component: ToolBoxComponent;
    let fixture: ComponentFixture<ToolBoxComponent>;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ToolBoxComponent, ColorPickerComponent],
            imports: [MatIconModule, MatButtonModule, MatTooltipModule, MatToolbarModule, MatSliderModule, MatFormFieldModule, MatRadioModule],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ToolBoxComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should emit a name with the interaction service', () => {
        const component = TestBed.createComponent(ToolBoxComponent).componentInstance;
        const spyObj = spyOn(component.interactionService, 'emitSelectedTool');
        const name = 'Rectangle';
        component.buttonAction(name);
        expect(spyObj).toHaveBeenCalled();
    });

    // this test fail I dont know why
    it('should call buttonAction following a good key from the keyboardEvent', () => {
        const component = TestBed.createComponent(ToolBoxComponent).componentInstance;
        const spy = spyOn(component, 'buttonAction');
        const mockKey = new KeyboardEvent('keyup', {
            key: '1',
        });
        component.updateBoard(mockKey);
        expect(spy).toHaveBeenCalled();
    });
    it('should not call buttonAction', () => {
        const component = TestBed.createComponent(ToolBoxComponent).componentInstance;
        const mockKey = new KeyboardEvent('keyup', {
            key: 'r',
        });
        component.updateBoard(mockKey);
        const spyObj = spyOn(component, 'buttonAction');
        expect(spyObj).toHaveBeenCalledTimes(0);
    });
});
