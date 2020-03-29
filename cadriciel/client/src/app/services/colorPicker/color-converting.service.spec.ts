import { TestBed } from '@angular/core/testing';
import { ColorConvertingService } from './color-converting.service';

const VALID_NUMBER = 250;
const INVALID_NUMBER = 2520;

describe('ColorConvertingService', () => {
    let service: ColorConvertingService;
    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = new ColorConvertingService();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should return true on valid input', () => {
        expect(service.validateRGB(VALID_NUMBER)).toBeTruthy();
    });

    it('should return false on invalid input', () => {
        expect(service.validateRGB(INVALID_NUMBER)).toBeFalsy();
    });

    it('should return an empty string on invalid input', () => {
        const SPY = spyOn(service, 'validateRGB');
        service.rgbToHex(INVALID_NUMBER);
        expect(SPY).toHaveBeenCalled();
        expect(service.rgbToHex(INVALID_NUMBER).length).toEqual(0);
    });

    it('should not return an empty string on fine rgb input', () => {
        const SPY = spyOn(service, 'validateRGB');
        service.rgbToHex(VALID_NUMBER);
        expect(SPY).toHaveBeenCalled();
        expect(service.rgbToHex(VALID_NUMBER)).toBeDefined();
    });

    it('should return an empty string', () => {
        const ALPHA = 250;
        expect(service.alphaRGBToHex(ALPHA).length).toEqual(0);
    });

    it('should call rgbToHex', () => {
        const ALPHA = 1;
        const SPY = spyOn(service, 'rgbToHex');
        service.alphaRGBToHex(ALPHA);
        expect(SPY).toHaveBeenCalled();
    });

    it('validateHSL should return false following a big H number', () => {
        const H = 3651;
        const S = 1;
        const L = 1;
        expect(service.validateHSL(H, S, L)).toBeFalsy();
    });

    it('validateHSL should return false following a big S number', () => {
        const H = 230;
        const S = 1.5;
        const L = 1;
        expect(service.validateHSL(H, S, L)).toBeFalsy();
    });

    it('validateHSL should return false following a big L number', () => {
        const H = 230;
        const S = 1;
        const L = 1.5;
        expect(service.validateHSL(H, S, L)).toBeFalsy();
    });

    it('validateHSL should return true following in range numbers', () => {
        const H = 230;
        const S = 1;
        const L = 1;
        expect(service.validateHSL(H, S, L)).toBeTruthy();
    });

    it('should return an invalid rgb array', () => {
        const RET = -1;
        const H = 230;
        const S = 1;
        const L = 1.5;
        let spyObj: jasmine.SpyObj<ColorConvertingService>;
        spyObj = jasmine.createSpyObj('ColorConvertingService', ['validateHSL']);
        spyObj.validateHSL.and.returnValue(false); // we eant validateHSL not to pass
        const SPY = spyOn(service, 'validateHSL');
        const RGB_CONTAINER = service.hslToRgb(H, S, L);
        expect(SPY).toHaveBeenCalled();
        expect(RGB_CONTAINER).toEqual([RET, RET, RET]);
    });

    it('should return a valid RGB array', () => {
        const RGB = 255;
        const H = 230;
        const S = 1;
        const L = 1;
        const RGB_CONTAINER = service.hslToRgb(H, S, L);
        expect(RGB_CONTAINER).toEqual([RGB, RGB, RGB]); // 8-bits
    });

    it('should return a valid RGB array', () => {
        const RGB = 255;
        const H = 50;
        const S = 1;
        const L = 1;
        const RGB_CONTAINER = service.hslToRgb(H, S, L);
        expect(RGB_CONTAINER).toEqual([RGB, RGB, RGB]);
    });

    it('should return a valid RGB array', () => {
        const RGB = 255;
        const H = 70;
        const S = 1;
        const L = 1;
        const RGB_CONTAINER = service.hslToRgb(H, S, L);
        expect(RGB_CONTAINER).toEqual([RGB, RGB, RGB]);
    });

    it('should return a valid RGB array', () => {
        const RGB = 255;
        const H = 150;
        const S = 1;
        const L = 1;
        const RGB_CONTAINER = service.hslToRgb(H, S, L);
        expect(RGB_CONTAINER).toEqual([RGB, RGB, RGB]);
    });

    it('should return a valid RGB array', () => {
        const RGB = 255;
        const H = 270;
        const S = 1;
        const L = 1;
        const RGB_CONTAINER = service.hslToRgb(H, S, L);
        expect(RGB_CONTAINER).toEqual([RGB, RGB, RGB]);
    });

    it('should return a valid RGB array', () => {
        const RGB = 255;
        const H = 310;
        const S = 1;
        const L = 1;
        const RGB_CONTAINER = service.hslToRgb(H, S, L);
        expect(RGB_CONTAINER).toEqual([RGB, RGB, RGB]);
    });

    it('should return a HSL calculated from a RGB input', () => {
        const MOD = 6;
        const DIV = 255;
        const MULT = 60;
        const R = 250;
        const G = 200;
        const B = 150;
        const PRIM_R = R / DIV; // 8-bits, 255
        const PRIM_G = G / DIV;
        const PRIM_B = B / DIV;
        const DELTA = PRIM_R - PRIM_B;
        const HUE = MULT * (((PRIM_G - PRIM_B) / DELTA) % MOD);
        const LIGHTNESS = (PRIM_R + PRIM_B) / 2;
        const SATURATION = DELTA / (1 - Math.abs(2 * LIGHTNESS - 1));
        expect(service.rgbToHsl(R, G, B)).toEqual([HUE, SATURATION, LIGHTNESS]);
    });

    it('should return a hue calculated with green value', () => {
        const DIV = 255;
        const mult = 60;
        const R = 200;
        const G = 250;
        const B = 150;
        const PRIM_R = R / DIV; // 8-bits, 255
        const PRIM_G = G / DIV;
        const PRIM_B = B / DIV;
        const delta = PRIM_G - PRIM_B;
        const HUE = mult * ((PRIM_B - PRIM_R) / delta + 2);
        const LIGHTNESS = (PRIM_G + PRIM_B) / 2;
        const SATURATION = delta / (1 - Math.abs(2 * LIGHTNESS - 1));
        expect(service.rgbToHsl(R, G, B)).toEqual([HUE, SATURATION, LIGHTNESS]);
    });

    it('should return a hue calculated with blue value', () => {
        const ADD = 4;
        const DIV = 255;
        const mult = 60;
        const R = 200;  // Arbitrary inputs
        const G = 150;
        const B = 250;
        const PRIM_R = R / DIV; // 8-bits, 255
        const PRIM_G = G / DIV;
        const PRIM_B = B / DIV;
        const delta = PRIM_B - PRIM_G;
        const HUE = mult * ((PRIM_R - PRIM_G) / delta + ADD); // taking the formula
        const LIGHTNESS = (PRIM_G + PRIM_B) / 2;
        const SATURATION = delta / (1 - Math.abs(2 * LIGHTNESS - 1));
        expect(service.rgbToHsl(R, G, B)).toEqual([HUE, SATURATION, LIGHTNESS]);
    });

    it('should return an array with zeros', () => {
        const R = 0;
        const G = 0;
        const B = 0;
        expect(service.rgbToHsl(R, G, B)).toEqual([0, 0, 0]);
    });

    it('validateHex should return true', () => {
        const HEX = 48;
        expect(service.validateHex(HEX)).toBeTruthy();
    });

    it('validateHex should return false', () => {
        const HEX = 60;
        expect(service.validateHex(HEX)).toBeFalsy();
    });
    // test last function todo
});
