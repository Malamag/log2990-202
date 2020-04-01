import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { colorData } from '../color-data';
import { MiniColorPickerComponent } from './mini-color-picker.component';
describe('MiniColorPickerComponent', () => {
    let component: MiniColorPickerComponent;
    let fixture: ComponentFixture<MiniColorPickerComponent>;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [MiniColorPickerComponent],
            imports: [FormsModule]
        }).compileComponents();

    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MiniColorPickerComponent);
        component = fixture.componentInstance;
        component.cData = colorData;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should emit a color', () => {
        const SPY = spyOn(component, 'emitColor');
        component.ngOnInit();
        expect(SPY).toHaveBeenCalled();
    });

    it('should set the hue selector to true and to call the hueSelect', () => {
        const SPY = spyOn(component, 'hueSelect');
        const MOUSE_EVENT = new MouseEvent('mouseDown');
        component.onMouseDownHue(MOUSE_EVENT);
        expect(component.isHueSelecting).toBeTruthy();
        expect(SPY).toHaveBeenCalled();
    });

    it('should set the SV selector to true and to call the svSelect', () => {
        const SPY = spyOn(component, 'svSelect');
        const MOUSE_EVENT = new MouseEvent('mouseDown');
        component.onMouseDownSV(MOUSE_EVENT);
        expect(component.isSVSelecting).toBeTruthy();
        expect(SPY).toHaveBeenCalled();
    });

    it('should set the selectiong attributes to false', () => {
        component.onMouseUp();
        expect(component.isSVSelecting).toBeFalsy();
        expect(component.isHueSelecting).toBeFalsy();
    });

    it('hue select should not call set Color', () => {
        const SPY = spyOn(component, 'setColor');
        component.isHueSelecting = false;
        const MOUSE_EVENT = new MouseEvent('mouseDown');
        component.hueSelect(MOUSE_EVENT);
        expect(SPY).toHaveBeenCalledTimes(0);
    });

    it('hue select should call set color ', () => {
        const SPY = spyOn(component, 'setColor');
        component.isHueSelecting = true;
        const MOUSE_EVENT = new MouseEvent('mouseDown');
        component.hueSelect(MOUSE_EVENT);
        expect(SPY).toHaveBeenCalled();
    });
    it('sv select should not call set Color', () => {
        const SPY = spyOn(component, 'setColor');
        component.isSVSelecting = false;
        const MOUSE_EVENT = new MouseEvent('mouseDown');
        component.svSelect(MOUSE_EVENT);
        expect(SPY).toHaveBeenCalledTimes(0);
    });

    it('sv select should call set color ', () => {
        const SPY = spyOn(component, 'setColor');
        component.isSVSelecting = true;
        const MOUSE_EVENT = new MouseEvent('mouseDown');
        component.svSelect(MOUSE_EVENT);
        expect(SPY).toHaveBeenCalled();
    });

    it('should return the expected string using the first case', () => {
        const H = 59;
        const S = 10;
        const V = 5;
        const DIV = 6;
        const RGB_CONTAINER: number[] = [];
        const C: number = S * V;
        const MAX = 360;
        component.cData.MAX_HUE_VALUE = MAX;
        component.cData.MIN_HUE_VALUE = 0;
        component.cData.MIN_RGB_VALUE = 0;
        const X: number = C * (1 - Math.abs(((H / (component.cData.MAX_HUE_VALUE / DIV)) % 2) - 1));
        const M: number = V - C;
        const R = C;
        const G = X;
        const B = component.cData.MIN_RGB_VALUE;
        const MAX_RGB = 255;
        RGB_CONTAINER[0] = Math.round((R + M) * component.cData.MAX_RGB_VALUE);
        RGB_CONTAINER[1] = Math.round((G + M) * component.cData.MAX_RGB_VALUE);
        RGB_CONTAINER[2] = Math.round((B + M) * component.cData.MAX_RGB_VALUE);
        component.cData.MAX_RGB_VALUE = MAX_RGB;
        const EXPECTED_STRING = '#' + component.colorConvert.rgbToHex(RGB_CONTAINER[0]) + component.colorConvert.rgbToHex(RGB_CONTAINER[1])
            + component.colorConvert.rgbToHex(RGB_CONTAINER[2]);
        const RET = component.colorConvert.hsvToHex(H, S, V);
        expect(RET).toEqual(EXPECTED_STRING);
    });

    it('should return the expected string using the second case', () => {
        const H = 70;
        const S = 10;
        const V = 5;
        const DIV = 6;
        const RGB_CONTAINER: number[] = [];
        const C: number = S * V;
        const MAX = 360;
        component.cData.MAX_HUE_VALUE = MAX;
        component.cData.MIN_HUE_VALUE = 0;
        component.cData.MIN_RGB_VALUE = 0;
        const X: number = C * (1 - Math.abs(((H / (component.cData.MAX_HUE_VALUE / DIV)) % 2) - 1));
        const M: number = V - C;
        const R = X;
        const G = C;
        const B = component.cData.MIN_RGB_VALUE;
        const MAX_RGB = 255;
        RGB_CONTAINER[0] = Math.round((R + M) * component.cData.MAX_RGB_VALUE);
        RGB_CONTAINER[1] = Math.round((G + M) * component.cData.MAX_RGB_VALUE);
        RGB_CONTAINER[2] = Math.round((B + M) * component.cData.MAX_RGB_VALUE);
        component.cData.MAX_RGB_VALUE = MAX_RGB;
        const EXPECTED_STRING = '#' + component.colorConvert.rgbToHex(RGB_CONTAINER[0]) + component.colorConvert.rgbToHex(RGB_CONTAINER[1])
            + component.colorConvert.rgbToHex(RGB_CONTAINER[2]);
        const RET = component.colorConvert.hsvToHex(H, S, V);
        expect(RET).toEqual(EXPECTED_STRING);
    });

    it('should return the expected string using the third case', () => {
        const H = 130;
        const S = 10;
        const V = 5;
        const DIV = 6;
        const RGB_CONTAINER: number[] = [];
        const C: number = S * V;
        const MAX = 360;
        component.cData.MAX_HUE_VALUE = MAX;
        component.cData.MIN_HUE_VALUE = 0;
        component.cData.MIN_RGB_VALUE = 0;
        const X: number = C * (1 - Math.abs(((H / (component.cData.MAX_HUE_VALUE / DIV)) % 2) - 1));
        const M: number = V - C;
        const R = component.cData.MIN_RGB_VALUE;
        const G = C;
        const B = X;
        const MAX_RGB = 255;
        RGB_CONTAINER[0] = Math.round((R + M) * component.cData.MAX_RGB_VALUE);
        RGB_CONTAINER[1] = Math.round((G + M) * component.cData.MAX_RGB_VALUE);
        RGB_CONTAINER[2] = Math.round((B + M) * component.cData.MAX_RGB_VALUE);
        component.cData.MAX_RGB_VALUE = MAX_RGB;
        const EXPECTED_STRING = '#' + component.colorConvert.rgbToHex(RGB_CONTAINER[0]) + component.colorConvert.rgbToHex(RGB_CONTAINER[1])
            + component.colorConvert.rgbToHex(RGB_CONTAINER[2]);
        const RET = component.colorConvert.hsvToHex(H, S, V);
        expect(RET).toEqual(EXPECTED_STRING);
    });

    it('should return the expected string using the fourth case', () => {
        const H = 200;
        const S = 10;
        const V = 5;
        const DIV = 6;
        const RGB_CONTAINER: number[] = [];
        const C: number = S * V;
        const MAX = 360;
        component.cData.MAX_HUE_VALUE = MAX;
        component.cData.MIN_HUE_VALUE = 0;
        component.cData.MIN_RGB_VALUE = 0;
        const X: number = C * (1 - Math.abs(((H / (component.cData.MAX_HUE_VALUE / DIV)) % 2) - 1));
        const M: number = V - C;
        const R = component.cData.MIN_RGB_VALUE;
        const G = X;
        const B = C;
        const MAX_RGB = 255;
        RGB_CONTAINER[0] = Math.round((R + M) * component.cData.MAX_RGB_VALUE);
        RGB_CONTAINER[1] = Math.round((G + M) * component.cData.MAX_RGB_VALUE);
        RGB_CONTAINER[2] = Math.round((B + M) * component.cData.MAX_RGB_VALUE);
        component.cData.MAX_RGB_VALUE = MAX_RGB;
        const EXPECTED_STRING = '#' + component.colorConvert.rgbToHex(RGB_CONTAINER[0]) + component.colorConvert.rgbToHex(RGB_CONTAINER[1])
            + component.colorConvert.rgbToHex(RGB_CONTAINER[2]);
        const RET = component.colorConvert.hsvToHex(H, S, V);
        expect(RET).toEqual(EXPECTED_STRING);
    });

    it('should return the expected string using the fifth case', () => {
        const H = 250;
        const S = 10;
        const V = 5;
        const DIV = 6;
        const RGB_CONTAINER: number[] = [];
        const C: number = S * V;
        const MAX = 360;
        component.cData.MAX_HUE_VALUE = MAX;
        component.cData.MIN_HUE_VALUE = 0;
        component.cData.MIN_RGB_VALUE = 0;
        const X: number = C * (1 - Math.abs(((H / (component.cData.MAX_HUE_VALUE / DIV)) % 2) - 1));
        const M: number = V - C;
        const R = X;
        const G = component.cData.MIN_RGB_VALUE;
        const B = C;
        const MAX_RGB = 255;
        RGB_CONTAINER[0] = Math.round((R + M) * component.cData.MAX_RGB_VALUE);
        RGB_CONTAINER[1] = Math.round((G + M) * component.cData.MAX_RGB_VALUE);
        RGB_CONTAINER[2] = Math.round((B + M) * component.cData.MAX_RGB_VALUE);
        component.cData.MAX_RGB_VALUE = MAX_RGB;
        const EXPECTED_STRING = '#' + component.colorConvert.rgbToHex(RGB_CONTAINER[0]) + component.colorConvert.rgbToHex(RGB_CONTAINER[1])
            + component.colorConvert.rgbToHex(RGB_CONTAINER[2]);
        const RET = component.colorConvert.hsvToHex(H, S, V);
        expect(RET).toEqual(EXPECTED_STRING);
    });

    it('should return the expected string using the fifth case', () => {
        const H = 310;
        const S = 10;
        const V = 5;
        const DIV = 6;
        const RGB_CONTAINER: number[] = [];
        const C: number = S * V;
        const MAX = 360;
        component.cData.MAX_HUE_VALUE = MAX;
        component.cData.MIN_HUE_VALUE = 0;
        component.cData.MIN_RGB_VALUE = 0;
        const X: number = C * (1 - Math.abs(((H / (component.cData.MAX_HUE_VALUE / DIV)) % 2) - 1));
        const M: number = V - C;
        const R = C;
        const G = component.cData.MIN_RGB_VALUE;
        const B = X;
        const MAX_RGB = 255;
        RGB_CONTAINER[0] = Math.round((R + M) * component.cData.MAX_RGB_VALUE);
        RGB_CONTAINER[1] = Math.round((G + M) * component.cData.MAX_RGB_VALUE);
        RGB_CONTAINER[2] = Math.round((B + M) * component.cData.MAX_RGB_VALUE);
        component.cData.MAX_RGB_VALUE = MAX_RGB;
        const EXPECTED_STRING = '#' + component.colorConvert.rgbToHex(RGB_CONTAINER[0]) + component.colorConvert.rgbToHex(RGB_CONTAINER[1])
            + component.colorConvert.rgbToHex(RGB_CONTAINER[2]);
        const RET = component.colorConvert.hsvToHex(H, S, V);
        expect(RET).toEqual(EXPECTED_STRING);
    });

    it('should convert and emit the color on set method', () => {
        const SPY_CONV = spyOn(component.colorConvert, 'hsvToHex').and.returnValue('#ffffff');
        const SPY_EMIT = spyOn(component, 'emitColor');
        component.setColor();
        expect(SPY_CONV).toHaveBeenCalled();
        expect(SPY_EMIT).toHaveBeenCalled();
    });
});
