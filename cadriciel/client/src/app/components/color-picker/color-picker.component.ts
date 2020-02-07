import { Component, OnInit } from '@angular/core';
import { ColorPickingService } from '../../services/colorPicker/color-picking.service';
import { colorData } from './color-data';
import { ChoosenColors } from 'src/app/models/ChoosenColors.model';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-color-picker',
    templateUrl: './color-picker.component.html',
    styleUrls: [ './color-picker.component.scss']
})
export class ColorPickerComponent implements OnInit {
    
    cData = colorData;
    colorSubsc: Subscription;
        
    constructor(private colorPicking: ColorPickingService) {}

    ngOnInit() {
        this.initColors();
        this.colorPicking.emitColors();
    }

    initColors() {
        const DEF_PRIM = '#000000ff';
        const DEF_SEC = '#ff0000ff';
        this.colorSubsc = this.colorPicking.colorSubject.subscribe(
            (colors: ChoosenColors) => {
                if(colors == undefined){
                    colors = new ChoosenColors(DEF_PRIM, DEF_SEC);
                    
                }
                this.cData.primaryColor = colors.primColor;
                this.cData.secondaryColor = colors.secColor;
                
            }
        );
    }

    
    setColor(color : number[] ) { // DONE
        this.colorPicking.setColor(color)
    }
 
    hueSelector( event : MouseEvent ) : void { //DONE
        this.colorPicking.hueSelector(event);  
    }
 
    slSelector(event : MouseEvent) : void {
        this.colorPicking.slSelector(event);
    }
    onContextMenu(event : MouseEvent) : void {
        this.colorPicking.onContextMenu(event);
    }
    colorSelectOnMouseUp(): void{
        this.colorPicking.colorSelectOnMouseUp();
    }
    hueSelectorOnMouseDown(event : MouseEvent ): void{
        this.colorPicking.hueSelectorOnMouseDown(event);
    }
    selectorOnMouseLeave(event : MouseEvent): void{
        this.colorPicking.selectorOnMouseLeave(event);
    }
    slSelectorOnMouseDown(event : MouseEvent ): void{
        this.colorPicking.slSelectorOnMouseDown(event);
    }
    lastColorSelector( event : MouseEvent, lastColor : string ) : void {
        this.colorPicking.lastColorSelector(event,lastColor);
    }
    onSwapSVGMouseOver() : void {
        this.colorPicking.onSwapSVGMouseOver();
    }
    onSwapSVGMouseLeave() : void {
        this.colorPicking.onSwapSVGMouseLeave();
    }
    onSwapSVGMouseDown() : void {
        this.colorPicking.onSwapSVGMouseDown();
    }
    onSwapSVGMouseUp() : void {
        this.colorPicking.onSwapSVGMouseUp();
    }
    // convert rbg to h value of hsl.
    swapInputDisplay(event : any) {
        this.colorPicking.swapInputDisplay(event);
    }
    refreshDisplay() : void {
        this.colorPicking.refreshDisplay();
    }
    validateHexInput(event : KeyboardEvent) : void {
        this.colorPicking.validateHexInput(event);
    }
    validateHexColorInput(event : KeyboardEvent) : void {
        this.colorPicking.validateHexColorInput(event);
    }
    validateRedHexInput(event : KeyboardEvent) : void {
        this.colorPicking.validateRedHexInput(event);
    }
    validateGreenHexInput(event : KeyboardEvent) : void {
        this.colorPicking.validateGreenHexInput(event);
    }
    validateBlueHexInput(event : KeyboardEvent) : void {
        this.colorPicking.validateBlueHexInput(event);
    }
    onHexColorInput(event : any) : void { //unmoved
        this.colorPicking.onHexColorInput(event);
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

   
    onRGBSliderInput() : void { 
        this.colorPicking.onRGBSliderInput();
    }

    onSLSliderInput() : void { 
        this.colorPicking.onSLSliderInput();
    }
    
    get myInputStylesRL(): any {
        return {'background': 'white', 
                '-webkit-background-clip': 'text',
                '-webkit-text-fill-color': 'transparent'};
    }
    get myInputStylesBL(): any {
        return { 'background': 'white', 
                '-webkit-background-clip': 'text',
                '-webkit-text-fill-color': 'transparent'};
    }
    get myInputStylesGL(): any {
        return { 'background': 'white', 
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
        return {'background': 'linear-gradient(to right, white,snow)', 
                '-webkit-background-clip': 'text',
                '-webkit-text-fill-color': 'transparent'};
    }
    get myInputStylesArt(): any {
    return {'background': 'linear-gradient(to right, red, crimson, darkgreen, green, blue, indigo , darkblue)', 
            '-webkit-background-clip': 'text',
            '-webkit-text-fill-color': 'transparent'};
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
    get swapStyles(): any {
        return { 'stroke' : this.cData.swapStrokeStyle, 'font-size' : 10, 'font-style' : 'italic'};
    }
    get cursorStyles(): any{
        return { 'transform' : 'translate(' + this.cData.slCursorX + 'px,' + this.cData.slCursorY + 'px)'};
    }
    get rectOffsetBg(): any{
        return { 'fill':this.cData.rectOffsetFill };
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