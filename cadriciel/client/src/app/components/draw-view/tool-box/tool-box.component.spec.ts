import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Z } from '@angular/cdk/keycodes';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import {
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatRadioModule,
    MatSliderModule,
    MatToolbarModule,
    MatTooltipModule,
} from '@angular/material';
import { ColorPickerComponent } from '../../color-picker/color-picker.component';
import { ToolBoxComponent } from './tool-box.component';

describe('ToolBoxComponent', () => {
    let component: ToolBoxComponent;
    let fixture: ComponentFixture<ToolBoxComponent>;
    // tslint:disable-next-line: no-any
    let kbEventStub: any;
    beforeEach(async(() => {
        kbEventStub = {
            ctrlKey: true,
            keyCode: Z,
            shiftKey: true,
            key: 'c'
        };

        TestBed.configureTestingModule({
            declarations: [ToolBoxComponent, ColorPickerComponent],
            imports: [
                MatIconModule,
                MatButtonModule,
                MatTooltipModule,
                MatToolbarModule,
                MatSliderModule,
                MatFormFieldModule,
                MatRadioModule,
                FormsModule,
                HttpClientModule,
            ],
            providers: [
                { provide: KeyboardEvent, useValue: kbEventStub }
            ]
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
        const SPY_OBJ = spyOn(component.interactionService, 'emitSelectedTool');
        const NAME = 'Rectangle';
        component.buttonAction(NAME);
        expect(SPY_OBJ).toHaveBeenCalled();
    });

    // this test fail I dont know why
    it('should call buttonAction following a good key from the keyboardEvent', () => {
        const SPY = spyOn(component, 'buttonAction');
        const MOCK_KEY = new KeyboardEvent('keyup', {
            key: '1',
        });
        component.updateBoard(MOCK_KEY);
        expect(SPY).toHaveBeenCalled();
    });

    it('should not call buttonAction', () => {
        const MOCK_KEY = new KeyboardEvent('keyup', {
            key: 'r',
        });
        component.updateBoard(MOCK_KEY);
        const SPY_OBJ = spyOn(component, 'buttonAction');
        expect(SPY_OBJ).toHaveBeenCalledTimes(0);
    });

    it('should call button action when ctrl+shift+z keys are pressed', () => {
        const SPY = spyOn(component, 'buttonAction');
        component.updateBoard(kbEventStub);
        expect(SPY).toHaveBeenCalled();
    });

    it('should call button action when ctrl+z keys are pressed', () => {
        kbEventStub.shiftKey = false;
        const SPY = spyOn(component, 'buttonAction');
        component.updateBoard(kbEventStub);
        expect(SPY).toHaveBeenCalled();
    });

    it('should call button action for a tool selection if ctrl+z are not pressed', () => {
        kbEventStub.ctrlKey = false;
        const SPY = spyOn(component, 'buttonAction');
        component.updateBoard(kbEventStub);
        expect(SPY).toHaveBeenCalled();
    });

    it('should not call button action on invalid key', () => {
        kbEventStub.ctrlKey = false;
        kbEventStub.key = 'p';
        const SPY = spyOn(component, 'buttonAction');
        component.updateBoard(kbEventStub);
        expect(SPY).not.toHaveBeenCalled();
    });

    it('should disable the undo/redo buttons on subscription activation', () => {

        const DISABLED_BTNS = [true, false];

        component.ngOnInit();
        component.interactionService.emitEnableDisable(DISABLED_BTNS);
        expect(component.disableUndo).toBeTruthy();
        expect(component.disableRedo).toBeFalsy();
    });

});
