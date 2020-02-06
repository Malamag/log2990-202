import { Component, OnInit, OnDestroy } from '@angular/core';
import { ColorPickingService } from '../../services/colorPicker/color-picking.service';
import { colorData } from './color-data';
import { ChoosenColors } from 'src/app/models/ChoosenColors.model';

@Component({
    selector: 'app-color-picker',
    templateUrl: './color-picker.component.html',
    styleUrls: [ './color-picker.component.scss']
})
export class ColorPickerComponent implements OnInit, OnDestroy {
    
    cData = colorData;
        
    constructor(private colorPicking: ColorPickingService) {}

    ngOnInit() {
        this.initColors();
        this.colorPicking.emitColors();
    }

    initColors() {
        const DEFAULT = "#ff0000"; // defining a default
        this.colorPicking.colorSubject.subscribe(
            (colors: ChoosenColors) => {
                if(colors == undefined){
                    colors = new ChoosenColors(DEFAULT, DEFAULT);
                    console.log("default called!");
                }
                this.cData.primaryColor = colors.primColor;
                this.cData.secondaryColor = colors.secColor;
                console.log("subscription called!");
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
    onMouseUp(): void{
        this.colorPicking.onMouseUp();
    }
    onMouseDown(event : MouseEvent ): void{
        this.colorPicking.onMouseDown(event);
    }
    onMouseDown2(event : MouseEvent ): void{
        this.colorPicking.onMouseDown2(event);
    }
    firstLastColorSelect( event : MouseEvent ) : void {
        this.colorPicking.firstLastColorSelect(event);
    }
    secondLastColorSelect( event : MouseEvent ) : void {
        this.colorPicking.secondLastColorSelect(event);
    }
    thirdLastColorSelect( event : MouseEvent ) : void {
        this.colorPicking.thirdLastColorSelect(event);
    }
    fourthLastColorSelect( event : MouseEvent ) : void {
        this.colorPicking.fourthLastColorSelect(event);
    }
    fifthLastColorSelect( event : MouseEvent ) : void {
        this.colorPicking.fifthLastColorSelect(event);
    }
    sixthLastColorSelect( event : MouseEvent ) : void {
        this.colorPicking.sixthLastColorSelect(event);
    }
    seventhLastColorSelect( event : MouseEvent ) : void {
        this.colorPicking.seventhLastColorSelect(event);
    }
    eighthLastColorSelect( event : MouseEvent ) : void {
        this.colorPicking.eighthLastColorSelect(event);
    }
    ninethLastColorSelect( event : MouseEvent ) : void {
        this.colorPicking.ninethLastColorSelect(event);
    }
    tenthLastColorSelect( event : MouseEvent ) : void {
        this.colorPicking.tenthLastColorSelect(event);
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
        return { 'fill': this.cData.lastColor[0] };
    }
    get lastColor2 (): any {
        return { 'fill': this.cData.lastColor[1] };
    }
    get lastColor3 (): any {
        return { 'fill': this.cData.lastColor[2] };
    }
    get lastColor4 (): any {
        return { 'fill': this.cData.lastColor[3] };
    }
    get lastColor5 (): any {
        return { 'fill': this.cData.lastColor[4] };
    }
    get lastColor6 (): any {
        return { 'fill': this.cData.lastColor[5] };
    }
    get lastColor7 (): any {
        return { 'fill': this.cData.lastColor[6] };
    }
    get lastColor8 (): any {
        return { 'fill': this.cData.lastColor[7] };
    }
    get lastColor9 (): any {
        return { 'fill': this.cData.lastColor[8] };
    }
    get lastColor10 (): any {
        return { 'fill': this.cData.lastColor[9] };
    }
    get cursorStyles(): any{
        return { 'transform' : 'translate(' + this.cData.mycx + 'px,' + this.cData.mycy + 'px)'};
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