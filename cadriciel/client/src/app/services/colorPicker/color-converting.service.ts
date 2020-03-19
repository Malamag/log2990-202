import { Injectable } from '@angular/core';
import { colorData } from '../../components/color-picker/color-data';

@Injectable({
    providedIn: 'root',
})
export class ColorConvertingService {
    // cData = colorData; // Interface for Color data
    // RGB [0,255]
    validateRGB(r: number): boolean {
        return r >= colorData.MIN_RGB_VALUE && r <= colorData.MAX_RGB_VALUE;
    }
    rgbToHex(r: number = colorData.MIN_RGB_VALUE): string {
        let hex = '';
        const bits: number[] = [];
        if (!this.validateRGB(r)) {
            return '';
        }
        const shifter = 4;
        const hexN = 0xf;
        // Split 1 8 bits int into 2 4 bits int
        // tslint:disable-next-line: no-bitwise
        bits[0] = r >> shifter;
        // tslint:disable-next-line: no-bitwise
        bits[1] = r & hexN;

        for (let i = 0; i < 2; i++) {
            if (bits[i] >= colorData.HEX_NUMBER_LETTER_MIN_VALUE) {
                hex += String.fromCharCode(bits[i] + colorData.ASCII_A - colorData.HEX_NUMBER_LETTER_MIN_VALUE);
            } else {
                hex += '' + bits[i];
            }
        }
        return hex;
    }
    alphaRGBToHex(a: number): string {
        const alpha: number = a * colorData.RGBA_TO_HEX_ALPHA_MODIFIER;
        if (!this.validateRGB(alpha)) {
            return '';
        }
        return this.rgbToHex(alpha);
    }
    validateHSL(h: number, s: number, l: number): boolean {
        const hOk = h >= colorData.MIN_HUE_VALUE && h <= colorData.MAX_HUE_VALUE;
        const sOk = s >= colorData.MIN_SATURATION_VALUE && s <= colorData.MAX_SATURATION_VALUE;
        const lOk = l >= colorData.MIN_LIGHTNESS_VALUE && l <= colorData.MAX_LIGHTNESS_VALUE;
        return hOk && sOk && lOk;
    }
    hslToRgb(
        H: number = colorData.MIN_HUE_VALUE,
        S: number = colorData.MAX_SATURATION_VALUE,
        L: number = colorData.MAX_LIGHTNESS_VALUE / 2,
    ): number[] {
        const initNum = -1;
        const rgb: number[] = [initNum, initNum, initNum];
        if (!this.validateHSL(H, S, L)) {
            return rgb;
        }
        const C: number = (1 - Math.abs(2 * L - 1)) * S;
        const div = 60;
        const X: number = C * (1 - Math.abs(((H / div) % 2) - 1));
        const m: number = L - C / 2;

        let R: number = colorData.MIN_RGB_VALUE;
        let G: number = colorData.MIN_RGB_VALUE;
        let B: number = colorData.MIN_RGB_VALUE;
        const bigDiv = 6;
        const smallDiv = 3;
        const mult = 5;
        // Math formula for conversion
        if (colorData.MIN_HUE_VALUE <= H && H < colorData.MAX_HUE_VALUE / bigDiv) {
            R = C;
            G = X;
            B = colorData.MIN_RGB_VALUE;
        } else if (colorData.MAX_HUE_VALUE / bigDiv <= H && H < colorData.MAX_HUE_VALUE / smallDiv) {
            R = X;
            G = C;
            B = colorData.MIN_RGB_VALUE;
        } else if (colorData.MAX_HUE_VALUE / smallDiv <= H && H < colorData.MAX_HUE_VALUE / 2) {
            R = colorData.MIN_RGB_VALUE;
            G = C;
            B = X;
        } else if (colorData.MAX_HUE_VALUE / 2 <= H && H < (2 * colorData.MAX_HUE_VALUE) / smallDiv) {
            R = colorData.MIN_RGB_VALUE;
            G = X;
            B = C;
        } else if ((2 * colorData.MAX_HUE_VALUE) / smallDiv <= H && H < (mult * colorData.MAX_HUE_VALUE) / bigDiv) {
            R = X;
            G = colorData.MIN_RGB_VALUE;
            B = C;
        } else if ((mult * colorData.MAX_HUE_VALUE) / bigDiv <= H && H < colorData.MAX_HUE_VALUE) {
            R = C;
            G = colorData.MIN_RGB_VALUE;
            B = X;
        }
        rgb[0] = Math.round((R + m) * colorData.MAX_RGB_VALUE);
        rgb[1] = Math.round((G + m) * colorData.MAX_RGB_VALUE);
        rgb[2] = Math.round((B + m) * colorData.MAX_RGB_VALUE);

        return rgb;
    }

