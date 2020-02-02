import { Component } from '@angular/core';
import { ColorPickingService } from '../../../services/services/color-picking.service';
import { ColorConvertingService } from 'src/app/services/services/color-converting.service';
@Component({
    selector: 'app-color-picker',
    templateUrl: './color-picker.component.html',
    styleUrls: [ './color-picker.component.scss']
})
export class ColorPickerComponent {
    

    //Golbal color attribut
    currentHue : number = 0;
    currentSaturation : number = 100;
    currentLightness : number = 50;
    primaryColor : string = '#FF0000ff';
    primaryAlpha : number = 1;
    secondaryColor : string = '#FF0000ff';;
    secondaryAlpha : number = 1;
    primarySelect : any = true;
    currentColorSelect : string = 'Primary';
    currentAlpha : number;

    //input style
    hexColorInput : string = 'ff0000';
    redHexInput : string = 'ff';
    greenHexInput : string = '00';
    blueHexInput : string = '00';
    RedSliderInput : number = 255;
    BlueSliderInput : number = 0;
    GreenSliderInput : number = 0;
    SaturationSliderInput : number = 100;
    LightnessSliderInput : number = 50;
    OpacitySliderInput : number = 100;

    mycx : number = 100; //Déplacés dans colpickingservice
    mycy : number = 50;

    mytranslation :string;
    
    constructor(private colorPicking: ColorPickingService,
                private colorConvert: ColorConvertingService) {}

    ngOnInit() {}

    setPrimaryColor( r : number, g : number, b : number ) {
        this.primaryColor = 'rgba( ' + r + ', ' + g + ', ' + b + ', ' + this.primaryAlpha + ' )';
    }

    setSecondaryColor ( r : number, g : number, b : number ) {
        this.secondaryColor = 'rgba( ' + r + ', ' + g + ', ' + b + ', ' + this.secondaryAlpha + ' )' ;
    }
    
    setColor( button : number, color : number[] ) { // DONE
        if ( button === 0 ) {
            this.primaryColor = '#' + this.colorConvert.rgbaToHex( color[0] )+ this.colorConvert.rgbaToHex( color[1] ) + this.colorConvert.rgbaToHex( color[2] ) + this.colorConvert.rgbaToHex( this.primaryAlpha * 255);
            document.getElementById("colorCheckBox").checked = true;
            this.primarySelect = true; 
            this.currentColorSelect = 'Primary';
        }
        else if ( button === 2 ) {
            //TODO : pop-up on right click??
            this.secondaryColor = '#' + this.colorConvert.rgbaToHex( color[0] )+ this.colorConvert.rgbaToHex( color[1] ) + this.colorConvert.rgbaToHex( color[2] ) + this.colorConvert.rgbaToHex( this.secondaryAlpha * 255);
            document.getElementById("colorCheckBox").checked = false;
            this.primarySelect = false; 
            this.currentColorSelect = 'Secondary';
        }
        this.hexColorInput = this.colorConvert.rgbaToHex( color[0] )+ this.colorConvert.rgbaToHex( color[1] ) + this.colorConvert.rgbaToHex( color[2] );//only 6 char or needed for view
        this.RedSliderInput = color[0];
        this.GreenSliderInput = color[1];
        this.BlueSliderInput = color[2];
    }
    hueSelector( event : MouseEvent ) : void { //DONE
        
        let radiusX : number = event.offsetX - 95;
        let radiusY : number = event.offsetY - 95;
        let radius : number = Math.sqrt( Math.pow( radiusX, 2) + Math.pow( radiusY, 2) );
        let theta : number = Math.acos( radiusX / radius);
        let Hue : number = 0;
        if ( radiusY >= 0 ){
            Hue = 180 / Math.PI * theta;
        }
        else{
            Hue = 360 - 180 / Math.PI * theta;
        }

        this.currentHue = Math.round(Hue);
        this.currentLightness = 50;
        this.currentSaturation = 100;
        this.setColor( event.button, this.colorConvert.hslToRgb(Hue) ) ;
        
    }
    slSelector(event : MouseEvent) : void {
        this.setSLCursor( event.offsetX, event.offsetY );
        this.LightnessSliderInput = event.offsetY;
        this.SaturationSliderInput = event.offsetX;
        this.setColor( event.button, this.colorConvert.hslToRgb( this.currentHue, event.offsetX / 100, event.offsetY /100 ) );
        
    }
    setSLCursor( x : number, y : number): void { //DONE
        this.mycx = x;
        this.mycy = y;
    }
    // convert rbg to h value of hsl.


