import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ChoosenColors } from 'src/app/models/ChoosenColors.model';
import { ColorPickingService } from '../../services/colorPicker/color-picking.service';
import { colorData } from './color-data';

@Component({
    selector: 'app-color-picker',
    templateUrl: './color-picker.component.html',
    styleUrls: [ './color-picker.component.scss']
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
        this.colorSubsc = this.colorPicking.colorSubject.subscribe(
            (colors: ChoosenColors) => {
                if (colors == undefined) {
                    colors = new ChoosenColors(DEF_PRIM, DEF_SEC);

                }
                this.cData.primaryColor = colors.primColor;
                this.cData.secondaryColor = colors.secColor;

            }
        );
    }

    setColor(color: number[] ) { // DONE
        this.colorPicking.setColor(color)
    }

    hueSelector( event: MouseEvent ): void { // DONE
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
    hueSelectorOnMouseDown(event: MouseEvent ): void {
        this.colorPicking.hueSelectorOnMouseDown(event);
    }
    selectorOnMouseLeave(event: MouseEvent): void {
        this.colorPicking.selectorOnMouseLeave(event);
    }
    slSelectorOnMouseDown(event: MouseEvent ): void {
        this.colorPicking.slSelectorOnMouseDown(event);
    }
    lastColorSelector( event: MouseEvent, lastColor: string ): void {
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
    // convert rbg to h value of hsl.
    swapInputDisplay(event: any) {
        this.colorPicking.swapInputDisplay(event);
    }

    validateHexInput(event: KeyboardEvent, hexLenght: number, hex: string): void {
        this.colorPicking.validateHexInput(event, hexLenght, hex);
    }
    onHexInput(hexLength: number, hex: string, hexInputField: string): void { // unmoved
        this.colorPicking.onHexInput(hexLength, hex, hexInputField);
    }

    onRGBSliderInput(slider: string): void {
        this.colorPicking.onRGBSliderInput(slider);
    }

    onSLSliderInput(): void {
        this.colorPicking.onSLSliderInput();
    }

    get svgStyles(): any {
        return { transform : 'translate(100px,100px) rotate(' + this.cData.currentHue + 'deg) translate(-100px,-100px)'};
    }
    get gradientStyles(): any {
        return { 'stop-color': 'hsl( ' + this.cData.currentHue + ', 100%, 50% )' };
    }
    get gradientStylesP(): any {
        return { 'stop-color': this.cData.primaryColor };
    }
    get gradientStylesS(): any {
        return { 'stop-color': this.cData.secondaryColor };
    }
    get swapStyles(): any {
        return { 'stroke' : this.cData.swapStrokeStyle, 'font-size' : 10, 'font-style' : 'italic'};
    }
    get cursorStyles(): any {
        return { transform : 'translate(' + this.cData.slCursorX + 'px,' + this.cData.slCursorY + 'px)'};
    }
    get rectOffsetBg(): any {
        return { fill: this.cData.rectOffsetFill };
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
