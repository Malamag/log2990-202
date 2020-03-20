import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { colorData } from '../../components/color-picker/color-data';
import { ChoosenColors } from '../../models/choosen-colors.model';
import { ColorConvertingService } from './color-converting.service';

/*-----------------------------Color valur table-----------------------------------------*
 * RGBA min/max value : R [0,255] , G [0,255] , B [0,255] , A [0,1]                       *
 * HSL  min/max value : H [0,360] , S [0,1] , L [0,1]                                     *
 * HEX  min/max value : R [00,FF] , G [00,FF] , B [00,FF] , A [00,FF] ( i.e FF = 255 )    *
 * Display min/max value : RGB [0,255] , H [0,360] , ASL [0,100]% , HEX [00,FF]           *
 * Conversion methode for display : RBAH HEX  the same value, ASL * 100 for poucent value *
 * HEX color string 9 number total: #RRGGBBAA                                             *
 * # is not needed for math so it need to be cut from formula (i.e substring(1,X))        *
 * RR is red value.To get use substring(1,3) if # is present else substring(0,2)          *
 * GG is green value.To get use substring(3,5) if # is present else substring(2,4)        *
 * BB is blue value.To get use substring(5,7) if # is present else substring(4,6)         *
 * AA is opacity value.To get use substring(7,9) if # is present else substring(6,8)      *
 *---------------------------------------------------------------------------------------*/

@Injectable({
    providedIn: 'root',
})
export class ColorPickingService {
    // tslint:disable-next-line: typedef
    cData = colorData; // Interface for Color data

    colors: ChoosenColors;
    colorSubject: Subject<ChoosenColors> = new Subject<ChoosenColors>(); // le constuire à qqpart
    constructor(public colorConvert: ColorConvertingService) { }

