import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ChoosenColors } from 'src/app/models/ChoosenColors.model';
import { ColorPickingService } from '../../services/colorPicker/color-picking.service';
import { colorData } from './color-data';

@Component({
    selector: 'app-color-picker',
    templateUrl: './color-picker.component.html',
    styleUrls: ['./color-picker.component.scss'],
})
export class ColorPickerComponent implements OnInit {
    cData = colorData;
    colorSubsc: Subscription;

    constructor(public colorPicking: ColorPickingService) {}

    ngOnInit() {
        this.initColors();
        this.colorPicking.emitColors();
    }

    initColors() {
        const DEF_PRIM = '#000000ff';
        const DEF_SEC = '#ff0000ff';
        const DEF_BG = '#ffffffff';
        this.colorSubsc = this.colorPicking.colorSubject.subscribe((colors: ChoosenColors) => {
            if (colors == undefined) {
                colors = new ChoosenColors(DEF_PRIM, DEF_SEC, DEF_BG);
            }
            this.cData.primaryColor = colors.primColor;
            this.cData.secondaryColor = colors.secColor;
            this.cData.backgroundColor = colors.backColor;
        });
    }

    setColor(color: number[]) {
        this.colorPicking.setColor(color);
    }

    hueSelector(event: MouseEvent): void {
        this.colorPicking.hueSelector(event);
    }

    slSelector(event: MouseEvent): void {
        this.colorPicking.slSelector(event);
    }
    onContextMenu(event: MouseEvent): void {
        this.colorPicking.onContextMenu(event);
    }
    colorSelectOnMouseUp(): void {
        this.colorPicking.colorSelectOnMouseUp();
    }
    hueSelectorOnMouseDown(event: MouseEvent): void {
        this.colorPicking.hueSelectorOnMouseDown(event);
    }
    selectorOnMouseLeave(event: MouseEvent): void {
        this.colorPicking.selectorOnMouseLeave(event);
    }
    slSelectorOnMouseDown(event: MouseEvent): void {
        this.colorPicking.slSelectorOnMouseDown(event);
    }
    lastColorSelector(event: MouseEvent, lastColor: string): void {
        this.colorPicking.lastColorSelector(event, lastColor);
    }
    onSwapSVGMouseOver(): void {
        this.colorPicking.onSwapSVGMouseOver();
    }
    onSwapSVGMouseLeave(): void {
        this.colorPicking.onSwapSVGMouseLeave();
    }
    onSwapSVGMouseDown(): void {
        this.colorPicking.onSwapSVGMouseDown();
    }
    onSwapSVGMouseUp(): void {
        this.colorPicking.onSwapSVGMouseUp();
    }
    onRadioButtonChange(newColorMode: string): void {
        this.colorPicking.onRadioButtonChange(newColorMode);
    }
    swapInputDisplay() {
        this.colorPicking.swapInputDisplay();
    }

    validateHexInput(event: KeyboardEvent, hexLenght: number, hex: string): void {
        this.colorPicking.validateHexInput(event, hexLenght, hex);
    }
    onHexInput(hexLength: number, hex: string, hexInputField: string): void {
        this.colorPicking.onHexInput(hexLength, hex, hexInputField);
    }
    onSLSliderInput(): void {
        this.colorPicking.onSLSliderInput();
    }

    get svgStyles(): any {
        return { transform: 'translate(50px,50px) rotate(' + this.cData.currentHue + 'deg) translate(-50px,-50px)' };
    }
    get cursorStyles(): any {
        return { transform: 'translate(' + this.cData.slCursorX + 'px,' + this.cData.slCursorY + 'px)' };
    }
    // change primary alpha when primary slide change
    sliderAlphaChange(): void {
        this.colorPicking.sliderAlphaChange();
    }
    // swap color
    swapPrimarySecondary(): void {
        this.colorPicking.swapPrimarySecondary();
    }
}
