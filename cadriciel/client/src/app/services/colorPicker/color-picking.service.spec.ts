import { TestBed } from '@angular/core/testing';
import { colorData } from 'src/app/components/color-picker/color-data';
import { ColorPickingService } from './color-picking.service';

describe('ColorPickingService', () => {
    let mouseEventStub: any;
    let service: ColorPickingService;

    let mouseEventStubBigOffset: any;
    //let mouseEventStubSmallOffset: any
    let kbEventStub: any;

    beforeEach(() => {
        kbEventStub = {
            preventDefault: () => 0,
            which: 7,
        };

        mouseEventStub = {
            button: 0, // left button pressed
        };
        mouseEventStubBigOffset = {
            offsetX: 160, // mouse positions
            offsetY: 190,
            button: 2,
        };
        /*mouseEventStubSmallOffset = {
      offsetX: 40,
      offsetY: 49
    }*/
        TestBed.configureTestingModule({
            providers: [
                { provide: MouseEvent, mouseEventStub },
                { provide: KeyboardEvent, kbEventStub },
            ],
        });

        service = TestBed.get(ColorPickingService);
        service.cData = JSON.parse(JSON.stringify(colorData)); // deep-copying the interface to avoid test disturbance
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should call the next method of the observer', () => {
        const spy = spyOn(service.colorSubject, 'next');
        service.emitColors();
        expect(spy).toHaveBeenCalled();
    });

    it('should modifiy the color with the parameters', () => {
        const prim = 'red';
        const sec = 'blue';
        const bg = 'Green';
        service.setColorsFromForm(prim, sec, bg);
        expect(service.colors.primColor).toBe(prim);
        expect(service.colors.secColor).toBe(sec);
    });

    it('sould set the selector of the colors to the passing values', () => {
        const x = 20;
        const y = 40;
        service.setSLCursor(x, y);
        expect(service.cData.slCursorX).toEqual(x);
        expect(service.cData.slCursorY).toEqual(y);
    });

    it('setColor should not call functions', () => {
        let color: number[] = [];
        const spyRgb = spyOn(service.colorConvert, 'rgbToHex');
        const spyAlphaRGB = spyOn(service.colorConvert, 'alphaRGBToHex');
        service.setColor(color);
        expect(spyRgb).toHaveBeenCalledTimes(0);
        expect(spyAlphaRGB).toHaveBeenCalledTimes(0);
    });

    it('set color should set the primary color to the string returned by the converter', () => {
        let color: number[] = [1, 2, 3];
        const spyRgb = spyOn(service.colorConvert, 'rgbToHex');
        const spyAlphaRGB = spyOn(service.colorConvert, 'alphaRGBToHex');

        service.setColor(color);

        expect(spyRgb).toHaveBeenCalled();
        expect(spyAlphaRGB).toHaveBeenCalled();
    });

    it('set color should set the secondary color to the string returned by the converter', () => {
        let color: number[] = [1, 2, 3];
        const spyRgb = spyOn(service.colorConvert, 'rgbToHex');
        const spyAlphaRGB = spyOn(service.colorConvert, 'alphaRGBToHex');

        service.cData.colorMode = 'Secondary';
        service.setColor(color);

        expect(spyRgb).toHaveBeenCalled();
        expect(spyAlphaRGB).toHaveBeenCalled();
    });

    it('set color should set the background color to the string returned by the converter', () => {
        let color: number[] = [1, 2, 3];

        const spyRgb = spyOn(service.colorConvert, 'rgbToHex');
        const spyAlphaRGB = spyOn(service.colorConvert, 'alphaRGBToHex');

        service.cData.colorMode = service.cData.BACKGROUND_COLOR_MODE;

        service.setColor(color);

        expect(spyRgb).toHaveBeenCalled();
        expect(spyAlphaRGB).toHaveBeenCalled();
    });

    it('color mode should be background color mode', () => {
        service.cData.colorMode = service.cData.BACKGROUND_COLOR_MODE;
        service.setColorMode(mouseEventStub);
        expect(service.cData.colorMode).toBe(service.cData.BACKGROUND_COLOR_MODE);
    });

    it('color mode should change to primary color mode', () => {
        service.cData.colorMode = service.cData.SECONDARY_COLOR_MODE;
        service.setColorMode(mouseEventStub);
        expect(service.cData.colorMode).toBe(service.cData.PRIMARY_COLOR_MODE);
    });

    it('color mode should change to secondary color mode', () => {
        service.cData.colorMode = service.cData.PRIMARY_COLOR_MODE;
        service.setColorMode(mouseEventStubBigOffset);
        expect(service.cData.colorMode).toBe(service.cData.SECONDARY_COLOR_MODE);
    });

    it('should set the SLCursor to the parameters values', () => {
        const x: number = 1;
        const y: number = 2;
        service.setSLCursor(x, y);
        expect(service.cData.slCursorX).toEqual(x);
        expect(service.cData.slCursorY).toEqual(y);
    });

    it('slSelector method should not call functions', () => {
        const spySL = spyOn(service, 'setSLCursor');
        const spyColor = spyOn(service, 'setColor');
        const spyUpdate = spyOn(service, 'updateDisplay');
        service.cData.isSLSelecting = false;
        service.slSelector(mouseEventStubBigOffset);
        expect(spySL).toHaveBeenCalledTimes(0);
        expect(spyColor).toHaveBeenCalledTimes(0);
        expect(spyUpdate).toHaveBeenCalledTimes(0);
    });

    it('slSelector should call functions and set values to attributes', () => {
        const spySL = spyOn(service, 'setSLCursor');
        const spyColor = spyOn(service, 'setColor');
        const spyUpdate = spyOn(service, 'updateDisplay');

        service.cData.isSLSelecting = true;
        service.slSelector(mouseEventStubBigOffset);

        expect(spySL).toHaveBeenCalled();
        expect(spyColor).toHaveBeenCalled();
        expect(spyUpdate).toHaveBeenCalled();
        expect(service.cData.saturationSliderInput).toEqual((mouseEventStubBigOffset.offsetX - 25) * 2);
        expect(service.cData.lightnessSliderInput).toEqual((mouseEventStubBigOffset.offsetY - 25) * 2);
    });

    it('last color selector should call setters and update the display', () => {
        const spyColorMode = spyOn(service, 'setColorMode');
        const spyColor = spyOn(service, 'setColor');
        const spyUpdate = spyOn(service, 'updateDisplay');
        const color = 'ffffffff';
        service.lastColorSelector(mouseEventStub, color);
        expect(spyColorMode).toHaveBeenCalled();
        expect(spyColor).toHaveBeenCalled();
        expect(spyUpdate).toHaveBeenCalled();
    });

    it('should call to prevent the error', () => {
        const mouseStub = new MouseEvent('mousedown');
        const spyPrevent = spyOn(mouseStub, 'preventDefault');
        service.onContextMenu(mouseStub);
        expect(spyPrevent).toHaveBeenCalled();
    });

    it('should set the swap stroke to yellow', () => {
        service.cData.colorMode = service.cData.PRIMARY_COLOR_MODE;
        service.onSwapSVGMouseOver();
        expect(service.cData.swapStrokeStyle).toBe('yellow');
    });

    it('should set the swap stroke to white', () => {
        service.onSwapSVGMouseLeave();
        expect(service.cData.swapStrokeStyle).toBe('white');
    });

    it('should set the swap stroke to lightblue', () => {
        service.cData.colorMode = service.cData.PRIMARY_COLOR_MODE;
        service.onSwapSVGMouseDown();
        expect(service.cData.swapStrokeStyle).toBe('lightblue');
    });

    it('should set the swap stroke to white', () => {
        service.onSwapSVGMouseUp();
        expect(service.cData.swapStrokeStyle).toBe('white');
    });

    it('should set the colorMode to the color mode passed in parameter', () => {
        const colorMode = 'Primary';
        const spySwapDisplay = spyOn(service, 'swapInputDisplay');
        service.onRadioButtonChange(colorMode);
        expect(spySwapDisplay).toHaveBeenCalled();
        expect(service.cData.colorMode).toBe(colorMode);
    });

    it('colorSelectOnMouseUp should not call functions', () => {
        service.cData.isSLSelecting = false;
        service.cData.isHueSelecting = false;
        const spyUpdateLastColor = spyOn(service, 'updateLastColor');
        const spySetColor = spyOn(service, 'setColorsFromForm');
        const spyEmit = spyOn(service, 'emitColors');
        service.colorSelectOnMouseUp();
        expect(spyEmit).toHaveBeenCalledTimes(0);
        expect(spySetColor).toHaveBeenCalledTimes(0);
        expect(spyUpdateLastColor).toHaveBeenCalledTimes(0);
    });

    it('colorSelectOnMouseUp should call functions and update attributes', () => {
        service.cData.isSLSelecting = true;
        service.cData.isHueSelecting = false;
        const spyUpdateLastColor = spyOn(service, 'updateLastColor');
        const spySetColor = spyOn(service, 'setColorsFromForm');
        const spyEmit = spyOn(service, 'emitColors');
        service.cData.colorMode = service.cData.PRIMARY_COLOR_MODE;
        service.colorSelectOnMouseUp();
        expect(spyEmit).toHaveBeenCalled();
        expect(spySetColor).toHaveBeenCalled();
        expect(spyUpdateLastColor).toHaveBeenCalled();
        expect(service.cData.rectOffsetFill).toBe('none');
        expect(service.cData.isHueSelecting).toBeFalsy();
        expect(service.cData.isSLSelecting).toBeFalsy();
    });

    it('colorSelectOnMouseUp should call functions and update attributes', () => {
        service.cData.isSLSelecting = true;
        service.cData.isHueSelecting = false;
        const spyUpdateLastColor = spyOn(service, 'updateLastColor');
        const spySetColor = spyOn(service, 'setColorsFromForm');
        const spyEmit = spyOn(service, 'emitColors');
        service.cData.colorMode = service.cData.SECONDARY_COLOR_MODE;
        service.colorSelectOnMouseUp();
        expect(spyEmit).toHaveBeenCalled();
        expect(spySetColor).toHaveBeenCalled();
        expect(spyUpdateLastColor).toHaveBeenCalled();
        expect(service.cData.rectOffsetFill).toBe('none');
        expect(service.cData.isHueSelecting).toBeFalsy();
        expect(service.cData.isSLSelecting).toBeFalsy();
    });

    it('colorSelectOnMouseUp should call functions and update attributes', () => {
        service.cData.isSLSelecting = true;
        service.cData.isHueSelecting = false;
        const spyUpdateLastColor = spyOn(service, 'updateLastColor');
        const spySetColor = spyOn(service, 'setColorsFromForm');
        const spyEmit = spyOn(service, 'emitColors');
        service.cData.colorMode = service.cData.BACKGROUND_COLOR_MODE;
        service.colorSelectOnMouseUp();
        expect(spyEmit).toHaveBeenCalled();
        expect(spySetColor).toHaveBeenCalled();
        expect(spyUpdateLastColor).toHaveBeenCalled();
        expect(service.cData.rectOffsetFill).toBe('none');
        expect(service.cData.isHueSelecting).toBeFalsy();
        expect(service.cData.isSLSelecting).toBeFalsy();
    });

    it('hue selctor should not call functions', () => {
        const spySetColor = spyOn(service, 'setColorMode');
        const spySLSelector = spyOn(service, 'slSelector');
        service.cData.isSLSelecting = true;
        service.hueSelectorOnMouseDown(mouseEventStub);
        expect(spySetColor).toHaveBeenCalledTimes(0);
        expect(spySLSelector).toHaveBeenCalledTimes(0);
    });

    it('hue selctor should call functions and set attributes', () => {
        const spySetColor = spyOn(service, 'setColorMode');
        const spySLSelector = spyOn(service, 'hueSelector');
        service.cData.isSLSelecting = false;
        service.hueSelectorOnMouseDown(mouseEventStub);
        expect(spySetColor).toHaveBeenCalled();
        expect(spySLSelector).toHaveBeenCalled();
        expect(service.cData.isHueSelecting).toBeTruthy();
        expect(service.cData.rectOffsetFill).toBe('white');
    });

    it('should not call hue selector function', () => {
        service.cData.isHueSelecting = false;
        const spyHue = spyOn(service, 'hueSelector');
        service.selectorOnMouseLeave(mouseEventStub);
        expect(spyHue).toHaveBeenCalledTimes(0);
    });

    it('should call hue selector function', () => {
        service.cData.isHueSelecting = true;
        const spyHue = spyOn(service, 'hueSelector');
        service.selectorOnMouseLeave(mouseEventStub);
        expect(spyHue).toHaveBeenCalled();
    });

    it('should not call functions after slSelector call', () => {
        service.cData.isHueSelecting = true;
        const spySet = spyOn(service, 'setColorMode');
        const spySLSelector = spyOn(service, 'slSelector');
        service.slSelectorOnMouseDown(mouseEventStub);
        expect(spySLSelector).toHaveBeenCalledTimes(0);
        expect(spySet).toHaveBeenCalledTimes(0);
    });

    it('should call functions after slSelector call', () => {
        service.cData.isHueSelecting = false;
        const spySet = spyOn(service, 'setColorMode');
        const spySLSelector = spyOn(service, 'slSelector');
        service.slSelectorOnMouseDown(mouseEventStub);
        expect(spySLSelector).toHaveBeenCalled();
        expect(spySet).toHaveBeenCalled();
        expect(service.cData.isSLSelecting).toBeTruthy();
    });

    it('should set the primary color saturation', () => {
        const s = 2;
        service.cData.colorMode = service.cData.PRIMARY_COLOR_MODE;
        service.setSaturation(s);
        expect(service.cData.primarySaturation).toBe(s);
    });

    it('should set the secondary color saturation', () => {
        const s = 2;
        service.cData.colorMode = service.cData.SECONDARY_COLOR_MODE;
        service.setSaturation(s);
        expect(service.cData.secondarySaturation).toBe(s);
    });

    it('should set the background color saturation', () => {
        const s = 2;
        service.cData.colorMode = service.cData.BACKGROUND_COLOR_MODE;
        service.setSaturation(s);
        expect(service.cData.backgroundColorSaturation).toBe(s);
    });

    it('should return the primary color saturation', () => {
        service.cData.colorMode = service.cData.PRIMARY_COLOR_MODE;
        let sat = service.getSaturation();
        expect(sat).toBe(service.cData.primarySaturation);
    });

    it('should return the secondary color saturation', () => {
        service.cData.colorMode = service.cData.SECONDARY_COLOR_MODE;
        let sat = service.getSaturation();
        expect(sat).toBe(service.cData.secondarySaturation);
    });

    it('should return the background color saturation', () => {
        service.cData.colorMode = service.cData.BACKGROUND_COLOR_MODE;
        let sat = service.getSaturation();
        expect(sat).toBe(service.cData.backgroundColorSaturation);
    });

    it('should update the last color', () => {
        const color = 'ffffffff';
        service.updateLastColor(color);
        expect(service.cData.lastColorRects[service.cData.lastColorRects.length - 1].fill).toBe(color);
    });

    it('update display should call functions', () => {
        const hex = '00000000';
        const spyUpdateRGB = spyOn(service, 'updateDisplayRGB');
        const spyUpdateHsl = spyOn(service, 'updateDisplayHSL');
        const spyUpdateHex = spyOn(service, 'upadateDisplayHex');
        const spySetColor = spyOn(service, 'setColorsFromForm');
        const spyEmit = spyOn(service, 'emitColors');
        service.updateDisplay(hex);
        expect(spyEmit).toHaveBeenCalled();
        expect(spyUpdateHex).toHaveBeenCalled();
        expect(spyUpdateRGB).toHaveBeenCalled();
        expect(spyUpdateHsl).toHaveBeenCalled();
        expect(spySetColor).toHaveBeenCalled();
    });

    it('should return the opacity computed with the formula', () => {
        const rgb = [1, 2, 3, 4];
        const expectedResult = Math.round(rgb[3] * service.cData.POURCENT_MODIFIER);
        service.updateDisplayRGB(rgb);
        expect(service.cData.opacitySliderInput).toEqual(expectedResult);
    });

    it('should not call get saturation', () => {
        const hsl = [1, 2, 0.5];
        const spySaturation = spyOn(service, 'getSaturation');
        service.updateDisplayHSL(hsl);
        expect(spySaturation).toHaveBeenCalledTimes(0);
    });

    it('should call get saturation', () => {
        const hsl = [1, 2, 1];
        const spySaturation = spyOn(service, 'getSaturation');
        service.updateDisplayHSL(hsl);
        expect(spySaturation).toHaveBeenCalled();
    });

    it('should update all hex input values', () => {
        const hex = '#ffffffff';
        service.upadateDisplayHex(hex);
        expect(service.cData.hexColorInput).toBe(hex.substring(1, 7));
        expect(service.cData.redHexInput).toBe(hex.substring(1, 3));
        expect(service.cData.greenHexInput).toBe(hex.substring(3, 5));
        expect(service.cData.blueHexInput).toBe(hex.substring(5, 7));
    });

    it('should select the primary color', () => {
        service.cData.colorMode = service.cData.PRIMARY_COLOR_MODE;
        const DISPLAY_COL = service.selectDisplayColor();
        expect(DISPLAY_COL).toBe(service.cData.primaryColor);
    });

    it('should select the secondary color', () => {
        service.cData.colorMode = service.cData.SECONDARY_COLOR_MODE;
        const DISPLAY_COL = service.selectDisplayColor();
        expect(DISPLAY_COL).toBe(service.cData.secondaryColor);
    });

    it('should select the background color', () => {
        service.cData.colorMode = service.cData.BACKGROUND_COLOR_MODE;
        const DISPLAY_COL = service.selectDisplayColor();
        expect(DISPLAY_COL).toBe(service.cData.backgroundColor);
    });

    it('should swap primary secondary color and update the display', () => {
        service.cData.colorMode = service.cData.PRIMARY_COLOR_MODE;
        const tmpPrimaryColor = service.cData.primaryColor;
        const tmpPrimaryAlpha = service.cData.primaryAlpha;
        const tmpSecColor = service.cData.secondaryColor;
        const tmpSecAlpha = service.cData.secondaryAlpha;
        const spyUpdate = spyOn(service, 'updateDisplay');
        const spySelect = spyOn(service, 'selectDisplayColor');
        service.swapPrimarySecondary();
        expect(service.cData.primaryColor).toBe(tmpSecColor);
        expect(service.cData.primaryAlpha).toBe(tmpSecAlpha);
        expect(service.cData.secondaryColor).toBe(tmpPrimaryColor);
        expect(service.cData.secondaryAlpha).toBe(tmpPrimaryAlpha);
        expect(spySelect).toHaveBeenCalled();
        expect(spyUpdate).toHaveBeenCalled();
    });
});
