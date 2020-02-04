import { Component } from '@angular/core';

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

    //cursor
    mycx : number = 100;
    mycy : number = 50;
    mytranslation :string;
    isColorSelecting : any = false;
    isOnColorPicker : any = false;
    isMouseup : any = false;

    //last color
    //topLastColor : string[] = ['#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff'];
    //bottomLastColor : string[] = ['#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff'];
    lastColor : string[] = ['#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff','#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff'];
    
    constructor() {}

    ngOnInit() {}

    setPrimaryColor( r : number, g : number, b : number ) {
        this.primaryColor =  '#' + this.rgbaToHex( r )+ this.rgbaToHex( g ) + this.rgbaToHex( b ) + this.rgbaToHex( this.primaryAlpha * 255);
    }

    setSecondaryColor ( r : number, g : number, b : number ) {
        this.secondaryColor = '#' + this.rgbaToHex( r )+ this.rgbaToHex( g ) + this.rgbaToHex( b ) + this.rgbaToHex( this.secondaryAlpha * 255);
    }
    setColor( color : number[] ) {
        if ( this.primarySelect ) {
            this.primaryColor = '#' + this.rgbaToHex( color[0] )+ this.rgbaToHex( color[1] ) + this.rgbaToHex( color[2] ) + this.rgbaToHex( this.primaryAlpha * 255);
            document.getElementById("colorCheckBox").checked = true;
            this.currentColorSelect = 'Primary';
        }
        else {
            //TODO : pop-up on right click??
            this.secondaryColor = '#' + this.rgbaToHex( color[0] )+ this.rgbaToHex( color[1] ) + this.rgbaToHex( color[2] ) + this.rgbaToHex( this.secondaryAlpha * 255);
            document.getElementById("colorCheckBox").checked = false;
            this.currentColorSelect = 'Secondary';
        }
        this.hexColorInput = this.rgbaToHex( color[0] )+ this.rgbaToHex( color[1] ) + this.rgbaToHex( color[2] )//only 6 char or needed for view
        this.RedSliderInput = color[0];
        this.GreenSliderInput = color[1];
        this.BlueSliderInput = color[2];
        this.hexInputRefresh();
        if (this.isMouseup ) {
            this.updateLastColor( this.hexColorInput );
        }
    }
    hueSelector( event : MouseEvent ) : void {
        if( this.isColorSelecting ) { 
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
            this.SaturationSliderInput = 100;
            this.LightnessSliderInput = 50;
            this.OpacitySliderInput = 100;
            if (this.primarySelect ) {
                this.primaryAlpha = this.OpacitySliderInput / 100;
            }
            else {
                this.secondaryAlpha = this.OpacitySliderInput / 100;
            }
            this.setSLCursor( this.SaturationSliderInput, this.LightnessSliderInput );
            this.setColor( this.hslToRgb(this.currentHue, this.SaturationSliderInput / 100, this.LightnessSliderInput / 100 ) ) ;
            this.hexInputRefresh();
        }
    }
    slSelector(event : MouseEvent) : void {
        if( this.isColorSelecting ) { 
            let x : number = event.offsetX - 2;
            let y : number = event.offsetY - 2;
            if ( x > 100 ) {
                x = 100;
            }
            else if ( x < 0 ) {
                x = 0;
            }
            if ( y > 100 ) {
                y = 100;
            }
            else if ( y < 0 ) {
                y = 0;
            }
            this.setSLCursor( x, y );
            this.SaturationSliderInput = x;
            this.LightnessSliderInput = y;
            this.setColor( this.hslToRgb(this.currentHue, this.SaturationSliderInput / 100, this.LightnessSliderInput / 100 ) ) ;
        }
    }
    setSLCursor( x : number, y : number): void {
        this.mycx = x;
        this.mycy = y;
    }

    onColorPicker() : void{}
    onMouseUp(): void{
        this.isColorSelecting = false;
        if( this.primarySelect ) {
            this.updateLastColor( this.primaryColor );
        }
        else {
            this.updateLastColor( this.secondaryColor );
        }
    }
    onMouseDown(event : MouseEvent ): void{
        this.isColorSelecting = true;
        if ( event.button === 0 ) {
            this.primarySelect = true;     
        }
        else {
            this.primarySelect = false;
        }
        this.hueSelector(event);
    }
    onMouseDown2(event : MouseEvent ): void{
        this.isColorSelecting = true;
        if ( event.button === 0 ) {
            this.primarySelect = true;     
        }
        else {
            this.primarySelect = false;
        }
        this.slSelector(event);
    }
    updateLastColor( newColor : string ) : void {
        let buffer : string[] =[];
        for(let i = 1; i < this.lastColor.length; i++ ) {
            buffer.push( this.lastColor[i] );
        }
        buffer.push( newColor.substring( 0, 7 ) );
        this.lastColor = buffer;
        /*this.topLastColor = [];
        this.bottomLastColor = [];
        for( let j = 0; j < this.lastColor.length / 2; j++) {
            this.topLastColor.push( this.lastColor[j] );
        }
        for( let z = this.lastColor.length / 2; z < this.lastColor.length; z++) {
            this.bottomLastColor.push( this.lastColor[z] );
        }*/
    }
   
    firstLastColorSelect( event : MouseEvent ) : void {
        this.lastColorSelector( event.button, this.lastColor[0] );
    }
    secondLastColorSelect( event : MouseEvent ) : void {
        this.lastColorSelector( event.button, this.lastColor[1] );
    }
    thirdLastColorSelect( event : MouseEvent ) : void {
        this.lastColorSelector( event.button, this.lastColor[2] );
    }
    fourthLastColorSelect( event : MouseEvent ) : void {
        this.lastColorSelector( event.button, this.lastColor[3] );
    }
    fifthLastColorSelect( event : MouseEvent ) : void {
        this.lastColorSelector( event.button, this.lastColor[4] );
    }
    sixthLastColorSelect( event : MouseEvent ) : void {
        this.lastColorSelector( event.button, this.lastColor[5] );
    }
    seventhLastColorSelect( event : MouseEvent ) : void {
        this.lastColorSelector( event.button, this.lastColor[6] );
    }
    eighthLastColorSelect( event : MouseEvent ) : void {
        this.lastColorSelector( event.button, this.lastColor[7] );
    }
    ninethLastColorSelect( event : MouseEvent ) : void {
        this.lastColorSelector( event.button, this.lastColor[8] );
    }
    tenthLastColorSelect( event : MouseEvent ) : void {
        this.lastColorSelector( event.button, this.lastColor[9] );
    }
    lastColorSelector( button : number, lastColor : string ) : void {
        if ( button === 0 ) {
            this.primaryColor = lastColor;// + this.rgbaToHex( this.primaryAlpha * 255 );
            document.getElementById("colorCheckBox").checked = true;
            this.primarySelect = true; 
            this.currentColorSelect = 'Primary';
        }
        else if ( button === 2 ) {
            //TODO : pop-up on right click??
            this.secondaryColor = lastColor;//  + this.rgbaToHex( this.secondaryAlpha * 255 );
            document.getElementById("colorCheckBox").checked = false;
            this.primarySelect = false; 
            this.currentColorSelect = 'Secondary';
        }
        this.hexColorInput = lastColor.substring( 1, 7 );//only 6 char or needed for view
        let color : number[] = this.hexToRgba( lastColor.substring( 1, 9 ) );
        this.RedSliderInput = color[0];
        this.GreenSliderInput = color[1];
        this.BlueSliderInput = color[2];
        this.OpacitySliderInput = Math.round( color[3] / 255 * 100 );
        let hsl : number[] = this.rgbToHsl( color[0], color[1], color[2] );
        this.currentHue = hsl[0];
        this.SaturationSliderInput = Math.round( hsl[1] * 100 );
        this.LightnessSliderInput = Math.round( hsl[2] * 100);
        this.setSLCursor( this.SaturationSliderInput, this.LightnessSliderInput );
        this.hexInputRefresh();
    }

    hslToRgb( H : number = 0, S : number = 1, L : number = 0.5 ): number[] {
        let C : number = ( 1 - Math.abs( 2 * L - 1 ) ) * S;
        let X : number = C * ( 1 - Math.abs( H / 60  % 2 - 1 ) );
        let m : number = L - C / 2;

        let R : number = 0;
        let G : number = 0;
        let B : number = 0;

        if ( ( 0 <= H ) && ( H < 60 ) ) {
            R = C;
            G = X;
            B = 0;
        }
        else if ( ( 60 <= H ) && ( H < 120 ) ) {
            R = X;
            G = C;
            B = 0;
        }
        else if ( ( 120 <= H ) && ( H < 180 ) ) {
            R = 0;
            G = C;
            B = X;
        }
        else if ( ( 180 <= H ) && ( H < 240 ) ) {
            R = 0;
            G = X;
            B = C;
        }
        else if ( ( 240 <= H ) && ( H < 300 ) ) {
            R = X;
            G = 0;
            B = C;
        }
        else if ( ( 300 <= H ) && ( H < 360 ) ) {
            R = C;
            G = 0;
            B = X;
        }
            
        let rgb : number[] = [];
        rgb[0] = Math.round( ( R + m ) * 255 );
        rgb[1] = Math.round( ( G + m ) * 255 );
        rgb[2] = Math.round( ( B + m ) * 255 );
        
        return rgb;
    }
    // convert rbg to h value of hsl.
    rgbtoHue( r : number, g : number, b : number ) : number {
        // scale dowon rgb value to a range of [ 0 , 1 ] from [ 0 , 255 ]
        let primeR : number = r / 255;
        let primeG : number = g / 255;
        let primeB : number = b / 255;

        // getting min/max and delta value of primes
        let max : number = Math.max( primeR, primeG, primeB );
        let min : number = Math.min( primeR, primeG, primeB );
        let delta : number = max - min;

        let hue : number = 0;
        // math conversion formula base on max prime
    
        if ( delta === 0 ){
            hue =0;
        }
        else if ( max === primeR ) {
            hue = ( 60 * ( ( ( primeG - primeB ) / delta ) % 6 ) );
        }
        else if ( max === primeG ) {
            hue = ( 60 * ( ( primeB - primeR ) / delta + 2 ) );
        }
        else if ( max === primeB ) {
            hue = ( 60 * ( ( primeR - primeG ) / delta + 4 ) );
        }
        // make sure hue is in [ 0 , 360 ] degree 
        if ( hue < 0 ) {
            hue = 360 + hue;
        }
        return hue;
    }

    rgbToHsl( r : number, g : number, b : number ) : number[] {
        // scale dowon rgb value to a range of [ 0 , 1 ] from [ 0 , 255 ]
        let primeR : number = r / 255;
        let primeG : number = g / 255;
        let primeB : number = b / 255;

        // getting min/max and delta value of primes
        let max : number = Math.max( primeR, primeG, primeB );
        let min : number = Math.min( primeR, primeG, primeB );
        let delta : number = max - min;

        let hue : number = 0;
        let saturation : number = 0;
        let lightness : number = 0;
        // math conversion formula base on max prime
        
        if ( delta ) {
            if ( max === primeR ) {
                hue = ( 60 * ( ( ( primeG - primeB ) / delta ) % 6 ) );
            }
            else if ( max === primeG ) {
                hue = ( 60 * ( ( primeB - primeR ) / delta + 2 ) );
            }
            else if ( max === primeB ) {
                hue = ( 60 * ( ( primeR - primeG ) / delta + 4 ) );
            }
        }
        
        // make sure hue is in [ 0 , 360 ] degree 
        if ( hue < 0 ) {
            hue = 360 + hue;
        }
        
        //this.currentHue = hue;

        lightness = ( max + min ) / 2;
        
        if ( delta ) {
            saturation = delta / ( 1 - Math.abs( ( 2 * lightness ) - 1 ) );
        }

        let hsl : number[] = [];
        hsl[0] = hue;
        hsl[1] = saturation;
        hsl[2] = lightness;
        
        return hsl;
    }
    
    rgbaToHex( r : number = 0, g : number = 0, b  : number = 0 , a : number = this.currentAlpha) : string {
        let hex : string = '' ;
        let bits : number[] = [];
        bits[0] = r >> 4;
        bits[1] = r & 0xf;
        
        for (let i = 0; i < 2; i++) {
            if (bits[i] > 9) {
                hex += String.fromCharCode(bits[i] + 55);
            }
            else {
                hex += '' + bits[i];
            }
        }    
        return hex;
    }

    hexToRgba( hex : string ) : number[] {
        let colorBits : string = hex;
        // check if first char is a # and remove it
        if (hex.charCodeAt(0) ===  35 ) {
            colorBits = hex.substring(1 , hex.length);
        } 
        let ascii0 : number = 48;
        let asciiA : number = 65;
        let asciia : number = 97;
        let rgba : number[] = [];
        let buffer : number[] = [];
        for ( let i : number = 0; i < colorBits.length; i++ ) {
            buffer[i] = colorBits.charCodeAt(i);
            if ( buffer[i] >= asciia ) {
                buffer[i] -= asciia - 10;//hex letter start at 10 
            }
            else if ( buffer[i] >= asciiA ){
                buffer[i] -=  asciiA - 10;
            }
            else {
                buffer[i] -= ascii0;
            }
        }
        for ( let j : number = 0; j < buffer.length / 2; j++) {
            rgba[j] = ( buffer[j * 2] << 4 ) | ( buffer[j * 2 + 1]);
        }
        if ( colorBits.length <= 6 ) {
            rgba[3] = -1;
        }
        if ( colorBits.length <= 4 ) {
            rgba[2] = -1;
        }
        if ( colorBits.length <= 2 ) {
            rgba[1] = -1;
        }
        return rgba;
    }
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
    onHexColorInput() : void {
        if (this.hexColorInput.length === 6) {
            this.updateSliderField( this.hexColorInput );
            if ( this.primarySelect ) {
                this.primaryColor = '#' + this.hexColorInput + this.rgbaToHex( this.primaryAlpha * 255 );
                this.updateLastColor( this.primaryColor );
            }
            else {
                this.secondaryColor = '#' + this.hexColorInput + this.rgbaToHex( this.secondaryAlpha * 255 );
                this.updateLastColor( this.secondaryColor );
            }
            this.redHexInput = this.hexColorInput.substring(0, 2);
            this.blueHexInput = this.hexColorInput.substring(2, 4);
            this.greenHexInput = this.hexColorInput.substring(4, 6);
        }
    }
    onRedHexInput() : void {
        if (this.redHexInput.length === 2) {
            if ( this.primarySelect ) {
                this.primaryColor = '#' + this.redHexInput + this.hexColorInput.substring( 2, 6 ) + this.rgbaToHex( this.primaryAlpha * 255 );
                this.updateSliderField( this.primaryColor );
                this.updateLastColor( this.primaryColor );
            }
            else {
                this.secondaryColor = '#' + this.redHexInput + this.hexColorInput.substring( 2, 6 ) + this.rgbaToHex( this.secondaryAlpha * 255 );
                this.updateSliderField( this.secondaryColor );
                this.updateLastColor( this.secondaryColor );
            }
            this.hexColorInput = this.redHexInput + this.hexColorInput.substring( 2, 6 );
        }
    }
    onGreenHexInput() : void {
        if (this.greenHexInput.length === 2) {
            if ( this.primarySelect ) {
                this.primaryColor = '#' + this.hexColorInput.substring( 0, 2 ) + this.greenHexInput + this.hexColorInput.substring( 4, 6 )  + this.rgbaToHex( this.primaryAlpha * 255 );
                this.updateSliderField( this.primaryColor );
                this.updateLastColor( this.primaryColor );
            }
            else {
                this.secondaryColor = '#' + this.hexColorInput.substring( 0, 2 ) + this.greenHexInput + this.hexColorInput.substring( 4, 6 ) + this.rgbaToHex( this.secondaryAlpha * 255 );
                this.updateSliderField( this.secondaryColor );
                this.updateLastColor( this.secondaryColor );
            }
            this.hexColorInput = this.hexColorInput.substring( 0, 2 ) + this.greenHexInput + this.hexColorInput.substring( 4, 6 );
        }
    }
    onBlueHexInput() : void {
        if (this.blueHexInput.length === 2) {
            if ( this.primarySelect ) {
                this.primaryColor = '#' + this.hexColorInput.substring( 0, 4 ) + this.blueHexInput + this.rgbaToHex( this.primaryAlpha * 255 );
                this.updateSliderField( this.primaryColor );
                this.updateLastColor( this.primaryColor );
            }
            else {
                this.secondaryColor = '#' + this.hexColorInput.substring( 0, 4 ) + this.blueHexInput + this.rgbaToHex( this.secondaryAlpha * 255 );
                this.updateSliderField( this.secondaryColor );
                this.updateLastColor( this.secondaryColor );
            }
        }
        this.hexColorInput = this.hexColorInput.substring( 0, 4 ) + this.blueHexInput;
    }
    updateSliderField( color : string) : void {
        let rgba : number[] = this.hexToRgba( color );
        this.RedSliderInput = rgba[0];
        this.GreenSliderInput = rgba[1];
        this.BlueSliderInput = rgba[2];
        if ( rgba[3] !== -1 ) {
            this.OpacitySliderInput = Math.round( rgba[3] / 255 * 100 );
        }
        
        let hsl : number[] = this.rgbToHsl( this.RedSliderInput, this.GreenSliderInput, this.BlueSliderInput );
        this.currentHue = hsl[0];
        this.SaturationSliderInput = Math.round( hsl[1] * 100 );
        this.LightnessSliderInput = Math.round( hsl[2] * 100 );
        this.setSLCursor(this.SaturationSliderInput, this.LightnessSliderInput);
    }
    // Red left input change
    onRGBSliderInput() : void {
        let hsl =this.rgbToHsl( this.RedSliderInput, this.GreenSliderInput, this.BlueSliderInput );
        this.currentHue = hsl[0];
        this.SaturationSliderInput = Math.round( hsl[1] * 100 );
        this.LightnessSliderInput = Math.round( hsl[2] * 100 ); 
        this.slSliderRefresh();
    }

    onSLSliderInput() : void {
        let rgb = this.hslToRgb( this.currentHue, this.SaturationSliderInput / 100, this.LightnessSliderInput / 100);
        this.RedSliderInput = rgb[0];
        this.GreenSliderInput = rgb[1];
        this.BlueSliderInput = rgb[2];
        this.slSliderRefresh();
    }

    slSliderRefresh() : void {
        if ( this.primarySelect === true ) {
            this.setPrimaryColor( this.RedSliderInput, this.GreenSliderInput, this.BlueSliderInput );
            this.updateLastColor( this.primaryColor );
        }
        else{        
            this.setSecondaryColor( this.RedSliderInput, this.GreenSliderInput, this.BlueSliderInput );
            this.updateLastColor( this.secondaryColor );
        }
        this.setSLCursor( this.SaturationSliderInput, this.LightnessSliderInput );
        this.hexInputRefresh();
    }
    hexInputRefresh() : void {
        this.redHexInput = this.rgbaToHex( this.RedSliderInput );
        this.greenHexInput = this.rgbaToHex( this.GreenSliderInput );
        this.blueHexInput = this.rgbaToHex( this.BlueSliderInput );
        this.hexColorInput = this.redHexInput + this.greenHexInput + this.blueHexInput;
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
    get lastColor1 (): any {
        return { 'fill': this.lastColor[0] };
    }
    get lastColor2 (): any {
        return { 'fill': this.lastColor[1] };
    }
    get lastColor3 (): any {
        return { 'fill': this.lastColor[2] };
    }
    get lastColor4 (): any {
        return { 'fill': this.lastColor[3] };
    }
    get lastColor5 (): any {
        return { 'fill': this.lastColor[4] };
    }
    get lastColor6 (): any {
        return { 'fill': this.lastColor[5] };
    }
    get lastColor7 (): any {
        return { 'fill': this.lastColor[6] };
    }
    get lastColor8 (): any {
        return { 'fill': this.lastColor[7] };
    }
    get lastColor9 (): any {
        return { 'fill': this.lastColor[8] };
    }
    get lastColor10 (): any {
        return { 'fill': this.lastColor[9] };
    }
    get cursorStyles(): any{
        return { 'transform' :  'translate(' + this.mycx + 'px,' + this.mycy + 'px)'};
    }

    // change primary alpha when primary slide change
    sliderAlphaChange() : void {
        if ( this.primarySelect === true) {
            this.primaryAlpha = this.OpacitySliderInput / 100;
            this.primaryColor = '#' + this.rgbaToHex( this.RedSliderInput ) + this.rgbaToHex( this.GreenSliderInput ) + this.rgbaToHex( this.BlueSliderInput ) + this.rgbaToHex( this.primaryAlpha * 255 );
            //this.updateLastColor( this.primaryColor );
        }
        else {
            this.secondaryAlpha = this.OpacitySliderInput / 100;
            this.secondaryColor = '#' + this.rgbaToHex( this.RedSliderInput ) + this.rgbaToHex( this.GreenSliderInput ) + this.rgbaToHex( this.BlueSliderInput ) + this.rgbaToHex( this.secondaryAlpha * 255 );
            //this.updateLastColor( this.secondaryColor );
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
        this.refreshDisplay();
    }
}