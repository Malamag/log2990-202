import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
// import { ColorPickingService } from 'src/app/services/colorPicker/color-picking.service';
import { ColorConvertingService } from 'src/app/services/colorPicker/color-converting.service';
// import { Subscription } from 'rxjs';
// import { ChoosenColors } from 'src/app/models/ChoosenColors.model';
import { colorData } from '../color-data';

@Component({
    selector: 'app-mini-color-picker',
    templateUrl: './mini-color-picker.component.html',
    styleUrls: ['./mini-color-picker.component.scss'],
})
export class MiniColorPickerComponent implements OnInit {
    cData = colorData;
    offsetY: number;
    offsetX: number;
    svMaxValue: number;
    hueCursorWidth: number;
    color: string;
    hue: number;
    saturation: number;
    value: number;
    svCursorPos: {};
    isHueSelecting: boolean;
    isSVSelecting: boolean;
    colorSubject: Subject<string>;
    constructor(private colorconvert: ColorConvertingService) {
        this.offsetY = 10;
        this.offsetX = 25;
        this.svMaxValue = 100;
        this.hueCursorWidth = 6;
        this.color = '#ffffff';
        this.hue = 0;
        this.saturation = 0;
        this.value = 100;
        this.svCursorPos = { x: this.saturation, y: this.svMaxValue - this.value };
        this.isHueSelecting = false;
        this.isSVSelecting = false;
        this.colorSubject = new Subject<string>();
    }

    ngOnInit(): void {
        this.emitColor();
    }

    emitColor(): void {
        this.colorSubject.next(this.color);
    }

    setColor(): void {
        this.color = this.hsvToHex(this.hue, this.saturation / this.svMaxValue, this.value / this.svMaxValue);
        this.emitColor();
    }

    onMouseDownHue(event: MouseEvent): void {
        this.isHueSelecting = true;
        this.hueSelect(event);
    }

    onMouseDownSV(event: MouseEvent): void {
        this.isSVSelecting = true;
        this.svSelect(event);
    }

    onMouseUp(): void {
        this.isHueSelecting = false;
        this.isSVSelecting = false;
    }

    hueSelect(event: MouseEvent): void {
        if (this.isHueSelecting) {
            this.hue = Math.round((event.offsetY - this.offsetY) * (this.cData.MAX_HUE_VALUE / this.svMaxValue));
            this.setColor();
        }
    }
    svSelect(event: MouseEvent): void {
        if (this.isSVSelecting) {
            this.saturation = event.offsetX - this.offsetX;
            this.value = this.svMaxValue - (event.offsetY - this.offsetY);
            this.setColor();
        }
    }

    hsvToHex(H: number, S: number, V: number): string {
        let hex = '';
        // tslint:disable-next-line: no-magic-numbers
        const rgb: number[] = [-1, -1, -1]; // invalid index

        const DIV = 6; // Value used in the formula
        const C: number = S * V;
        const X: number = C * (1 - Math.abs(((H / (this.cData.MAX_HUE_VALUE / DIV)) % 2) - 1));
        const m: number = V - C;

        let R: number = this.cData.MIN_RGB_VALUE;
        let G: number = this.cData.MIN_RGB_VALUE;
        let B: number = this.cData.MIN_RGB_VALUE;

        // Math formula for conversion
        if (this.cData.MIN_HUE_VALUE <= H && H < this.cData.MAX_HUE_VALUE / DIV) {
            R = C;
            G = X;
            B = this.cData.MIN_RGB_VALUE;
        } else if (this.cData.MAX_HUE_VALUE / 6 <= H && H < this.cData.MAX_HUE_VALUE / 3) {
            R = X;
            G = C;
            B = this.cData.MIN_RGB_VALUE;
        } else if (this.cData.MAX_HUE_VALUE / 3 <= H && H < this.cData.MAX_HUE_VALUE / 2) {
            R = this.cData.MIN_RGB_VALUE;
            G = C;
            B = X;
        } else if (this.cData.MAX_HUE_VALUE / 2 <= H && H < (2 * this.cData.MAX_HUE_VALUE) / 3) {
            R = this.cData.MIN_RGB_VALUE;
            G = X;
            B = C;
        } else if ((2 * this.cData.MAX_HUE_VALUE) / 3 <= H && H < (5 * this.cData.MAX_HUE_VALUE) / 6) {
            R = X;
            G = this.cData.MIN_RGB_VALUE;
            B = C;
        } else if ((5 * this.cData.MAX_HUE_VALUE) / 6 <= H && H < this.cData.MAX_HUE_VALUE) {
            R = C;
            G = this.cData.MIN_RGB_VALUE;
            B = X;
        }
        rgb[0] = Math.round((R + m) * this.cData.MAX_RGB_VALUE);
        rgb[1] = Math.round((G + m) * this.cData.MAX_RGB_VALUE);
        rgb[2] = Math.round((B + m) * this.cData.MAX_RGB_VALUE);

        hex = '#' + this.colorconvert.rgbToHex(rgb[0]) + this.colorconvert.rgbToHex(rgb[1]) + this.colorconvert.rgbToHex(rgb[2]);
        return hex;
    }
    get hueCursorStyles(): {} {
        return {
            transform: 'translateY(' +
                ((Math.round(this.hue * (this.svMaxValue / this.cData.MAX_HUE_VALUE))) + (this.offsetY - this.hueCursorWidth / 2)) + 'px)'
        };
    }

    get svCursorStyles(): {} {
        return { transform: 'translate(' + this.saturation + 'px,' + (this.svMaxValue - this.value) + 'px)' };
    }
}
