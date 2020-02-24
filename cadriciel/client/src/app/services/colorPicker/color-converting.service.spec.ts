import { TestBed } from '@angular/core/testing';

import { ColorConvertingService } from './color-converting.service';

const validNumber = 250;
const invalidNumber = 2520;
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
        expect(service.validateRGB(validNumber)).toBeTruthy();
    });

    it('should return false on invalid input', () => {
        expect(service.validateRGB(invalidNumber)).toBeFalsy();
    });

    it('should return an empty string on invalid input', () => {
        const spy = spyOn(service, 'validateRGB');
        service.rgbToHex(invalidNumber);
        expect(spy).toHaveBeenCalled();
        expect(service.rgbToHex(invalidNumber).length).toEqual(0);
    });

    it('should not return an empty string on fine rgb input', () => {
        const spy = spyOn(service, 'validateRGB');
        service.rgbToHex(validNumber);

        expect(spy).toHaveBeenCalled();
        expect(service.rgbToHex(validNumber)).toBeDefined();
    });

    it('should return an empty string', () => {
        const alpha = 250;
        expect(service.alphaRGBToHex(alpha).length).toEqual(0);
    });

    it('should call rgbToHex', () => {
        const alpha = 1;

        const spy = spyOn(service, 'rgbToHex');
        service.alphaRGBToHex(alpha);
        expect(spy).toHaveBeenCalled();
    });

    it('validateHSL should return false following a big H number', () => {
        const h = 3651;
        const s = 1;
        const l = 1;

        expect(service.validateHSL(h, s, l)).toBeFalsy();
    });

    it('validateHSL should return false following a big S number', () => {
        const h = 230;
        const s = 1.5;
        const l = 1;

        expect(service.validateHSL(h, s, l)).toBeFalsy();
    });

    it('validateHSL should return false following a big L number', () => {
        const h = 230;
        const s = 1;
        const l = 1.5;

        expect(service.validateHSL(h, s, l)).toBeFalsy();
    });

    it('validateHSL should return true following in range numbers', () => {
        const h = 230;
        const s = 1;
        const l = 1;

        expect(service.validateHSL(h, s, l)).toBeTruthy();
    });

    it('should return an invalid rgb array', () => {
        const h = 230;
        const s = 1;
        const l = 1.5;

        let spyObj: jasmine.SpyObj<ColorConvertingService>;
        spyObj = jasmine.createSpyObj('ColorConvertingService', ['validateHSL']);
        spyObj.validateHSL.and.returnValue(false); // we eant validateHSL not to pass

        const spy = spyOn(service, 'validateHSL');
        const rgbContainer = service.hslToRgb(h, s, l);
        expect(spy).toHaveBeenCalled();
        expect(rgbContainer).toEqual([-1, -1, -1]);
    });

    it('should return a valid RGB array', () => {
        const h = 230;
        const s = 1;
        const l = 1;

        const rgbContainer = service.hslToRgb(h, s, l);
        expect(rgbContainer).toEqual([255, 255, 255]); // 8-bits
    });

    it('should return a valid RGB array', () => {
        const h = 50;
        const s = 1;
        const l = 1;

        const rgbContainer = service.hslToRgb(h, s, l);
        expect(rgbContainer).toEqual([255, 255, 255]);
    });

    it('should return a valid RGB array', () => {
        const h = 70;
        const s = 1;
        const l = 1;

        const rgbContainer = service.hslToRgb(h, s, l);
        expect(rgbContainer).toEqual([255, 255, 255]);
    });

    it('should return a valid RGB array', () => {
        const h = 150;
        const s = 1;
        const l = 1;

        const rgbContainer = service.hslToRgb(h, s, l);
        expect(rgbContainer).toEqual([255, 255, 255]);
    });

    it('should return a valid RGB array', () => {
        const h = 270;
        const s = 1;
        const l = 1;

        const rgbContainer = service.hslToRgb(h, s, l);
        expect(rgbContainer).toEqual([255, 255, 255]);
    });

    it('should return a valid RGB array', () => {
        const h = 310;
        const s = 1;
        const l = 1;

        const rgbContainer = service.hslToRgb(h, s, l);
        expect(rgbContainer).toEqual([255, 255, 255]);
    });

    it('should return a HSL calculated from a RGB input', () => {
        const r = 250;
        const g = 200;
        const b = 150;
        const primR = r / 255; // 8-bits, 255
        const primG = g / 255;
        const primB = b / 255;
        const delta = primR - primB;
        const hue = 60 * (((primG - primB) / delta) % 6);
        const lightness = (primR + primB) / 2;

        const saturation = delta / (1 - Math.abs(2 * lightness - 1));

        expect(service.rgbToHsl(r, g, b)).toEqual([hue, saturation, lightness]);
    });

    it('should return a hue calculated with green value', () => {
        const r = 200;
        const g = 250;
        const b = 150;
        const primR = r / 255;
        const primG = g / 255;
        const primB = b / 255;
        const delta = primG - primB;
        const hue = 60 * ((primB - primR) / delta + 2);
        const lightness = (primG + primB) / 2;

        const saturation = delta / (1 - Math.abs(2 * lightness - 1));

        expect(service.rgbToHsl(r, g, b)).toEqual([hue, saturation, lightness]);
    });

    it('should return a hue calculated with blue value', () => {
        const r = 200; // arbitrary inputs
        const g = 150;
        const b = 250;

        const primR = r / 255;
        const primG = g / 255;
        const primB = b / 255;
        const delta = primB - primG;
        const hue = 60 * ((primR - primG) / delta + 4); // taking the formula
        const lightness = (primG + primB) / 2;

        const saturation = delta / (1 - Math.abs(2 * lightness - 1));

        expect(service.rgbToHsl(r, g, b)).toEqual([hue, saturation, lightness]);
    });

    it('should return an array with zeros', () => {
        const r = 0;
        const g = 0;
        const b = 0;

        expect(service.rgbToHsl(r, g, b)).toEqual([0, 0, 0]);
    });

    it('validateHex should return true', () => {
        const hex = 48;

        expect(service.validateHex(hex)).toBeTruthy();
    });

    it('validateHex should return false', () => {
        const hex = 60;

        expect(service.validateHex(hex)).toBeFalsy();
    });

    // test last function todo
});