    swapInputDisplay(event : any) {
        if ( event.srcElement.checked ) {
            this.primarySelect = true;
        }
        else {
            this.primarySelect = false;
        }
        this.refreshDisplay();
    }

    refreshDisplay() : void {
        let color : string = '' ;
    
        if ( this.primarySelect ) {
            this.currentColorSelect = 'Primary';
            color = this.primaryColor;
        }
        else {
            this.currentColorSelect = 'Secondary';
            color = this.secondaryColor;
        }
        this.hexColorInput = color.substring(1,6);
        this.updateSliderField( color );
    }

    onHexColorInput() : void { //unmoved
        if (this.hexColorInput.length === 6) {
            this.updateSliderField( this.hexColorInput );
            if ( this.primarySelect ) {
                this.primaryColor = '#' + this.hexColorInput + this.colorConvert.rgbaToHex( this.primaryAlpha * 255 );
            }
            else {
                this.secondaryColor = '#' + this.hexColorInput + this.colorConvert.rgbaToHex( this.secondaryAlpha * 255 );
            }
        }
    }

    onRedHexInput() : void { //unmoved
        if (this.redHexInput.length === 2) {
            if ( this.primarySelect ) {
                this.primaryColor = '#' + this.redHexInput + this.hexColorInput.substring( 2, 6 ) + this.colorConvert.rgbaToHex( this.primaryAlpha * 255 );
                this.updateSliderField( this.primaryColor );
            }
            else {
                this.primaryColor = '#' + this.redHexInput + this.hexColorInput.substring( 2, 6 ) + this.colorConvert.rgbaToHex( this.secondaryAlpha * 255 );
                this.updateSliderField( this.secondaryColor );
            }
        }
    }
    onGreenHexInput() : void { //unmoved
        if (this.greenHexInput.length === 2) {
            if ( this.primarySelect ) {
                this.primaryColor = '#' + this.hexColorInput.substring( 0, 2 ) + this.greenHexInput + this.hexColorInput.substring( 4, 6 )  + this.colorConvert.rgbaToHex( this.primaryAlpha * 255 );
                this.updateSliderField( this.primaryColor );
            }
            else {
                this.primaryColor = '#' + this.hexColorInput.substring( 0, 2 ) + this.greenHexInput + this.hexColorInput.substring( 4, 6 ) + this.colorConvert.rgbaToHex( this.secondaryAlpha * 255 );
                this.updateSliderField( this.secondaryColor );
            }
        }
    }
    onBlueHexInput() : void { //unmoved
        if (this.blueHexInput.length === 2) {
            if ( this.primarySelect ) {
                this.primaryColor = '#' + this.hexColorInput.substring( 0, 4 ) + this.blueHexInput + this.colorConvert.rgbaToHex( this.primaryAlpha * 255 );
                this.updateSliderField( this.primaryColor );
            }
            else {
                this.primaryColor = '#' + this.hexColorInput.substring( 0, 4 ) + this.blueHexInput + this.colorConvert.rgbaToHex( this.secondaryAlpha * 255 );
                this.updateSliderField( this.secondaryColor );
            }
        }
    }
    updateSliderField( color : string) : void { //unmoved
        let rgba : number[] = this.colorConvert.hexToRgba( color );
        this.RedSliderInput = rgba[0];
        this.GreenSliderInput = rgba[1];
        this.BlueSliderInput = rgba[2];
        if ( rgba[3] !== -1 ) {
            this.OpacitySliderInput = rgba[3] / 255 * 100;
        }
        
        let hsl : number[] = this.colorConvert.rgbToHsl( this.RedSliderInput, this.GreenSliderInput, this.BlueSliderInput );
        this.currentHue = hsl[0];
        this.SaturationSliderInput = Math.round( hsl[1] * 100 );
        this.LightnessSliderInput = Math.round( hsl[2] * 100 );
    }
    // Red left input change
    onRGBSliderInput() : void { //unmoved
        let hsl =this.colorConvert.rgbToHsl( this.RedSliderInput, this.GreenSliderInput, this.BlueSliderInput );
        this.currentHue = hsl[0];
        this.SaturationSliderInput = Math.round( hsl[1] * 100 );
        this.LightnessSliderInput = Math.round( hsl[2] * 100 ); 
        this.slSliderRefresh();
    }

