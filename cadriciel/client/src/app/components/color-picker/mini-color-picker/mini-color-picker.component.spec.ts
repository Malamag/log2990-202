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
        })
        .compileComponents();
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
        const spy = spyOn(component, 'emitColor');
        component.ngOnInit();
        expect(spy).toHaveBeenCalled();
    });
    it('should call the next function', () => {
        const spy = spyOn(component.colorSubject, 'next');
        component.emitColor();
        expect(spy).toHaveBeenCalled();
    });
    it('should call hsvToHex an emit the color', () => {
        const spyHSV = spyOn(component, 'hsvToHex');
        const emitSpy = spyOn(component, 'emitColor');
        component.setColor();
        expect(spyHSV).toHaveBeenCalled();
        expect(emitSpy).toHaveBeenCalled();
    });
    it('should set the hue selector to true and to call the hueSelect', () => {
        const spy = spyOn(component, 'hueSelect');
        const mouseEvent = new MouseEvent('mouseDown');
        component.onMouseDownHue(mouseEvent);
        expect(component.isHueSelecting).toBeTruthy();
        expect(spy).toHaveBeenCalled();
    });
    it('should set the SV selector to true and to call the svSelect', () => {
        const spy = spyOn(component, 'svSelect');
        const mouseEvent = new MouseEvent('mouseDown');
        component.onMouseDownSV(mouseEvent);
        expect(component.isSVSelecting).toBeTruthy();
        expect(spy).toHaveBeenCalled();
    });
    it('should set the selectiong attributes to false', () => {
        component.onMouseUp();
        expect(component.isSVSelecting).toBeFalsy();
        expect(component.isHueSelecting).toBeFalsy();
    });
    it('hue select should not call set Color', () => {
        const spy = spyOn(component, 'setColor');
        component.isHueSelecting = false;
        const mouseEvent = new MouseEvent('mouseDown');
        component.hueSelect(mouseEvent);
        expect(spy).toHaveBeenCalledTimes(0);
    });
    it('hue select should call set color ', () => {
        const spy = spyOn(component, 'setColor');
        component.isHueSelecting = true;
        const mouseEvent = new MouseEvent('mouseDown');
        component.hueSelect(mouseEvent);
        expect(spy).toHaveBeenCalled();
    });
    it('sv select should not call set Color', () => {
        const spy = spyOn(component, 'setColor');
        component.isSVSelecting = false;
        const mouseEvent = new MouseEvent('mouseDown');
        component.svSelect(mouseEvent);
        expect(spy).toHaveBeenCalledTimes(0);
    });
    it('sv select should call set color ', () => {
        const spy = spyOn(component, 'setColor');
        component.isSVSelecting = true;
        const mouseEvent = new MouseEvent('mouseDown');
        component.svSelect(mouseEvent);
        expect(spy).toHaveBeenCalled();
    });
    it('should return the expected string using the first case', () => {
        const h = 59;
        const s = 10;
        const v = 5;
        const DIV = 6;
        const rgbContainer: number[] = [];
        const C: number = s * v;
        const max = 360;
        component.cData.MAX_HUE_VALUE = max;
        component.cData.MIN_HUE_VALUE = 0;
        component.cData.MIN_RGB_VALUE = 0;
        const X: number = C * (1 - Math.abs(((h / (component.cData.MAX_HUE_VALUE / DIV)) % 2) - 1));
        const m: number = v - C;
        const R = C;
        const G = X;
        const B = component.cData.MIN_RGB_VALUE;
        const maxRGB = 255;
        rgbContainer[0] = Math.round((R + m) * component.cData.MAX_RGB_VALUE);
        rgbContainer[1] = Math.round((G + m) * component.cData.MAX_RGB_VALUE);
        rgbContainer[2] = Math.round((B + m) * component.cData.MAX_RGB_VALUE);
        component.cData.MAX_RGB_VALUE = maxRGB;
        const expectedString = '#' + component.colorconvert.rgbToHex(rgbContainer[0]) + component.colorconvert.rgbToHex(rgbContainer[1])
         + component.colorconvert.rgbToHex(rgbContainer[2]);
        const ret = component.hsvToHex(h, s, v);
        expect(ret).toEqual(expectedString);
    });
    it('should return the expected string using the second case', () => {
        const h = 70;
        const s = 10;
        const v = 5;
        const DIV = 6;
        const rgbContainer: number[] = [];
        const C: number = s * v;
        const max = 360;
        component.cData.MAX_HUE_VALUE = max;
        component.cData.MIN_HUE_VALUE = 0;
        component.cData.MIN_RGB_VALUE = 0;
        const X: number = C * (1 - Math.abs(((h / (component.cData.MAX_HUE_VALUE / DIV)) % 2) - 1));
        const m: number = v - C;
        const R = X;
        const G = C;
        const B = component.cData.MIN_RGB_VALUE;
        const maxRGB = 255;
        rgbContainer[0] = Math.round((R + m) * component.cData.MAX_RGB_VALUE);
        rgbContainer[1] = Math.round((G + m) * component.cData.MAX_RGB_VALUE);
        rgbContainer[2] = Math.round((B + m) * component.cData.MAX_RGB_VALUE);
        component.cData.MAX_RGB_VALUE = maxRGB;
        const expectedString = '#' + component.colorconvert.rgbToHex(rgbContainer[0]) + component.colorconvert.rgbToHex(rgbContainer[1])
         + component.colorconvert.rgbToHex(rgbContainer[2]);
        const ret = component.hsvToHex(h, s, v);
        expect(ret).toEqual(expectedString);
    });
    it('should return the expected string using the third case', () => {
        const h = 130;
        const s = 10;
        const v = 5;
        const DIV = 6;
        const rgbContainer: number[] = [];
        const C: number = s * v;
        const max = 360;
        component.cData.MAX_HUE_VALUE = max;
        component.cData.MIN_HUE_VALUE = 0;
        component.cData.MIN_RGB_VALUE = 0;
        const X: number = C * (1 - Math.abs(((h / (component.cData.MAX_HUE_VALUE / DIV)) % 2) - 1));
        const m: number = v - C;
        const R = component.cData.MIN_RGB_VALUE;
        const G = C;
        const B = X;
        const maxRGB = 255;
        rgbContainer[0] = Math.round((R + m) * component.cData.MAX_RGB_VALUE);
        rgbContainer[1] = Math.round((G + m) * component.cData.MAX_RGB_VALUE);
        rgbContainer[2] = Math.round((B + m) * component.cData.MAX_RGB_VALUE);
        component.cData.MAX_RGB_VALUE = maxRGB;
        const expectedString = '#' + component.colorconvert.rgbToHex(rgbContainer[0]) + component.colorconvert.rgbToHex(rgbContainer[1])
         + component.colorconvert.rgbToHex(rgbContainer[2]);
        const ret = component.hsvToHex(h, s, v);
        expect(ret).toEqual(expectedString);
    });
    it('should return the expected string using the fourth case', () => {
        const h = 200;
        const s = 10;
        const v = 5;
        const DIV = 6;
        const rgbContainer: number[] = [];
        const C: number = s * v;
        const max = 360;
        component.cData.MAX_HUE_VALUE = max;
        component.cData.MIN_HUE_VALUE = 0;
        component.cData.MIN_RGB_VALUE = 0;
        const X: number = C * (1 - Math.abs(((h / (component.cData.MAX_HUE_VALUE / DIV)) % 2) - 1));
        const m: number = v - C;
        const R = component.cData.MIN_RGB_VALUE;
        const G = X;
        const B = C;
        const maxRGB = 255;
        rgbContainer[0] = Math.round((R + m) * component.cData.MAX_RGB_VALUE);
        rgbContainer[1] = Math.round((G + m) * component.cData.MAX_RGB_VALUE);
        rgbContainer[2] = Math.round((B + m) * component.cData.MAX_RGB_VALUE);
        component.cData.MAX_RGB_VALUE = maxRGB;
        const expectedString = '#' + component.colorconvert.rgbToHex(rgbContainer[0]) + component.colorconvert.rgbToHex(rgbContainer[1])
         + component.colorconvert.rgbToHex(rgbContainer[2]);
        const ret = component.hsvToHex(h, s, v);
        expect(ret).toEqual(expectedString);
    });
    it('should return the expected string using the fifth case', () => {
        const h = 250;
        const s = 10;
        const v = 5;
        const DIV = 6;
        const rgbContainer: number[] = [];
        const C: number = s * v;
        const max = 360;
        component.cData.MAX_HUE_VALUE = max;
        component.cData.MIN_HUE_VALUE = 0;
        component.cData.MIN_RGB_VALUE = 0;
        const X: number = C * (1 - Math.abs(((h / (component.cData.MAX_HUE_VALUE / DIV)) % 2) - 1));
        const m: number = v - C;
        const R = X;
        const G = component.cData.MIN_RGB_VALUE;
        const B = C;
        const maxRGB = 255;
        rgbContainer[0] = Math.round((R + m) * component.cData.MAX_RGB_VALUE);
        rgbContainer[1] = Math.round((G + m) * component.cData.MAX_RGB_VALUE);
        rgbContainer[2] = Math.round((B + m) * component.cData.MAX_RGB_VALUE);
        component.cData.MAX_RGB_VALUE = maxRGB;
        const expectedString = '#' + component.colorconvert.rgbToHex(rgbContainer[0]) + component.colorconvert.rgbToHex(rgbContainer[1])
         + component.colorconvert.rgbToHex(rgbContainer[2]);
        const ret = component.hsvToHex(h, s, v);
        expect(ret).toEqual(expectedString);
    });
    it('should return the expected string using the fifth case', () => {
        const h = 310;
        const s = 10;
        const v = 5;
        const DIV = 6;
        const rgbContainer: number[] = [];
        const C: number = s * v;
        const max = 360;
        component.cData.MAX_HUE_VALUE = max;
        component.cData.MIN_HUE_VALUE = 0;
        component.cData.MIN_RGB_VALUE = 0;
        const X: number = C * (1 - Math.abs(((h / (component.cData.MAX_HUE_VALUE / DIV)) % 2) - 1));
        const m: number = v - C;
        const R = C;
        const G = component.cData.MIN_RGB_VALUE;
        const B = X;
        const maxRGB = 255;
        rgbContainer[0] = Math.round((R + m) * component.cData.MAX_RGB_VALUE);
        rgbContainer[1] = Math.round((G + m) * component.cData.MAX_RGB_VALUE);
        rgbContainer[2] = Math.round((B + m) * component.cData.MAX_RGB_VALUE);
        component.cData.MAX_RGB_VALUE = maxRGB;
        const expectedString = '#' + component.colorconvert.rgbToHex(rgbContainer[0]) + component.colorconvert.rgbToHex(rgbContainer[1])
         + component.colorconvert.rgbToHex(rgbContainer[2]);
        const ret = component.hsvToHex(h, s, v);
        expect(ret).toEqual(expectedString);
    });
});