    rgbToHsl(r: number, g: number, b: number): number[] {
        // DONE
        // scale dowon rgb value to a range of [ 0 , 1 ] from [ 0 , 255 ]
        const primeR: number = r / colorData.MAX_RGB_VALUE;
        const primeG: number = g / colorData.MAX_RGB_VALUE;
        const primeB: number = b / colorData.MAX_RGB_VALUE;

        // getting min/max and delta value of primes
        const max: number = Math.max(primeR, primeG, primeB);
        const min: number = Math.min(primeR, primeG, primeB);
        const delta: number = max - min;

        let hue: number = colorData.MIN_HUE_VALUE;
        let saturation: number = colorData.MIN_SATURATION_VALUE;
        let lightness: number = colorData.MIN_LIGHTNESS_VALUE;
        // math conversion formula base on max prime
        const num = 6;
        const add = 4;
        if (delta) {
            if (max === primeR) {
                hue = (colorData.MAX_HUE_VALUE / num) * (((primeG - primeB) / delta) % num);
            } else if (max === primeG) {
                hue = (colorData.MAX_HUE_VALUE / num) * ((primeB - primeR) / delta + 2);
            } else if (max === primeB) {
                hue = (colorData.MAX_HUE_VALUE / num) * ((primeR - primeG) / delta + add);
            }
        }

        // make sure hue is in [ 0 , 360 ] degree
        if (hue < colorData.MIN_HUE_VALUE) {
            hue = colorData.MAX_HUE_VALUE + hue;
        }

        lightness = (max + min) / 2;

        if (delta) {
            saturation = delta / (1 - Math.abs(2 * lightness - 1));
        }

        const hsl: number[] = [];
        hsl[0] = hue;
        hsl[1] = saturation;
        hsl[2] = lightness;

        return hsl;
    }
    validateHex(hex: number): boolean {
        let hexOk = false;
        colorData.hexNumber.forEach((hexNumber) => {
            if (hex === hexNumber) {
                hexOk = true;
            }
        });
        return hexOk;
    }
    hexToRgba(hex: string): number[] {
        let colorBits: string = hex;
        // check if first char is a # (ascii code number is 35) and remove it
        const asciiHashTag = 35;
        const initValue = -1;
        const rgba: number[] = [initValue, initValue, initValue, initValue];
        if (hex.charCodeAt(0) === asciiHashTag) {
            colorBits = hex.substring(1, hex.length);
        }
        // return -1 if length is to big
        if (colorBits.length > colorData.HEX_NUMBER_MAX_LENGTH) {
            return rgba;
        }
        // if string is impair return -1 to all value
        if (colorBits.length % 2) {
            return rgba;
        }

        const buffer: number[] = [];
        for (let i = 0; i < colorBits.length; i++) {
            // Return -1 on rbga if char is invalide
            if (colorBits.charCodeAt(i) >= colorData.ASCII_a) {
                buffer[i] = colorBits.charCodeAt(i) - (colorData.ASCII_a - colorData.ASCII_A);
            } else {
                buffer[i] = colorBits.charCodeAt(i);
            }
            if (!this.validateHex(buffer[i])) {
                return rgba;
            }
            // hex letter start at 10
            if (buffer[i] >= colorData.ASCII_A) {
                buffer[i] -= colorData.ASCII_A - colorData.HEX_NUMBER_LETTER_MIN_VALUE;
            } else {
                buffer[i] -= colorData.ASCII_0;
            }
        }
        const shifter = 4;
        for (let j = 0; j < buffer.length / 2; j++) {
            // tslint:disable-next-line: no-bitwise
            rgba[j] = (buffer[j * 2] << shifter) | buffer[j * 2 + 1];
        }
        // lenght without # and alpha
        const num = 3;
        const reduceHigh = 7;
        const reduceLow = 5;
        if (colorBits.length <= colorData.HEX_NUMBER_MAX_LENGTH - num) {
            rgba[num] = initValue;
        } else {
            // opacity for rgba is between [0,1] while for hex it's [0,255]
            rgba[num] = rgba[num] / colorData.RGBA_TO_HEX_ALPHA_MODIFIER;
        }
        // length with only 2 colors
        if (colorBits.length <= colorData.HEX_NUMBER_MAX_LENGTH - reduceLow) {
            rgba[2] = initValue;
        }
        // lenght with only 1 color
        if (colorBits.length <= colorData.HEX_NUMBER_MAX_LENGTH - reduceHigh) {
            rgba[1] = initValue;
        }
        return rgba;
    }

