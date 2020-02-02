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
    onRGBSliderInput() : void { 
        this.colorPicking.onRGBSliderInput();
    }

    onSLSliderInput() : void { 
        this.colorPicking.onSLSliderInput();
    }
    //temp style TODO move to CSS?
    get myInputStylesRL(): any {
        return {'background': 'linear-gradient(to right, red, orange, yellow)', 
                '-webkit-background-clip': 'text',
                '-webkit-text-fill-color': 'transparent'};
    }
    get myInputStylesBL(): any {
        return { 'background': 'linear-gradient(to right, blue, purple, pink)', 
                '-webkit-background-clip': 'text',
                '-webkit-text-fill-color': 'transparent'};
    }
    get myInputStylesGL(): any {
        return { 'background': 'linear-gradient(to right, darkgreen, green, cyan)', 
                '-webkit-background-clip': 'text',
                '-webkit-text-fill-color': 'transparent'};
    }
    get myInputStylesRR(): any {
        return { 'background': 'linear-gradient(to right, red, orange, yellow)', 
                '-webkit-background-clip': 'text',
                '-webkit-text-fill-color': 'transparent'};
    }
    get myInputStylesBR(): any {
        return { 'background': 'linear-gradient(to right, blue, purple, pink)', 
                '-webkit-background-clip': 'text',
                '-webkit-text-fill-color': 'transparent'};
    }
    get myInputStylesGR(): any {
        return { 'background': 'linear-gradient(to right, darkgreen, green, cyan)', 
                '-webkit-background-clip': 'text',
                '-webkit-text-fill-color': 'transparent'};
    }
    get myInputStylesL(): any {
        return {'background': 'linear-gradient(to right, black, white)', 
                '-webkit-background-clip': 'text',
                '-webkit-text-fill-color': 'transparent'};
    }
    get myInputStylesS(): any {
        return {'background': 'linear-gradient(to right, black, white)', 
                '-webkit-background-clip': 'text',
                '-webkit-text-fill-color': 'transparent'};
    }
    get myInputStylesO(): any {
        return {'background': 'linear-gradient(to right, black, white)', 
                '-webkit-background-clip': 'text',
                '-webkit-text-fill-color': 'transparent'};
    }
    get myInputStylesHex(): any {
        return {'background': 'linear-gradient(to right, red, crimson, darkgreen, green, blue, indigo , darkblue)', 
                '-webkit-background-clip': 'text',
                '-webkit-text-fill-color': 'transparent'};
    }
    get svgStyles(): any {
        //return { 'fill': this.primaryColor,'stroke':'black','stroke-width':1};
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
        return { 'transform' : 'translate(100px,100px)  rotate(' + this.cData.currentHue + 'deg) translate(-100px,-100px) translate(' + this.cData.mycx + 'px,' + this.cData.mycy + 'px)'};
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