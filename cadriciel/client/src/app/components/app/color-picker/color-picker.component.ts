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
    primaryColor : string = 'rgba(255, 0, 0, 1 )';
    primaryR : string;
    primaryG : string;
    primaryB : string;
    primaryAlpha : number = 1;
    secondaryColor : string = 'rgba(255, 0, 0, 1 )';;
    secondaryR : string;
    secondaryG : string;
    secondaryB : string;
    secondaryAlpha : number = 1;
    primarySelect : any = true;
    currentColorSelect : string = 'Primary';
    currentAlpha : number;

    //input style
    RedLeftInput : string = '255';
    BlueLeftInput : string = '255';
    GreenLeftInput : string = '255';
    SaturationLeftInput : string = '100';
    LightnessLeftInput : string = '50';

    mycx : number = 100;
    mycy : number = 50;
    mytranslation :string;
    
    constructor() {}

    ngOnInit() {}

    setPrimaryColor( r : number, g : number, b : number ) {
        this.primaryColor = 'rgba( ' + r + ', ' + g + ', ' + b + ', ' + this.primaryAlpha + ' )';
        this.primaryR = '' + r;
        this.primaryG = '' + g;
        this.primaryB = '' + b;
        this.RedLeftInput = this.primaryR;
        this.GreenLeftInput = this.primaryG;
        this.BlueLeftInput = this.primaryB;
        this.SaturationLeftInput = '' + Math.round( this.currentSaturation ) + '%';
        this.LightnessLeftInput = '' + Math.round( this.currentLightness ) + '%';
    }

    setSecondaryColor ( r : number, g : number, b : number ) {
        this.secondaryColor = 'rgba( ' + r + ', ' + g + ', ' + b + ', ' + this.secondaryAlpha + ' )' ;
        this.secondaryR = '' + r;
        this.secondaryG = '' + g;
        this.secondaryB = '' + b;
        this.RedLeftInput = this.secondaryR;
        this.GreenLeftInput = this.secondaryG;
        this.BlueLeftInput = this.secondaryB;
        this.SaturationLeftInput = '' + Math.round( this.currentSaturation ) + '%';
        this.LightnessLeftInput = '' + Math.round( this.currentLightness ) + '%';
    }

    colorSelector2( event : MouseEvent ) : void {
        
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
        let color = this.hslToRgb(Hue);
        
        if ( event.button === 0 ) {
            this.setPrimaryColor( color[0], color[1], color[2] );
            
        }
        else if ( event.button === 2 ) {
            //TODO : pop-up on right click??
            this.setSecondaryColor ( color[0], color[1], color[2] );
            
        }
    }
    TrisvgCursor(event : MouseEvent) : void {
        this.currentSaturation = event.offsetX ;
        this.currentLightness = event.offsetY;
        this.mycy = event.offsetY;
        this.mycx = event.offsetX;
        this.LightnessLeftInput = event.offsetY + "";
        this.SaturationLeftInput = event.offsetX + "";
        let color : number[] = this.hslToRgb(this.currentHue, this.currentSaturation / 100, this.currentLightness /100 );
        if ( event.button === 0 ) {
            this.setPrimaryColor( color[0], color[1], color[2] );
            
        }
        else if ( event.button === 2 ) {
            //TODO : pop-up on right click??
            this.setSecondaryColor ( color[0], color[1], color[2] );
            
        }
        
    }

    //
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

    rgbToHsl( r : number, g : number, b : number ) : void {
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
        
        this.currentHue = hue;

        lightness = ( max + min ) / 2;
        
        if ( delta ) {
            saturation = delta / ( 1 - Math.abs( ( 2 * lightness ) - 1 ) );
        }

        // scaling from 0..1 to 0..100
        this.currentLightness = ( lightness * 100 );
        this.currentSaturation = ( saturation * 100 );
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
        if ( this.primarySelect ) {
            this.RedLeftInput = this.primaryR;
            this.GreenLeftInput = this.primaryG;
            this.BlueLeftInput = this.primaryB;
            this.rgbToHsl( parseFloat( this.primaryR ), parseFloat( this.primaryG ), parseFloat( this.primaryB ) );
            this.currentColorSelect = 'Primary';
        }
        else {
            this.RedLeftInput = this.secondaryR;
            this.GreenLeftInput = this.secondaryG;
            this.BlueLeftInput = this.secondaryB;
            this.rgbToHsl( parseFloat( this.secondaryR ), parseFloat( this.secondaryG ), parseFloat( this.secondaryB ) );
            this.currentColorSelect = 'Secondary';
        }
        this.SaturationLeftInput = '' + Math.round( this.currentSaturation );
        this.LightnessLeftInput = '' + Math.round( this.currentLightness );
    }
    // Red left input change
    onRedLeftInput() {
        if ( this.primarySelect ) {
            //TODO : condition fail proof
            this.primaryR = this.RedLeftInput
            //TODO redraw function
            this.primaryColor = 'rgba( ' + this.primaryR + ', ' + this.primaryG + ', ' + this.primaryB + ', ' + this.primaryAlpha + ' )';
            this.rgbToHsl( parseFloat( this.primaryR ), parseFloat( this.primaryG ), parseFloat( this.primaryB ) );
        }
        else{
            //TODO : condition fail proof
            this.secondaryR = this.RedLeftInput
            //TODO redraw function
            this.secondaryColor = 'rgba( ' + this.secondaryR + ', ' + this.secondaryG + ', ' + this.secondaryB + ', ' + this.primaryAlpha + ' )';
            this.rgbToHsl( parseFloat( this.secondaryR ), parseFloat( this.secondaryG ), parseFloat( this.secondaryB ) );
        }
    }
    onGreenLeftInput() {
        if ( this.primarySelect ) {
            //TODO : condition fail proof
            this.primaryG = this.GreenLeftInput
            //TODO redraw function
            this.primaryColor = 'rgba( ' + this.primaryR + ', ' + this.primaryG + ', ' + this.primaryB + ', ' + this.primaryAlpha + ' )';
            this.rgbToHsl( parseFloat( this.primaryR ), parseFloat( this.primaryG ), parseFloat( this.primaryB ) );
        }
        else {
            //TODO : condition fail proof
            this.secondaryG = this.GreenLeftInput
            //TODO redraw function
            this.secondaryColor = 'rgba( ' + this.secondaryR + ', ' + this.secondaryG + ', ' + this.secondaryB + ', ' + this.primaryAlpha + ' )';
            this.rgbToHsl( parseFloat( this.secondaryR ), parseFloat( this.secondaryG ), parseFloat( this.secondaryB ) );
        }
       
    }
    onBlueLeftInput() {
        if ( this.primarySelect ) {
            //TODO : condition fail proof
            this.primaryB = this.BlueLeftInput
            //TODO redraw function
            this.primaryColor = 'rgba( ' + this.primaryR + ', ' + this.primaryG + ', ' + this.primaryB + ', ' + this.primaryAlpha + ' )';
            this.rgbToHsl( parseFloat( this.primaryR ), parseFloat( this.primaryG ), parseFloat( this.primaryB ) );
        }
        else {
            //TODO : condition fail proof
            this.secondaryB = this.GreenLeftInput
            //TODO redraw function
            this.secondaryColor = 'rgba( ' + this.secondaryR + ', ' + this.secondaryG + ', ' + this.secondaryB + ', ' + this.primaryAlpha + ' )';
            this.rgbToHsl( parseFloat( this.secondaryR ), parseFloat( this.secondaryG ), parseFloat( this.secondaryB ) );
        }
    }
    onSaturationLeftInput() {
        if ( this.primarySelect ) {
            //TODO : condition fail proof
            this.currentSaturation = parseFloat( this.SaturationLeftInput );
            
            //TODO : hsl to rgb
            //TODO redraw function
        }
        else{
            //TODO : condition fail proof
            this.currentSaturation = parseFloat( this.SaturationRightInput );
            
            //TODO : hsl to rgb
            //TODO redraw function
        }
    }
    onLightnessLeftInput() {
        if ( this.primarySelect ) {
            //TODO : condition fail proof
            this.currentLightness = parseFloat( this.LightnessLeftInput );
            //TODO : hsl to rgb
            //TODO redraw function
        }
        else{
            //TODO : condition fail proof
            this.currentLightness = parseFloat( this.LightnessRightInput );
            //TODO : hsl to rgb
            //TODO redraw function
        }
        
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
        return {'background': 'linear-gradient(to right, red, orange, yellow, green, blue, indigo, violet)', 
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
    get gradientStyles2(): any{
        return { 'stop-color': this.secondaryColor };
    }
    get cursorStyles(): any{
        return { 'transform' : 'translate(100px,100px)  rotate(' + this.currentHue + 'deg) translate(-100px,-100px) translate(' + this.mycx + 'px,' + this.mycy + 'px)'};
    }

    // change primary alpha when primary slide change
    primaryAlphaChange() : void {
        if ( this.primarySelect ) {
            this.primaryAlpha = this.currentAlpha;
            this.primaryColor = 'rgba( ' + this.primaryR + ', ' + this.primaryG + ', ' + this.primaryB + ', ' + this.primaryAlpha + ' )';
        }
        else {
            this.secondaryAlpha = this.currentAlpha;
            this.secondaryColor = 'rgba( ' + this.secondaryR + ', ' + this.secondaryG + ', ' + this.secondaryB + ', ' + this.secondaryAlpha + ' )';
        }
    }

    // change secondary alpha when secondary slide change
    secondaryAlphaChange() : void {
        this.secondaryColor = 'rgba( ' + this.secondaryR + ', ' + this.secondaryG + ', ' + this.secondaryB + ', ' + this.secondaryAlpha + ' )';
    }

    // swap color
    swapPrimarySecondary() : void {
        let tempColor : string = this.primaryColor;
        let tempR : string = this.primaryR;
        let tempG : string = this.primaryG;
        let tempB : string = this.primaryB;
        let tempAlpha : number = this.primaryAlpha;

        this.primaryColor = this.secondaryColor;
        this.primaryR = this.secondaryR;
        this.primaryG = this.secondaryG;
        this.primaryB = this.secondaryB;
        this.primaryAlpha = this.secondaryAlpha;

        this.secondaryColor = tempColor;
        this.secondaryR = tempR;
        this.secondaryG = tempG;
        this.secondaryB = tempB;
        this.secondaryAlpha = tempAlpha;
    }
}