    hsvToHex(H: number, S: number, V: number): string {
        let hex = '';
        // tslint:disable-next-line: no-magic-numbers
        const rgb: number[] = [-1, -1, -1]; // array of bad index

        const bigDiv = 6;
        const C: number = S * V;
        const X: number = C * (1 - Math.abs(((H / (colorData.MAX_HUE_VALUE / bigDiv)) % 2) - 1));
        const m: number = V - C;

        let R: number = colorData.MIN_RGB_VALUE;
        let G: number = colorData.MIN_RGB_VALUE;
        let B: number = colorData.MIN_RGB_VALUE;

        // Math formula for conversion
        const smallDiv = 3;
        const mult = 5;
        if (colorData.MIN_HUE_VALUE <= H && H < colorData.MAX_HUE_VALUE / bigDiv) {
            R = C;
            G = X;
            B = colorData.MIN_RGB_VALUE;
        } else if (colorData.MAX_HUE_VALUE / bigDiv <= H && H < colorData.MAX_HUE_VALUE / smallDiv) {
            R = X;
            G = C;
            B = colorData.MIN_RGB_VALUE;
        } else if (colorData.MAX_HUE_VALUE / smallDiv <= H && H < colorData.MAX_HUE_VALUE / 2) {
            R = colorData.MIN_RGB_VALUE;
            G = C;
            B = X;
        } else if (colorData.MAX_HUE_VALUE / 2 <= H && H < (2 * colorData.MAX_HUE_VALUE) / smallDiv) {
            R = colorData.MIN_RGB_VALUE;
            G = X;
            B = C;
        } else if ((2 * colorData.MAX_HUE_VALUE) / smallDiv <= H && H < (mult * colorData.MAX_HUE_VALUE) / bigDiv) {
            R = X;
            G = colorData.MIN_RGB_VALUE;
            B = C;
        } else if ((mult * colorData.MAX_HUE_VALUE) / bigDiv <= H && H < colorData.MAX_HUE_VALUE) {
            R = C;
            G = colorData.MIN_RGB_VALUE;
            B = X;
        }
        rgb[0] = Math.round((R + m) * colorData.MAX_RGB_VALUE);
        rgb[1] = Math.round((G + m) * colorData.MAX_RGB_VALUE);
        rgb[2] = Math.round((B + m) * colorData.MAX_RGB_VALUE);

        hex = '#' + this.rgbToHex(rgb[0]) + this.rgbToHex(rgb[1]) + this.rgbToHex(rgb[2]);
        return hex;
    }
}