    emitColors(): void {
        // observerved-observer design pattern
        this.colorSubject.next(this.colors);
    }
    /************************ SETTERS SECTION ***************************/
    setColorsFromForm(primary: string, secondary: string, background: string): void {
        this.colors = { primColor: primary, secColor: secondary, backColor: background };
    }
    setColor(color: number[]): string {
        const limit = 3;
        if (color.length < limit) {
            return '';
        } else {
            let newColor: string =
                '#' + this.colorConvert.rgbToHex(color[0]) + this.colorConvert.rgbToHex(color[1]) + this.colorConvert.rgbToHex(color[2]);
            switch (this.cData.colorMode) {
                case this.cData.PRIMARY_COLOR_MODE:
                    newColor += this.colorConvert.alphaRGBToHex(this.cData.primaryAlpha);
                    this.cData.primaryColor = newColor;
                    break;
                case this.cData.SECONDARY_COLOR_MODE:
                    newColor += this.colorConvert.alphaRGBToHex(this.cData.secondaryAlpha);
                    this.cData.secondaryColor = newColor;
                    break;
                case this.cData.BACKGROUND_COLOR_MODE:
                    newColor += this.colorConvert.alphaRGBToHex(this.cData.backgroundColorAlpha);
                    this.cData.backgroundColor = newColor;
                    break;
            }
            return newColor;
        }
    }
    setColorMode(event: MouseEvent): void {
        if (this.cData.colorMode === this.cData.BACKGROUND_COLOR_MODE) {
            return;
        }
        switch (event.button) {
            case 0:
                this.cData.colorMode = this.cData.PRIMARY_COLOR_MODE;
                break;
            case 2:
                this.cData.colorMode = this.cData.SECONDARY_COLOR_MODE;
                break;
        }
    }
    // Set position of x and y of saturatio/lightness cursor
    setSLCursor(x: number, y: number): void {
        this.cData.slCursorX = x;
        this.cData.slCursorY = y;
    }
    setSaturation(s: number): void {
        switch (this.cData.colorMode) {
            case this.cData.PRIMARY_COLOR_MODE:
                this.cData.primarySaturation = s;
                break;
            case this.cData.SECONDARY_COLOR_MODE:
                this.cData.secondarySaturation = s;
                break;
            case this.cData.BACKGROUND_COLOR_MODE:
                this.cData.backgroundColorSaturation = s;
        }
    }
    getSaturation(): number {
        const ret = -1;
        switch (this.cData.colorMode) {
            case this.cData.PRIMARY_COLOR_MODE:
                return this.cData.primarySaturation;
            case this.cData.SECONDARY_COLOR_MODE:
                return this.cData.secondarySaturation;
            case this.cData.BACKGROUND_COLOR_MODE:
                return this.cData.backgroundColorSaturation;
        }
        return ret;
    }
    /************************ SELECTORS SECTION ***************************/
    hueSelector(event: MouseEvent): void {
        let hue = 0;
        if (this.cData.isHueSelecting) {
            hue = this.computeHue(event);
            this.cData.currentHue = Math.round(hue);
            const color = this.setColor(
                this.colorConvert.hslToRgb(
                    hue,
                    this.cData.saturationSliderInput / this.cData.POURCENT_MODIFIER,
                    this.cData.lightnessSliderInput / this.cData.POURCENT_MODIFIER,
                ),
            );
            this.updateDisplay(color);
        }
    }
    // saturation/lightness selector
    slSelector(event: MouseEvent): void {
        if (!this.cData.isSLSelecting) {
            return;
        }
        const OFFSET = 25;
        const x: number = event.offsetX - OFFSET;
        const y: number = event.offsetY - OFFSET;
        this.setSLCursor(x, y);
        this.cData.saturationSliderInput = x * 2;
        this.cData.lightnessSliderInput = y * 2;
        this.setSaturation(this.cData.saturationSliderInput);
        const hsl: number[] = [
            this.cData.currentHue,
            this.cData.saturationSliderInput / this.cData.POURCENT_MODIFIER,
            this.cData.lightnessSliderInput / this.cData.POURCENT_MODIFIER,
        ];
        const color = this.setColor(
            this.colorConvert.hslToRgb(
                this.cData.currentHue,
                this.cData.saturationSliderInput / this.cData.POURCENT_MODIFIER,
                this.cData.lightnessSliderInput / this.cData.POURCENT_MODIFIER,
            ),
        );
        this.updateDisplay(color, this.colorConvert.hexToRgba(color), hsl);
    }
    lastColorSelector(event: MouseEvent, lastColor: string): void {
        this.setColorMode(event);
        const color = this.setColor(this.colorConvert.hexToRgba(lastColor));
        this.updateDisplay(color);
    }
    /************************ EVENTS SECTION ***************************/
    onContextMenu(event: MouseEvent): void {
        event.preventDefault();
    }
    onSwapSVGMouseOver(): void {
        if (this.cData.colorMode === this.cData.BACKGROUND_COLOR_MODE) {
            return;
        }
        this.cData.swapStrokeStyle = 'yellow';
    }
    onSwapSVGMouseLeave(): void {
        this.cData.swapStrokeStyle = 'white';
    }
    onSwapSVGMouseDown(): void {
        if (this.cData.colorMode === this.cData.BACKGROUND_COLOR_MODE) {
            return;
        }
        this.cData.swapStrokeStyle = 'lightblue';
    }
    onSwapSVGMouseUp(): void {
        this.cData.swapStrokeStyle = 'white';
    }
    onRadioButtonChange(newColorMode: string): void {
        this.cData.colorMode = newColorMode;
        this.swapInputDisplay();
    }
    // Mouse up event function when mouse on a color selector
    colorSelectOnMouseUp(): void {
        if (!this.cData.isSLSelecting && !this.cData.isHueSelecting) {
            return;
        }
        this.cData.rectOffsetFill = 'none';
        this.cData.isHueSelecting = false;
        this.cData.isSLSelecting = false;
        switch (this.cData.colorMode) {
            case this.cData.PRIMARY_COLOR_MODE:
                this.updateLastColor(this.cData.primaryColor);
                break;
            case this.cData.SECONDARY_COLOR_MODE:
                this.updateLastColor(this.cData.secondaryColor);
                break;
            case this.cData.BACKGROUND_COLOR_MODE:
                this.updateLastColor(this.cData.backgroundColor);
                break;
        }
        this.setColorsFromForm(this.cData.primaryColor, this.cData.secondaryColor, this.cData.backgroundColor);
        this.emitColors();
    }
    // Mouse down event function when mouse on hue selector
    hueSelectorOnMouseDown(event: MouseEvent): void {
        if (this.cData.isSLSelecting) {
            return;
        }
        this.cData.isHueSelecting = true;
        this.cData.rectOffsetFill = 'white';
        this.setColorMode(event);
        this.hueSelector(event);
    }
    selectorOnMouseLeave(event: MouseEvent): void {
        if (!this.cData.isHueSelecting) {
            return;
        }
        this.hueSelector(event);
    }
    // Mouse down event function when mouse on saturation/lightness selector
    slSelectorOnMouseDown(event: MouseEvent): void {
        if (this.cData.isHueSelecting) {
            return;
        }
        this.cData.isSLSelecting = true;
        this.setColorMode(event);
        this.slSelector(event);
    }
    // DISPLAY/UPDATE
    // Update last color table with a new color
    updateLastColor(newColor: string): void {
        const sub = 7;
        this.cData.lastColorRects.forEach((color) => {
            if (color.fill === newColor.substring(0, sub)) {
                return;
            }
        });
        this.cData.lastColorRects.forEach((color) => {
            if (color.fill === 'none') {
                color.fill = newColor.substring(0, sub);
                color.stroke = 'white';
                return;
            }
        });
        for (let i = 0; i < this.cData.lastColorRects.length - 1; i++) {
            this.cData.lastColorRects[i].fill = this.cData.lastColorRects[i + 1].fill;
        }
        this.cData.lastColorRects[this.cData.lastColorRects.length - 1].fill = newColor.substring(0, sub);
    }
    updateDisplay(
        hex: string,
        // tslint:disable-next-line: no-magic-numbers
        rgb: number[] = this.colorConvert.hexToRgba(hex.substring(1, 9)),
        hsl: number[] = this.colorConvert.rgbToHsl(rgb[0], rgb[1], rgb[2]),
    ): void {
        // RGBA value of last color for display
        this.updateDisplayRGB(rgb);
        // HSL value of last color for display
        this.updateDisplayHSL(hsl);
        this.upadateDisplayHex(hex);
        this.setColorsFromForm(this.cData.primaryColor, this.cData.secondaryColor, this.cData.backgroundColor);
        this.emitColors();
    }
    updateDisplayRGB(rgb: number[]): void {
        const pos = 3;
        this.cData.opacitySliderInput = Math.round(rgb[pos] * this.cData.POURCENT_MODIFIER);
    }
    updateDisplayHSL(hsl: number[]): void {
        const newSaturation: number = Math.round(hsl[1] * this.cData.POURCENT_MODIFIER);
        this.cData.lightnessSliderInput = Math.round(hsl[2] * this.cData.POURCENT_MODIFIER);
        const lightnessMinMax =
            this.cData.lightnessSliderInput === this.cData.MIN_LIGHTNESS_VALUE ||
            this.cData.lightnessSliderInput === this.cData.MAX_LIGHTNESS_VALUE * this.cData.POURCENT_MODIFIER;
        if (!lightnessMinMax) {
            this.cData.saturationSliderInput = newSaturation;
        } else {
            this.cData.saturationSliderInput = this.getSaturation();
        }
        this.setSLCursor(this.cData.saturationSliderInput / 2, this.cData.lightnessSliderInput / 2);
    }
    upadateDisplayHex(hex: string): void {
        const bigSub = 7;
        const averageSub = 5;
        const smallSub = 3;
        this.cData.hexColorInput = hex.substring(1, bigSub); // only 1 to 7 char are needed for view
        this.cData.redHexInput = hex.substring(1, smallSub);
        this.cData.greenHexInput = hex.substring(smallSub, averageSub);
        this.cData.blueHexInput = hex.substring(averageSub, bigSub);
    }
    // Change color display between primary , secondary and background
    swapInputDisplay(): void {
        const color = this.selectDisplayColor();
        this.updateDisplay(color);
    }
    // udapte display with current value
    selectDisplayColor(): string {
        let color = '';
        switch (this.cData.colorMode) {
            case this.cData.PRIMARY_COLOR_MODE:
                color = this.cData.primaryColor;
                break;
            case this.cData.SECONDARY_COLOR_MODE:
                color = this.cData.secondaryColor;
                break;
            case this.cData.BACKGROUND_COLOR_MODE:
                color = this.cData.backgroundColor;
                break;
        }
        return color;
    }
    // Exchange primary and secondary value
    swapPrimarySecondary(): void {
        if (this.cData.colorMode === this.cData.BACKGROUND_COLOR_MODE) {
            return;
        }
        const tempColor: string = this.cData.primaryColor;
        const tempAlpha: number = this.cData.primaryAlpha;

        this.cData.primaryColor = this.cData.secondaryColor;
        this.cData.primaryAlpha = this.cData.secondaryAlpha;

        this.cData.secondaryColor = tempColor;
        this.cData.secondaryAlpha = tempAlpha;
        const color = this.selectDisplayColor();
        this.updateDisplay(color);
    }
    // INPUTS
    // validate if char is hexadecimal.
    validateHexInput(event: KeyboardEvent, hexLength: number, hex: string): void {
        event.stopPropagation();
        this.cData.isValideInput = false;
        // left/right arrow/delete
        const leftArrow = 37;
        const rightArrow = 39;
        const del = 46;
        // tslint:disable-next-line: deprecation // tslint:disable-next-line: prefer-switch
        if (event.which === leftArrow || event.which === rightArrow || event.which === del) {
            return;
        }
        // if not backspace
        const backspace = 8;
        // tslint:disable-next-line: deprecation
        if (event.which !== backspace) {
            if (hex.length === hexLength) {
                event.preventDefault();
                return;
            }
        }
        // tslint:disable-next-line: deprecation
        const validator = this.colorConvert.validateHex(event.which);
        if (!validator) {
            event.preventDefault();
            return;
        }
        this.cData.isValideInput = true;
    }
    /**
     * Red hex text field input event function
     * Update display if valide value are input
     */
    onHexInput(hexLength: number, hex: string, hexInputField: string): void {
        if (hex.length === hexLength && this.cData.isValideInput) {
            const newColor: string = this.writeHexColor(hexInputField);
            this.updateDisplay(newColor);
            this.updateLastColor(newColor);
            this.cData.isValideInput = false;
        }
    }
    writeHexColor(color: string): string {
        let ret = '';
        const bigSub = 6;
        const smallSub = 4;
        switch (color) {
            case this.cData.RED_INPUT_FIELD:
                ret += '#' + this.cData.redHexInput + this.cData.hexColorInput.substring(2, bigSub);
                break;
            case this.cData.GREEN_INPUT_FIELD:
                ret += '#' + this.cData.hexColorInput.substring(0, 2) + this.cData.greenHexInput +
                 this.cData.hexColorInput.substring(smallSub, bigSub);
                break;
            case this.cData.BLUE_INPUT_FIELD:
                ret += '#' + this.cData.hexColorInput.substring(0, smallSub) + this.cData.blueHexInput;
                break;
            case this.cData.COLOR_HEX_INPUT_FIELD:
                ret += '#' + this.cData.hexColorInput;
                break;
        }
        switch (this.cData.colorMode) {
            case this.cData.PRIMARY_COLOR_MODE:
                ret += this.colorConvert.alphaRGBToHex(this.cData.primaryAlpha);
                this.cData.primaryColor = ret;
                break;
            case this.cData.SECONDARY_COLOR_MODE:
                ret += this.colorConvert.alphaRGBToHex(this.cData.secondaryAlpha);
                this.cData.secondaryColor = ret;
                break;
            case this.cData.BACKGROUND_COLOR_MODE:
                ret += this.colorConvert.alphaRGBToHex(this.cData.backgroundColorAlpha);
                this.cData.backgroundColor = ret;
                break;
        }
        return ret;
    }
    // Saturation and lightness slider input event function
    onSLSliderInput(): void {
        // hsl saturation and ligthness value are between [0;1] while display is [0;100]%.So we need to divide by 100
        const rgb = this.colorConvert.hslToRgb(
            this.cData.currentHue,
            this.cData.saturationSliderInput / this.cData.POURCENT_MODIFIER,
            this.cData.lightnessSliderInput / this.cData.POURCENT_MODIFIER,
        );
        const newColor = this.setColor(rgb);
        this.setSaturation(this.cData.saturationSliderInput);
        this.updateDisplay(newColor);
        this.updateLastColor(newColor);
    }
    sliderAlphaChange(): void {
        const sub = 7;
        switch (this.cData.colorMode) {
            case this.cData.PRIMARY_COLOR_MODE:
                this.cData.primaryAlpha = this.cData.opacitySliderInput / this.cData.POURCENT_MODIFIER;
                this.cData.primaryColor =
                    this.cData.primaryColor.substring(0, sub) + this.colorConvert.alphaRGBToHex(this.cData.primaryAlpha);
                break;
            case this.cData.SECONDARY_COLOR_MODE:
                this.cData.secondaryAlpha = this.cData.opacitySliderInput / this.cData.POURCENT_MODIFIER;
                this.cData.secondaryColor =
                    this.cData.secondaryColor.substring(0, sub) + this.colorConvert.alphaRGBToHex(this.cData.secondaryAlpha);
                break;
            case this.cData.BACKGROUND_COLOR_MODE:
                this.cData.backgroundColorAlpha = this.cData.opacitySliderInput / this.cData.POURCENT_MODIFIER;
                this.cData.backgroundColor =
                    '#' + this.cData.hexColorInput + this.colorConvert.alphaRGBToHex(this.cData.backgroundColorAlpha);
                break;
        }
        this.setColorsFromForm(this.cData.primaryColor, this.cData.secondaryColor, this.cData.backgroundColor);
        this.emitColors();
    }
    /************************ MATH SECTION ***************************/
    computeHue(event: MouseEvent): number {
        // Hue circle radius is 45px and stroke widht 10px which mean average radius is ( 55 - 45 ) / 2 = 50
        // Which is subtract from offset to center circle for math formula
        const maxRadius = 360;
        const div = 180;
        const reduce = 50;
        const radiusX: number = event.offsetX - reduce;
        const radiusY: number = event.offsetY - reduce;
        const radius: number = Math.sqrt(Math.pow(radiusX, 2) + Math.pow(radiusY, 2));
        const theta: number = Math.acos(radiusX / radius);
        let hue = 0;
        // hue is a value of 0 to 360 degree but theta is in radiant so conversion are needed depending on raduisY signe
        if (radiusY >= 0) {
            hue = (div / Math.PI) * theta;
        } else {
            hue = maxRadius - (div / Math.PI) * theta;
        }
        return hue;
    }
}
