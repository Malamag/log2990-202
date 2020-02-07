import { Component, OnInit, OnDestroy } from '@angular/core';
import { ColorPickingService } from '../../services/colorPicker/color-picking.service';
import { colorData } from './color-data';
import { ChoosenColors } from 'src/app/models/ChoosenColors.model';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-color-picker',
    templateUrl: './color-picker.component.html',
    styleUrls: [ './color-picker.component.scss']
})
export class ColorPickerComponent implements OnInit, OnDestroy {
    
    cData = colorData;
    colorSubsc: Subscription;
        
    constructor(private colorPicking: ColorPickingService) {}

    ngOnInit() {
        this.initColors();
        this.colorPicking.emitColors();
    }

    initColors() {
        const DEFAULT = "#ff0000"; // defining a default
        this.colorSubsc = this.colorPicking.colorSubject.subscribe(
            (colors: ChoosenColors) => {
                if(colors == undefined){
                    colors = new ChoosenColors(DEFAULT, DEFAULT);
                    
                }
                this.cData.primaryColor = colors.primColor;
                this.cData.secondaryColor = colors.secColor;
                
            }
        );
    }

    ngOnDestroy() { // avoids staying subscribed to a non-existant object
        this.colorPicking.colorSubject.unsubscribe();
    }
    setColor( button : number, color : number[] ) { // DONE
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

    // Red left input change
    onRGBSliderInput() : void { 
        this.colorPicking.onRGBSliderInput();
    }

    onSLSliderInput() : void { 
        this.colorPicking.onSLSliderInput();
    }
    //temp style TODO move to CSS?
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
    get lastColor1 (): any {
        return { 'fill': this.cData.lastColors[0] };
    }
    get lastColor2 (): any {
        return { 'fill': this.cData.lastColors[1] };
    }
    get lastColor3 (): any {
        return { 'fill': this.cData.lastColors[2] };
    }
    get lastColor4 (): any {
        return { 'fill': this.cData.lastColors[3] };
    }
    get lastColor5 (): any {
        return { 'fill': this.cData.lastColors[4] };
    }
    get lastColor6 (): any {
        return { 'fill': this.cData.lastColors[5] };
    }
    get lastColor7 (): any {
        return { 'fill': this.cData.lastColors[6] };
    }
    get lastColor8 (): any {
        return { 'fill': this.cData.lastColors[7] };
    }
    get lastColor9 (): any {
        return { 'fill': this.cData.lastColors[8] };
    }
    get lastColor10 (): any {
        return { 'fill': this.cData.lastColors[9] };
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