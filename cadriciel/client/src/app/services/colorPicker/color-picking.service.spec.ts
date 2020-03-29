import { TestBed } from '@angular/core/testing';
import { colorData } from 'src/app/components/color-picker/color-data';
import { ColorPickingService } from './color-picking.service';

describe('ColorPickingService', () => {
    // tslint:disable-next-line: no-any
    let mouseEventStub: any;
    let service: ColorPickingService;

    // tslint:disable-next-line: no-any
    let mouseEventStubBigOffset: any;
    // tslint:disable-next-line: no-any
    let mouseEventStubSmallOffset: any;
    // tslint:disable-next-line: no-any
    let kbEventStub: any;
    // tslint:disable-next-line: no-any
    let keyboardEventBadWhich: any;
    // tslint:disable-next-line: no-any
    let keyboardEventGoodWhich: any;
    beforeEach(() => {
        keyboardEventGoodWhich = {
            which: 8,
            stopPropagation: () => 0,
            preventDefault: () => 0,
        };
        keyboardEventBadWhich = {
            which: 37,
            stopPropagation: () => 0,
        };
        kbEventStub = {
            preventDefault: () => 0,
            which: 7,
            stopPropagation: () => 0,
        };

        mouseEventStub = {
            button: 0, // left button pressed
        };
        mouseEventStubBigOffset = {
            offsetX: 160, // mouse positions
            offsetY: 190,
            button: 2,
        };
        mouseEventStubSmallOffset = {
            offsetX: 40,
            offsetY: 49,
        };
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
        const SPY = spyOn(service.colorSubject, 'next');
        service.emitColors();
        expect(SPY).toHaveBeenCalled();
    });

    it('should modifiy the color with the parameters', () => {
        const PRIM = 'red';
        const SEC = 'blue';
        const BG = 'Green';
        service.setColorsFromForm(PRIM, SEC, BG);
        expect(service.colors.primColor).toBe(PRIM);
        expect(service.colors.secColor).toBe(SEC);
    });

    it('sould set the selector of the colors to the passing values', () => {
        const X = 20;
        const Y = 40;
        service.setSLCursor(X, Y);
        expect(service.cData.slCursorX).toEqual(X);
        expect(service.cData.slCursorY).toEqual(Y);
    });

    it('setColor should not call functions', () => {
        const COLOR: number[] = [];
        const SPY_RGB = spyOn(service.colorConvert, 'rgbToHex');
        const SPY_ALPHA_RGB = spyOn(service.colorConvert, 'alphaRGBToHex');
        service.setColor(COLOR);
        expect(SPY_RGB).toHaveBeenCalledTimes(0);
        expect(SPY_ALPHA_RGB).toHaveBeenCalledTimes(0);
    });

    it('set color should set the primary color to the string returned by the converter', () => {
        const NUM = 3;
        const COLOR: number[] = [1, 2, NUM];
        const SPY_RGB = spyOn(service.colorConvert, 'rgbToHex');
        const SPY_ALPHA_RGB = spyOn(service.colorConvert, 'alphaRGBToHex');

        service.setColor(COLOR);

        expect(SPY_RGB).toHaveBeenCalled();
        expect(SPY_ALPHA_RGB).toHaveBeenCalled();
    });

    it('set color should set the secondary color to the string returned by the converter', () => {
        const NUM = 3;
        const COLOR: number[] = [1, 2, NUM];
        const SPY_RGB = spyOn(service.colorConvert, 'rgbToHex');
        const SPY_ALPHA_RGB = spyOn(service.colorConvert, 'alphaRGBToHex');

        service.cData.colorMode = 'Secondary';
        service.setColor(COLOR);

        expect(SPY_RGB).toHaveBeenCalled();
        expect(SPY_ALPHA_RGB).toHaveBeenCalled();
    });

    it('set color should set the background color to the string returned by the converter', () => {
        const NUM = 3;
        const COLOR: number[] = [1, 2, NUM];

        const SPY_RGB = spyOn(service.colorConvert, 'rgbToHex');
        const SPY_ALPHA_RGB = spyOn(service.colorConvert, 'alphaRGBToHex');

        service.cData.colorMode = service.cData.BACKGROUND_COLOR_MODE;

        service.setColor(COLOR);

        expect(SPY_RGB).toHaveBeenCalled();
        expect(SPY_ALPHA_RGB).toHaveBeenCalled();
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
        const X = 1;
        const Y = 2;
        service.setSLCursor(X, Y);
        expect(service.cData.slCursorX).toEqual(X);
        expect(service.cData.slCursorY).toEqual(Y);
    });

    it('slSelector method should not call functions', () => {
        const SPY_SL = spyOn(service, 'setSLCursor');
        const SPY_COLOR = spyOn(service, 'setColor');
        const SPY_UPDATE = spyOn(service, 'updateDisplay');
        service.cData.isSLSelecting = false;
        service.slSelector(mouseEventStubBigOffset);
        expect(SPY_SL).toHaveBeenCalledTimes(0);
        expect(SPY_COLOR).toHaveBeenCalledTimes(0);
        expect(SPY_UPDATE).toHaveBeenCalledTimes(0);
    });

    it('slSelector should call functions and set values to attributes', () => {
        const MODIFIER = 100;
        service.cData.saturationSliderInput = 1;
        service.cData.currentHue = 0;
        service.cData.POURCENT_MODIFIER = MODIFIER;
        service.cData.lightnessSliderInput = 1;
        service.updateDisplay = jasmine.createSpy().and.returnValue(0);
        service.colorConvert.hslToRgb = jasmine.createSpy().and.returnValue(0);
        service.colorConvert.hexToRgba = jasmine.createSpy().and.returnValue(0);
        const SPY_SL = spyOn(service, 'setSLCursor');
        const SPY_COLOR = spyOn(service, 'setColor');

        service.cData.isSLSelecting = true;

        service.slSelector(mouseEventStubBigOffset);

        expect(SPY_SL).toHaveBeenCalled();
        expect(SPY_COLOR).toHaveBeenCalled();
        expect(service.updateDisplay).toHaveBeenCalled();
    });

    it('last color selector should call setters and update the display', () => {
        const SPY_COLOR_MODE = spyOn(service, 'setColorMode');
        const SPY_COLOR = spyOn(service, 'setColor');
        const SPY_UPDATE = spyOn(service, 'updateDisplay');
        const COLOR = 'ffffffff';
        service.lastColorSelector(mouseEventStub, COLOR);
        expect(SPY_COLOR_MODE).toHaveBeenCalled();
        expect(SPY_COLOR).toHaveBeenCalled();
        expect(SPY_UPDATE).toHaveBeenCalled();
    });

    it('should call to prevent the error', () => {
        const MOUSE_STUB = new MouseEvent('mousedown');
        const SPY_PREVENT = spyOn(MOUSE_STUB, 'preventDefault');
        service.onContextMenu(MOUSE_STUB);
        expect(SPY_PREVENT).toHaveBeenCalled();
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
        const COLOR_MODE = 'Primary';
        const SPY_SWAP_DISPLAY = spyOn(service, 'swapInputDisplay');
        service.onRadioButtonChange(COLOR_MODE);
        expect(SPY_SWAP_DISPLAY).toHaveBeenCalled();
        expect(service.cData.colorMode).toBe(COLOR_MODE);
    });

    it('colorSelectOnMouseUp should not call functions', () => {
        service.cData.isSLSelecting = false;
        service.cData.isHueSelecting = false;
        const SPY_UPDATE_LAST_COLOR = spyOn(service, 'updateLastColor');
        const SPY_SET_COLOR = spyOn(service, 'setColorsFromForm');
        const SPY_EMIT = spyOn(service, 'emitColors');
        service.colorSelectOnMouseUp();
        expect(SPY_EMIT).toHaveBeenCalledTimes(0);
        expect(SPY_SET_COLOR).toHaveBeenCalledTimes(0);
        expect(SPY_UPDATE_LAST_COLOR).toHaveBeenCalledTimes(0);
    });

    it('colorSelectOnMouseUp should call functions and update attributes', () => {
        service.cData.isSLSelecting = true;
        service.cData.isHueSelecting = false;
        const SPY_UPDATE_LAST_COLOR = spyOn(service, 'updateLastColor');
        const SPY_SET_COLOR = spyOn(service, 'setColorsFromForm');
        const SPY_EMIT = spyOn(service, 'emitColors');
        service.cData.colorMode = service.cData.PRIMARY_COLOR_MODE;
        service.colorSelectOnMouseUp();
        expect(SPY_EMIT).toHaveBeenCalled();
        expect(SPY_SET_COLOR).toHaveBeenCalled();
        expect(SPY_UPDATE_LAST_COLOR).toHaveBeenCalled();
        expect(service.cData.rectOffsetFill).toBe('none');
        expect(service.cData.isHueSelecting).toBeFalsy();
        expect(service.cData.isSLSelecting).toBeFalsy();
    });

    it('colorSelectOnMouseUp should call functions and update attributes', () => {
        service.cData.isSLSelecting = true;
        service.cData.isHueSelecting = false;
        const SPY_UPDATE_LAST_COLOR = spyOn(service, 'updateLastColor');
        const SPY_SET_COLOR = spyOn(service, 'setColorsFromForm');
        const SPY_EMIT = spyOn(service, 'emitColors');
        service.cData.colorMode = service.cData.SECONDARY_COLOR_MODE;
        service.colorSelectOnMouseUp();
        expect(SPY_EMIT).toHaveBeenCalled();
        expect(SPY_SET_COLOR).toHaveBeenCalled();
        expect(SPY_UPDATE_LAST_COLOR).toHaveBeenCalled();
        expect(service.cData.rectOffsetFill).toBe('none');
        expect(service.cData.isHueSelecting).toBeFalsy();
        expect(service.cData.isSLSelecting).toBeFalsy();
    });

    it('colorSelectOnMouseUp should call functions and update attributes', () => {
        service.cData.isSLSelecting = true;
        service.cData.isHueSelecting = false;
        const SPY_UPDATE_LAST_COLOR = spyOn(service, 'updateLastColor');
        const SPY_SET_COLOR = spyOn(service, 'setColorsFromForm');
        const SPY_EMIT = spyOn(service, 'emitColors');
        service.cData.colorMode = service.cData.BACKGROUND_COLOR_MODE;
        service.colorSelectOnMouseUp();
        expect(SPY_EMIT).toHaveBeenCalled();
        expect(SPY_SET_COLOR).toHaveBeenCalled();
        expect(SPY_UPDATE_LAST_COLOR).toHaveBeenCalled();
        expect(service.cData.rectOffsetFill).toBe('none');
        expect(service.cData.isHueSelecting).toBeFalsy();
        expect(service.cData.isSLSelecting).toBeFalsy();
    });

    it('hue selctor should not call functions', () => {
        const SPY_SET_COLOR = spyOn(service, 'setColorMode');
        const SPY_SL_SELECTOR = spyOn(service, 'slSelector');
        service.cData.isSLSelecting = true;
        service.hueSelectorOnMouseDown(mouseEventStub);
        expect(SPY_SET_COLOR).toHaveBeenCalledTimes(0);
        expect(SPY_SL_SELECTOR).toHaveBeenCalledTimes(0);
    });

    it('hue selctor should call functions and set attributes', () => {
        const SPY_SET_COLOR = spyOn(service, 'setColorMode');
        const SPY_SL_SELECTOR = spyOn(service, 'hueSelector');
        service.cData.isSLSelecting = false;
        service.hueSelectorOnMouseDown(mouseEventStub);
        expect(SPY_SET_COLOR).toHaveBeenCalled();
        expect(SPY_SL_SELECTOR).toHaveBeenCalled();
        expect(service.cData.isHueSelecting).toBeTruthy();
        expect(service.cData.rectOffsetFill).toBe('white');
    });

    it('should not call hue selector function', () => {
        service.cData.isHueSelecting = false;
        const SPY_HUE = spyOn(service, 'hueSelector');
        service.selectorOnMouseLeave(mouseEventStub);
        expect(SPY_HUE).toHaveBeenCalledTimes(0);
    });

    it('should call hue selector function', () => {
        service.cData.isHueSelecting = true;
        const SPY_HUE = spyOn(service, 'hueSelector');
        service.selectorOnMouseLeave(mouseEventStub);
        expect(SPY_HUE).toHaveBeenCalled();
    });

    it('should not call functions after slSelector call', () => {
        service.cData.isHueSelecting = true;
        const SPY_SET = spyOn(service, 'setColorMode');
        const SPY_SL_SELECTOR = spyOn(service, 'slSelector');
        service.slSelectorOnMouseDown(mouseEventStub);
        expect(SPY_SL_SELECTOR).toHaveBeenCalledTimes(0);
        expect(SPY_SET).toHaveBeenCalledTimes(0);
    });

    it('should call functions after slSelector call', () => {
        service.cData.isHueSelecting = false;
        const SPY_SET = spyOn(service, 'setColorMode');
        const SPY_SL_SELECTOR = spyOn(service, 'slSelector');
        service.slSelectorOnMouseDown(mouseEventStub);
        expect(SPY_SL_SELECTOR).toHaveBeenCalled();
        expect(SPY_SET).toHaveBeenCalled();
        expect(service.cData.isSLSelecting).toBeTruthy();
    });

    it('should set the primary color saturation', () => {
        const S = 2;
        service.cData.colorMode = service.cData.PRIMARY_COLOR_MODE;
        service.setSaturation(S);
        expect(service.cData.primarySaturation).toBe(S);
    });

    it('should set the secondary color saturation', () => {
        const S = 2;
        service.cData.colorMode = service.cData.SECONDARY_COLOR_MODE;
        service.setSaturation(S);
        expect(service.cData.secondarySaturation).toBe(S);
    });

    it('should set the background color saturation', () => {
        const S = 2;
        service.cData.colorMode = service.cData.BACKGROUND_COLOR_MODE;
        service.setSaturation(S);
        expect(service.cData.backgroundColorSaturation).toBe(S);
    });

    it('should return the primary color saturation', () => {
        service.cData.colorMode = service.cData.PRIMARY_COLOR_MODE;
        const SAT = service.getSaturation();
        expect(SAT).toBe(service.cData.primarySaturation);
    });

    it('should return the secondary color saturation', () => {
        service.cData.colorMode = service.cData.SECONDARY_COLOR_MODE;
        const SAT = service.getSaturation();
        expect(SAT).toBe(service.cData.secondarySaturation);
    });

    it('should return the background color saturation', () => {
        service.cData.colorMode = service.cData.BACKGROUND_COLOR_MODE;
        const SAT = service.getSaturation();
        expect(SAT).toBe(service.cData.backgroundColorSaturation);
    });

    it('should update the last color', () => {
        service.cData.lastColorRects[service.cData.lastColorRects.length - 1].fill = 'ff000000';
        const COLOR = 'fffffff';
        service.updateLastColor(COLOR);
        expect(service.cData.lastColorRects[0].fill).toBe(COLOR);
    });

    it('update display should call functions', () => {
        const HEX = '00000000';
        const SPY_UPDATE_RGB = spyOn(service, 'updateDisplayRGB');
        const SPY_UPDATE_HSL = spyOn(service, 'updateDisplayHSL');
        const SPY_UPDATE_HEX = spyOn(service, 'upadateDisplayHex');
        const SPY_SET_COLOR = spyOn(service, 'setColorsFromForm');
        const SPY_EMIT = spyOn(service, 'emitColors');
        service.updateDisplay(HEX);
        expect(SPY_EMIT).toHaveBeenCalled();
        expect(SPY_UPDATE_HEX).toHaveBeenCalled();
        expect(SPY_UPDATE_RGB).toHaveBeenCalled();
        expect(SPY_UPDATE_HSL).toHaveBeenCalled();
        expect(SPY_SET_COLOR).toHaveBeenCalled();
    });

    it('should return the opacity computed with the formula', () => {
        const THIRD_NUM = 3;
        const FOURTH_NUM = 4;
        const FOURTH_POS = 3;
        const RGB = [1, 2, THIRD_NUM, FOURTH_NUM];
        const EXPECTED_RESULT = Math.round(RGB[FOURTH_POS] * service.cData.POURCENT_MODIFIER);
        service.updateDisplayRGB(RGB);
        expect(service.cData.opacitySliderInput).toEqual(EXPECTED_RESULT);
    });

    it('should not call get saturation', () => {
        const THIRD_NUM = 0.5;
        const HSL = [1, 2, THIRD_NUM];
        const SPY_SATURATION = spyOn(service, 'getSaturation');
        service.updateDisplayHSL(HSL);
        expect(SPY_SATURATION).toHaveBeenCalledTimes(0);
    });

    it('should call get saturation', () => {
        const HSL = [1, 2, 1];
        const spySaturation = spyOn(service, 'getSaturation');
        service.updateDisplayHSL(HSL);
        expect(spySaturation).toHaveBeenCalled();
    });

    it('should update all hex input values', () => {
        const HIGHER_SUB = 7;
        const AVERAGE_SUB = 5;
        const SMALLER_SUB = 3;
        const HEX = '#ffffffff';
        service.upadateDisplayHex(HEX);
        expect(service.cData.hexColorInput).toBe(HEX.substring(1, HIGHER_SUB));
        expect(service.cData.redHexInput).toBe(HEX.substring(1, SMALLER_SUB));
        expect(service.cData.greenHexInput).toBe(HEX.substring(SMALLER_SUB, AVERAGE_SUB));
        expect(service.cData.blueHexInput).toBe(HEX.substring(AVERAGE_SUB, HIGHER_SUB));
    });

    it('should update the color', () => {
        const UPDATE_SPY = spyOn(service, 'updateDisplay');
        const SELECT_SPY = spyOn(service, 'selectDisplayColor');
        service.swapInputDisplay();
        expect(UPDATE_SPY).toHaveBeenCalled();
        expect(SELECT_SPY).toHaveBeenCalled();
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
    it('should not swapnprimary secondary', () => {
        service.cData.colorMode = service.cData.BACKGROUND_COLOR_MODE;
        const SPY_UPDATE = spyOn(service, 'updateDisplay');
        const SPY_SELECT = spyOn(service, 'selectDisplayColor');
        service.swapPrimarySecondary();
        expect(service.cData.primaryColor).toBe(service.cData.primaryColor);
        expect(service.cData.primaryAlpha).toBe(service.cData.primaryAlpha);
        expect(service.cData.secondaryColor).toBe(service.cData.secondaryColor);
        expect(service.cData.secondaryAlpha).toBe(service.cData.secondaryAlpha);
        expect(SPY_UPDATE).toHaveBeenCalledTimes(0);
        expect(SPY_SELECT).toHaveBeenCalledTimes(0);
    });
    it('should swap primary secondary color and update the display', () => {
        service.cData.colorMode = service.cData.PRIMARY_COLOR_MODE;
        const TMP_PRIMARY_COLOR = service.cData.primaryColor;
        const TMP_PRIMARY_ALPHA = service.cData.primaryAlpha;
        const TMP_SEC_COLOR = service.cData.secondaryColor;
        const TMP_SEC_ALPHA = service.cData.secondaryAlpha;
        const SPY_UPDATE = spyOn(service, 'updateDisplay');
        const SPY_SELECT = spyOn(service, 'selectDisplayColor');
        service.swapPrimarySecondary();
        expect(service.cData.primaryColor).toBe(TMP_SEC_COLOR);
        expect(service.cData.primaryAlpha).toBe(TMP_SEC_ALPHA);
        expect(service.cData.secondaryColor).toBe(TMP_PRIMARY_COLOR);
        expect(service.cData.secondaryAlpha).toBe(TMP_PRIMARY_ALPHA);
        expect(SPY_SELECT).toHaveBeenCalled();
        expect(SPY_UPDATE).toHaveBeenCalled();
    });
    it('should not validate the input beause the which is not good', () => {
        const HEX_LENGTH = 8;
        const HEX = 'fff';
        const VALIDATE_SPY = spyOn(service.colorConvert, 'validateHex');
        service.validateHexInput(kbEventStub, HEX_LENGTH, HEX);
        expect(service.cData.isValideInput).toBeFalsy();
        expect(VALIDATE_SPY).toHaveBeenCalled();
    });

    it('should not validate the input beause the hex length is equal to the string length', () => {
        const HEX_LENGTH = 3;
        const HEX = 'fff';
        const VALIDATE_SPY = spyOn(service.colorConvert, 'validateHex');
        service.validateHexInput(kbEventStub, HEX_LENGTH, HEX);
        expect(service.cData.isValideInput).toBeFalsy();
        expect(VALIDATE_SPY).toHaveBeenCalledTimes(0);
    });

    it('should not validate the input beause the keyboard which is equal to 37', () => {
        const HEX_LENGTH = 4;
        const HEX = 'fff';
        const VALIDATE_SPY = spyOn(service.colorConvert, 'validateHex');
        service.validateHexInput(keyboardEventBadWhich, HEX_LENGTH, HEX);
        expect(service.cData.isValideInput).toBeFalsy();
        expect(VALIDATE_SPY).toHaveBeenCalledTimes(0);
    });
    it('should not validate the input beause the keyboard which is equal to 8', () => {
        const HEX_LENGTH = 3;
        const HEX = 'fff';
        const VALIDATE_SPY = spyOn(service.colorConvert, 'validateHex');
        service.validateHexInput(keyboardEventGoodWhich, HEX_LENGTH, HEX);
        expect(service.cData.isValideInput).toBeFalsy();
        expect(VALIDATE_SPY).toHaveBeenCalled();
    });
    it('onHexInput should not update', () => {
        const HEX_LENGTH = 8;
        const HEX = 'fff';
        const HEX_INPUT_FIELDS = '00000';
        const WRITER_SPY = spyOn(service, 'writeHexColor');
        const DISPLAY_SPY = spyOn(service, 'updateDisplay');
        const LAST_COLOR_SPY = spyOn(service, 'updateLastColor');
        service.onHexInput(HEX_LENGTH, HEX, HEX_INPUT_FIELDS);
        expect(WRITER_SPY).toHaveBeenCalledTimes(0);
        expect(DISPLAY_SPY).toHaveBeenCalledTimes(0);
        expect(LAST_COLOR_SPY).toHaveBeenCalledTimes(0);
    });
    it('onHexInput should not update', () => {
        service.cData.isValideInput = true;
        const HEX_LENGTH = 3;
        const HEX = 'fff';
        const HEX_INPUT_FIELDS = '00000';
        const WRITER_SPY = spyOn(service, 'writeHexColor');
        const DISPLAY_SPY = spyOn(service, 'updateDisplay');
        const LAST_COLOR_SPY = spyOn(service, 'updateLastColor');
        service.onHexInput(HEX_LENGTH, HEX, HEX_INPUT_FIELDS);
        expect(WRITER_SPY).toHaveBeenCalled();
        expect(DISPLAY_SPY).toHaveBeenCalled();
        expect(LAST_COLOR_SPY).toHaveBeenCalled();
    });
    it('should write a red color in the primaryColor', () => {
        const SERVICE_STUB = TestBed.get(ColorPickingService);
        const COLOR = 'Red';
        service.cData.colorMode = service.cData.PRIMARY_COLOR_MODE;
        const SPY_ALPHA_RGB = spyOn(service.colorConvert, 'alphaRGBToHex');
        const RESULT = service.writeHexColor(COLOR);
        const SUB = 6;
        let expectedResult = '#' + service.cData.redHexInput + service.cData.hexColorInput.substring(2, SUB);
        expectedResult += SERVICE_STUB.colorConvert.alphaRGBToHex(service.cData.primaryAlpha);
        expect(RESULT).toBe(expectedResult);
        expect(service.cData.primaryColor).toBe(expectedResult);
        expect(SPY_ALPHA_RGB).toHaveBeenCalled();
    });

    it('should write a green color in the secondaryColor', () => {
        const SERVICE_STUB = TestBed.get(ColorPickingService);
        service.cData.colorMode = service.cData.SECONDARY_COLOR_MODE;
        const SPY_ALPHA_RGB = spyOn(service.colorConvert, 'alphaRGBToHex');
        const BIG_SUB = 6;
        const SMALL_SUB = 4;
        const RESULT = service.writeHexColor(service.cData.GREEN_INPUT_FIELD);
        let expectedResult =
            '#' + service.cData.hexColorInput.substring(0, 2) + service.cData.greenHexInput +
             service.cData.hexColorInput.substring(SMALL_SUB, BIG_SUB);
        expectedResult += SERVICE_STUB.colorConvert.alphaRGBToHex(service.cData.secondaryAlpha);
        expect(RESULT).toBe(expectedResult);
        expect(service.cData.secondaryColor).toBe(expectedResult);
        expect(SPY_ALPHA_RGB).toHaveBeenCalled();
    });
    it('should write a blue color in the background color', () => {
        const SUB = 4;
        service.cData.blueHexInput = 'ff';
        service.cData.hexColorInput = '000000';
        service.cData.backgroundColorAlpha = 1;
        const SERVICE_STUB = TestBed.get(ColorPickingService);
        service.cData.colorMode = service.cData.BACKGROUND_COLOR_MODE;
        const SPY_ALPHA_RGB = spyOn(service.colorConvert, 'alphaRGBToHex');
        const RESULT = service.writeHexColor(service.cData.BLUE_INPUT_FIELD);
        let expectedResult = '#' + service.cData.hexColorInput.substring(0, SUB) + service.cData.blueHexInput;
        expectedResult += SERVICE_STUB.colorConvert.alphaRGBToHex(service.cData.backgroundColorAlpha);
        expect(RESULT).toBe(expectedResult);
        expect(service.cData.backgroundColor).toBe(expectedResult);
        expect(SPY_ALPHA_RGB).toHaveBeenCalled();
    });
    it('should write an hex color in the primaryColor', () => {
        const SERVICE_STUB = TestBed.get(ColorPickingService);
        service.cData.colorMode = service.cData.PRIMARY_COLOR_MODE;
        const SPY_ALPHA_RGB = spyOn(service.colorConvert, 'alphaRGBToHex');
        const RESULT = service.writeHexColor(service.cData.COLOR_HEX_INPUT_FIELD);
        let expectedResult = '#' + service.cData.hexColorInput;
        expectedResult += SERVICE_STUB.colorConvert.alphaRGBToHex(service.cData.primaryAlpha);
        expect(RESULT).toBe(expectedResult);
        expect(service.cData.primaryColor).toBe(expectedResult);
        expect(SPY_ALPHA_RGB).toHaveBeenCalled();
    });
    it('onSLSliderInput should set a color and a saturation and update the view', () => {
        const HSL_SPY = spyOn(service.colorConvert, 'hslToRgb');
        const SET_SPY = spyOn(service, 'setColor');
        const SATURATION_SPY = spyOn(service, 'setSaturation');
        const DISPLAY_SPY = spyOn(service, 'updateDisplay');
        const LAST_COLOR_SPY = spyOn(service, 'updateLastColor');
        service.onSLSliderInput();
        expect(HSL_SPY).toHaveBeenCalled();
        expect(SET_SPY).toHaveBeenCalled();
        expect(SATURATION_SPY).toHaveBeenCalled();
        expect(DISPLAY_SPY).toHaveBeenCalled();
        expect(LAST_COLOR_SPY).toHaveBeenCalled();
    });
    it('sliderAphaChange should change the primary color', () => {
        const SUB = 7;
        const SERVICE_STUB = TestBed.get(ColorPickingService);
        service.cData.colorMode = service.cData.PRIMARY_COLOR_MODE;
        const SET_SPY = spyOn(service, 'setColorsFromForm');
        const SPY_RGB = spyOn(service.colorConvert, 'alphaRGBToHex');
        const EMIT_SPY = spyOn(service, 'emitColors');
        const PERCENT_MODIFIER = service.cData.POURCENT_MODIFIER;
        const OPACITY = service.cData.opacitySliderInput;
        const NEW_PRIM_COLOR = service.cData.primaryColor.substring(0, SUB) +
        SERVICE_STUB.colorConvert.alphaRGBToHex(service.cData.primaryAlpha);
        service.sliderAlphaChange();
        expect(service.cData.primaryAlpha).toEqual(OPACITY / PERCENT_MODIFIER);
        expect(service.cData.primaryColor).toBe(NEW_PRIM_COLOR);
        expect(SET_SPY).toHaveBeenCalled();
        expect(SPY_RGB).toHaveBeenCalled();
        expect(EMIT_SPY).toHaveBeenCalled();
    });
    it('sliderAphaChange should change the secondary color', () => {
        const SUB = 7;
        const SERVICE_STUB = TestBed.get(ColorPickingService);
        service.cData.colorMode = service.cData.SECONDARY_COLOR_MODE;
        const SET_SPY = spyOn(service, 'setColorsFromForm');
        const SPY_RGB = spyOn(service.colorConvert, 'alphaRGBToHex');
        const EMIT_SPY = spyOn(service, 'emitColors');
        const PERCENT_MODIFIER = service.cData.POURCENT_MODIFIER;
        const OPACITY = service.cData.opacitySliderInput;
        const NEW_COLOR = service.cData.secondaryColor.substring(0, SUB) +
        SERVICE_STUB.colorConvert.alphaRGBToHex(service.cData.secondaryAlpha);
        service.sliderAlphaChange();
        expect(service.cData.secondaryAlpha).toEqual(OPACITY / PERCENT_MODIFIER);
        expect(service.cData.secondaryColor).toBe(NEW_COLOR);
        expect(SET_SPY).toHaveBeenCalled();
        expect(SPY_RGB).toHaveBeenCalled();
        expect(EMIT_SPY).toHaveBeenCalled();
    });
    it('sliderAphaChange should change the primary color', () => {
        const SERVICE_STUB = TestBed.get(ColorPickingService);
        service.cData.colorMode = service.cData.BACKGROUND_COLOR_MODE;
        const SET_SPY = spyOn(service, 'setColorsFromForm');
        const SPY_RGB = spyOn(service.colorConvert, 'alphaRGBToHex');
        const EMIT_SPY = spyOn(service, 'emitColors');
        const PERCENT_MODIFIER = service.cData.POURCENT_MODIFIER;
        const OPACITY = service.cData.opacitySliderInput;
        const NEW_COLOR = '#' + service.cData.hexColorInput + SERVICE_STUB.colorConvert.alphaRGBToHex(service.cData.backgroundColorAlpha);
        service.sliderAlphaChange();
        expect(service.cData.backgroundColorAlpha).toEqual(OPACITY / PERCENT_MODIFIER);
        expect(service.cData.backgroundColor).toBe(NEW_COLOR);
        expect(SET_SPY).toHaveBeenCalled();
        expect(SPY_RGB).toHaveBeenCalled();
        expect(EMIT_SPY).toHaveBeenCalled();
    });
    it('should compute the hue using raduis Y smaller than zero', () => {
        const RED = 50;
        const DIV = 180;
        const RADUIS = 360;
        const RADIUS_X = mouseEventStubSmallOffset.offsetX - RED;
        const RADIUS_Y: number = mouseEventStubSmallOffset.offsetY - RED;
        const RADIUS: number = Math.sqrt(Math.pow(RADIUS_X, 2) + Math.pow(RADIUS_Y, 2));
        const THETA: number = Math.acos(RADIUS_X / RADIUS);
        const EXPECTED_HUE = RADUIS - (DIV / Math.PI) * THETA;
        expect(service.computeHue(mouseEventStubSmallOffset)).toEqual(EXPECTED_HUE);
    });
    it('should compute the hue using raduis Y smaller than zero', () => {
        const RED = 50;
        const DIV = 180;
        const RADIUS_X = mouseEventStubBigOffset.offsetX - RED;
        const RADIUS_Y: number = mouseEventStubBigOffset.offsetY - RED;
        const RADIUS: number = Math.sqrt(Math.pow(RADIUS_X, 2) + Math.pow(RADIUS_Y, 2));
        const THETA: number = Math.acos(RADIUS_X / RADIUS);
        const EXPECTED_HUE = (DIV / Math.PI) * THETA;
        expect(service.computeHue(mouseEventStubBigOffset)).toEqual(EXPECTED_HUE);
    });
// tslint:disable-next-line: max-file-line-count
});