    onSLSliderInput() : void { //unmoved
        let rgb = this.colorConvert.hslToRgb( this.currentHue, this.SaturationSliderInput / 100, this.LightnessSliderInput / 100);
        this.RedSliderInput = rgb[0];
        this.GreenSliderInput = rgb[1];
        this.BlueSliderInput = rgb[2];
        this.slSliderRefresh();
    }

    slSliderRefresh() : void {
        if ( this.primarySelect === true ) {
            this.setPrimaryColor( this.RedSliderInput, this.GreenSliderInput, this.BlueSliderInput );
        }
        else{        
            this.setPrimaryColor( this.RedSliderInput, this.GreenSliderInput, this.BlueSliderInput );
        }
        this.setSLCursor( this.SaturationSliderInput, this.LightnessSliderInput );
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
        return { 'transform' : 'translate(100px,100px) rotate(' + this.currentHue + 'deg) translate(-100px,-100px)'};
    }
    get gradientStyles(): any{
        return { 'stop-color': 'hsl( ' + this.currentHue + ', 100%, 50% )' };
    }
    get gradientStylesP(): any{
        return { 'stop-color': this.primaryColor };
    }
    get gradientStylesS(): any{
        return { 'stop-color': this.secondaryColor };
    }
    get cursorStyles(): any{
        return { 'transform' : 'translate(100px,100px)  rotate(' + this.currentHue + 'deg) translate(-100px,-100px) translate(' + this.mycx + 'px,' + this.mycy + 'px)'};
    }

    // change primary alpha when primary slide change
    sliderAlphaChange() : void {
        if ( this.primarySelect === true) {
            this.primaryAlpha = this.OpacitySliderInput / 100;
            this.primaryColor = '#' + this.colorConvert.rgbaToHex( this.RedSliderInput ) + this.colorConvert.rgbaToHex( this.GreenSliderInput ) + this.colorConvert.rgbaToHex( this.BlueSliderInput ) + this.colorConvert.rgbaToHex( this.primaryAlpha * 255 );
        }
        else {
            this.secondaryAlpha = this.OpacitySliderInput / 100;
            this.primaryColor = '#' + this.colorConvert.rgbaToHex( this.RedSliderInput ) + this.colorConvert.rgbaToHex( this.GreenSliderInput ) + this.colorConvert.rgbaToHex( this.BlueSliderInput ) + this.colorConvert.rgbaToHex( this.primaryAlpha * 255 );
        }
    }
    // swap color
    swapPrimarySecondary() : void {
        let tempColor : string = this.primaryColor;
        let tempAlpha : number = this.primaryAlpha;

        this.primaryColor = this.secondaryColor;
        this.primaryAlpha = this.secondaryAlpha;

        this.secondaryColor = tempColor;
        this.secondaryAlpha = tempAlpha;
    }
}