import { Component } from '@angular/core';
import { ColorPickingService } from '../../services/services/colorPicker/color-picking.service';
import { colorData } from './color-data';

@Component({
    selector: 'app-color-picker',
    templateUrl: './color-picker.component.html',
    styleUrls: [ './color-picker.component.scss']
})
export class ColorPickerComponent {
    
    cData = colorData;
        
    constructor(private colorPicking: ColorPickingService) {}

    ngOnInit() {}

    setColor( button : number, color : number[] ) { // DONE
       this.colorPicking.setColor(button, color)
    }

    hueSelector( event : MouseEvent ) : void { //DONE
        this.colorPicking.hueSelector(event);  
    }

    slSelector(event : MouseEvent) : void {
        this.colorPicking.slSelector(event);
    }

    // convert rbg to h value of hsl.
    swapInputDisplay(event : any) {
        this.colorPicking.swapInputDisplay(event);
    }

    refreshDisplay() : void {
        this.colorPicking.refreshDisplay();
    }

    onHexColorInput() : void { //unmoved
        this.colorPicking.onHexColorInput();
    }

    onRedHexInput() : void { //unmoved
        this.colorPicking.onRedHexInput();
    }

    onGreenHexInput() : void { //unmoved
        this.colorPicking.onGreenHexInput();
    }

    onBlueHexInput() : void { //unmoved
        this.colorPicking.onBlueHexInput();
    }

    // Red left input change
    /*onRGBSliderInput() : void { 
        this.colorPicking.onRGBSliderInput();
    }*/

    onSLSliderInput() : void { 
        this.colorPicking.onSLSliderInput();
    }
 
    get svgStyles(): any {
        return { 'transform' : 'translate(100px,100px) rotate(' + this.cData.currentHue + 'deg) translate(-100px,-100px)'};
    }
    get gradientStyles(): any{
        return { 'stop-color': 'hsl( ' + this.cData.currentHue + ', 100%, 50% )' };
    }
    get gradientStylesP(): any{
        return { 'stop-color': this.cData.primaryColor };
    }
    get gradientStylesS(): any{
        return { 'stop-color': this.cData.secondaryColor };
    }
    get cursorStyles(): any{
        return { 'transform' : 'translate(50px,50px)  rotate(' + this.cData.currentHue + 'deg) translate(-100px,-100px) translate(' + this.cData.mycx + 'px,' + this.cData.mycy + 'px)'};
    }

    // change primary alpha when primary slide change
    sliderAlphaChange() : void {
        this.colorPicking.sliderAlphaChange();
    }
    // swap color
    swapPrimarySecondary() : void {
        this.colorPicking.swapPrimarySecondary();
    }
}