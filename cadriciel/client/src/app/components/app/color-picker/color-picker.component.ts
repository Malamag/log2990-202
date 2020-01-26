import { Component } from '@angular/core';

@Component({
    selector: 'app-color-picker',
    templateUrl: './color-picker.component.html',
    styleUrls: [ './color-picker.component.scss']
})
export class ColorPickerComponent {
    
    //canvas attribut
    canvas : any; // canvas
    ctx : any; // context
    canvasId : string;
    canvasHeigth : number;
    canvasWidth : number;
    canvasBgColor : string; 

    //Golbal color attribut
    currentHue : number;
    currentSaturation : number;
    currentLightness : number;
    primaryColor : string;
    primaryR : string;
    primaryG : string;
    primaryB : string;
    primaryAlpha : number;
    secondaryColor : string;
    secondaryR : string;
    secondaryG : string;
    secondaryB : string;
    secondaryAlpha : number;
    primarySelect : any = true;
    currentColorSelect : string = 'Primary';
    currentAlpha : number;
    //Hue color circle attribut (c*name)
    cX : number;
    cY : number;
    cAvgRadius : number;
    cStrokeWidth : number;
    cColors : string[];

    //Saturation, lightness square attribut (sqr*name)
    sqrTopLeftX : number;
    sqrTopLeftY : number;
    squareWidth : number;
    squareHeigth : number;
    //cursor attribut
    cCursorTopLeftX : number;
    cCursorTopLeftY : number;
    cCursorWidth : number;
    sqrCursorTopLeftX : number;
    sqrCursorTopLeftY : number;
    sqrCursorWidth : number;
    cursorLineWidth : number;

    //input style
    RedLeftInput : string = '255';
    BlueLeftInput : string = '255';
    GreenLeftInput : string = '255';
    SaturationLeftInput : string = '100';
    LightnessLeftInput : string = '50';
    RedRightInput : string = '';
    BlueRightInput : string = '';
    GreenRightInput : string = '';
    SaturationRightInput : string = '';
    LightnessRightInput : string = '';

    constructor() {}

    ngOnInit() {

        // canvas parm init
        this.canvasBgColor = 'white';
        this.canvasHeigth = 50;//temp need to be a square
        this.canvasWidth = 50;//temp
        this.canvasId = 'color-picker';//temp
        
        // circle parm init
        this.cStrokeWidth = this.canvasWidth / 10; 
        this.cAvgRadius = ( this.canvasWidth - this.cStrokeWidth ) / 2;
        this.cX = this.canvasWidth / 2;
        this.cY = this.canvasHeigth / 2;

        // square parm init
         // square is center on canvas
        this.sqrTopLeftX = this.canvasWidth / 4 ;
        this.sqrTopLeftY = this.canvasHeigth / 4;
        this.squareWidth = this.canvasWidth / 2;
        this.squareHeigth = this.canvasHeigth / 2;

        // cursor parm init
        this.cCursorTopLeftX = 0;
        this.cCursorTopLeftY = 0;
        this.cCursorWidth = 4;
        this.sqrCursorTopLeftX = 0;
        this.sqrCursorTopLeftY = 0;
        this.sqrCursorWidth = 4;
        this.cursorLineWidth = 1;

        this.canvas = document.getElementById( this.canvasId );
        if ( this.canvas.getContext ){
            this.ctx = this.canvas.getContext( '2d' );
            this.drawCanvasBg();
            this.initColors();
            this.drawColorCircle();
            this.drawColorSquare();
            this.drawPrimaryColor();
            this.drawSecondaryColor();
        }
    }

    //init all color in HSLA format (H, S = 100%, L = 50%, A = Alpah)
    initColors() : void {

        
        this.currentHue = 0; // default hue
        this.currentSaturation = 100; 
        this.currentLightness = 50;
        this.primaryColor = 'rgba(255,0,0,1)';
        this.primaryR = '255';
        this.primaryG = '0';
        this.primaryB = '0';
        this.primaryAlpha = 1.0;
        this.secondaryColor = 'rgba(0,0,0,1)';
        this.secondaryR = '0';
        this.secondaryG = '0';
        this.secondaryB = '0';
        this.secondaryAlpha = 1.0;
        this.cColors = [];

        // there is 360 hue in hsl color
        let nColor : number = 360; 
        // setting hue break point at 15 hue => 24 color total for gradient use 
        for(let i : number = 0; i < nColor; i+=20){
            this.cColors.push('hsla( ' + i + ', ' + this.currentSaturation + '%, ' + this.currentLightness + '%, 1 )');
        }
        
    }

    //Draw the canvas background color
    drawCanvasBg() : void {
        /*let gradient = this.ctx.createRadialGradient(80, 50, 40, 80, 50, 100);
        gradient.addColorStop(0, "lightcyan");
        gradient.addColorStop(1, "lightgrey");
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect( 0, 0, this.canvasWidth, this.canvasHeigth );*/
        this.ctx.clearRect( 0, 0, this.canvasWidth, this.canvasHeigth );
        this.ctx.fillStyle = this.canvasBgColor;
        this.ctx.fillRect( 0, 0, this.canvasWidth, this.canvasHeigth );
    }

    //Draw the hue color circle selector 
    drawColorCircle() : void {
        
        // lenght of the arc in rad
        let partLenght : number = ( 2 * Math.PI ) / this.cColors.length;
        // position of the starting / ending location of a arc in rad
        let arcStartPos : number = 0;
        let arcEndPos : number = partLenght;
        // gradient to draw
        let gradient : any = null;
        // starting color of a gradient
        let startColor : string = '';
        // ending color of a gradient
        let endColor : string = '';

        for ( let i : number = 0; i < this.cColors.length; ++i) {
            
            startColor = this.cColors[i];
            endColor = this.cColors[ ( i + 1 ) % this.cColors.length];

            // x start / end of the next arc to draw
            let xStart : number = this.cX + Math.cos( arcStartPos ) * this.cAvgRadius;
            let xEnd : number = this.cX + Math.cos( arcEndPos ) * this.cAvgRadius;

            // y start / end of the next arc to draw
            let yStart : number = this.cY + Math.sin( arcStartPos ) * this.cAvgRadius;
            let yEnd : number = this.cY + Math.sin( arcEndPos) * this.cAvgRadius;

            this.ctx.beginPath();

            gradient = this.ctx.createLinearGradient( xStart, yStart, xEnd, yEnd );
            gradient.addColorStop( 0, startColor );
            gradient.addColorStop( 1, endColor );

            this.ctx.strokeStyle = gradient;
            this.ctx.arc( this.cX, this.cY, this.cAvgRadius, arcStartPos, arcEndPos );
            this.ctx.lineWidth = this.cStrokeWidth;
            this.ctx.stroke();

            this.ctx.closePath();

            arcStartPos = arcEndPos;
            arcEndPos += partLenght;
        }
   
    }

    // draw a basic cursor on color circle TODO : cursor ui
    drawColorCircleCursor() : void {
        this.cCursorTopLeftX =  this.cX + Math.cos( ( this.currentHue * (Math.PI / 180) ) ) * this.cAvgRadius;
        this.cCursorTopLeftY =  this.cY + Math.sin( ( this.currentHue * (Math.PI / 180) ) ) * this.cAvgRadius;
     
        this.ctx.beginPath()

        this.ctx.strokeStyle = 'black';
        this.ctx.lineWidth = this.cursorLineWidth;
        this.ctx.rect( this.cCursorTopLeftX - ( this.cCursorWidth / 2 ), this.cCursorTopLeftY - ( this.cCursorWidth / 2 ), this.cCursorWidth, this.cCursorWidth);// temp TODO ::
        this.ctx.stroke();

        this.ctx.closePath();
    }

    // draw the saturation and lightness color square selector
    drawColorSquare() : void {
        let factor = 100 / this.squareWidth // TODO : magic value 100 is basic square value
        for ( let i : number = 0; i < this.squareWidth; i += 1 / factor ) {
            for ( let j : number = 0; j < this.squareHeigth; j += 1 / factor ) {

                let s = Math.round( ( ( i / this.squareWidth ) * 100 ) ) + '%';
                let l = Math.round( ( ( j / this.squareHeigth ) * 100 ) ) + '%' ;
                this.ctx.fillStyle = 'hsla( ' + this.currentHue + ', ' + s + ', ' + l + ', 1 )';
                this.ctx.fillRect(this.sqrTopLeftX + i, this.sqrTopLeftY + j, 1, 1);//fill a 1x1 square
            }
        }
    }

    // draw a cursor on color square picker
    drawColorSquareCursor() : void {
        this.sqrCursorTopLeftX = this.sqrTopLeftX + this.currentSaturation;
        this.sqrCursorTopLeftY = this.sqrTopLeftY + this.currentLightness;

        this.ctx.beginPath()

        this.ctx.strokeStyle = 'white';
        this.ctx.lineWidth = this.cursorLineWidth;
        this.ctx.rect( this.sqrCursorTopLeftX - ( this.sqrCursorWidth / 2 ), this.sqrCursorTopLeftY - ( this.sqrCursorWidth / 2 ), this.sqrCursorWidth, this.sqrCursorWidth);// temp TODO ::
        this.ctx.stroke();

        this.ctx.closePath();

    }

    // draw Primary color
    drawPrimaryColor() : void {
        // TODO : magic number?
        this.ctx.beginPath();
        
        //let gradient = this.ctx.createRadialGradient(80, 50, 40, 80, 50, 100);
        //gradient.addColorStop(0, "lightcyan");
        //gradient.addColorStop(1, "lightgrey");
        
        this.ctx.fillStyle = this.primaryColor;
        this.ctx.moveTo( ( this.canvasWidth * 0.1 ), ( this.canvasHeigth * 0.95 ) );
        this.ctx.arcTo( ( this.canvasWidth * 0.05 ), ( this.canvasHeigth * 0.95 ) 
                        , ( this.canvasWidth * 0.05 ), ( this.canvasHeigth * 0.75 ) , ( this.canvasWidth * 0.14 ) );
        this.ctx.lineTo( ( this.canvasWidth * 0.05 ), ( this.canvasHeigth * 0.95 ) );
        this.ctx.lineTo( ( this.canvasWidth * 0.1 ), ( this.canvasHeigth * 0.95 )  );
        this.ctx.strokeStyle = this.canvasBgColor;
        this.ctx.lineWidth = this.canvasWidth * 0.05;
        this.ctx.stroke();
        
        this.ctx.closePath();
        this.ctx.fill();
    }

    // draw Secondary color
    drawSecondaryColor() : void {
        // TODO : magic number?
        this.ctx.beginPath();
        
        //let gradient = this.ctx.createRadialGradient(80, 50, 40, 80, 50, 100);
        //gradient.addColorStop(0, "lightcyan");
        //gradient.addColorStop(1, "lightgrey");
        this.ctx.fillStyle = this.secondaryColor;
        this.ctx.moveTo( ( this.canvasWidth * 0.90 ), ( this.canvasHeigth * 0.95 ) );
        this.ctx.arcTo( ( this.canvasWidth * 0.95 ), ( this.canvasHeigth * 0.95 ) 
                        , ( this.canvasWidth * 0.95 ), ( this.canvasHeigth * 0.75 ) , ( this.canvasWidth * 0.14 ) );
        this.ctx.lineTo( ( this.canvasWidth * 0.95 ), ( this.canvasHeigth * 0.95 ) );
        this.ctx.lineTo( ( this.canvasWidth * 0.9 ), ( this.canvasHeigth * 0.95 )  );
        this.ctx.strokeStyle = this.canvasBgColor;
        this.ctx.lineWidth = this.canvasWidth * 0.05;
        this.ctx.stroke();
        
        this.ctx.closePath();
        this.ctx.fill();
    }

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
        this.RedRightInput = this.secondaryR;
        this.GreenRightInput = this.secondaryG;
        this.BlueRightInput = this.secondaryB;
        this.SaturationRightInput = '' + Math.round( this.currentSaturation ) + '%';
        this.LightnessRightInput = '' + Math.round( this.currentLightness ) + '%';
    }

    // select the function to use when color picker is clicked;
    colorSelector( event : MouseEvent ) : void {
        
        let radiusX : number = event.offsetX - this.cX;
        let radiusY : number = event.offsetY - this.cY;

        
        if ( ( this.isInCircle( radiusX, radiusY ) || this.isInSquare( event.offsetX, event.offsetY ) )
                && this.isNotCircleCursor( event.offsetX, event.offsetY ) 
                && this.isNotSquareCursor( event.offsetX, event.offsetY ) ) {
            // get rgb data of a 1x1 square
            let rgbData : ImageData = this.ctx.getImageData( event.offsetX, event.offsetY, 10, 10 );
            this.rgbToHsl( rgbData.data[0], rgbData.data[1], rgbData.data[2] ); 
            this.drawCanvasBg();

            this.drawColorCircle();
            this.drawColorCircleCursor();

            this.drawColorSquare();
            //this.drawColorSquareCursor();

            if ( event.button === 0 ) {
                this.setPrimaryColor( rgbData.data[0], rgbData.data[1], rgbData.data[2] );
                
            }
            else if ( event.button === 2 ) {
                //TODO : pop-up on right click??
                this.setSecondaryColor ( rgbData.data[0], rgbData.data[1], rgbData.data[2] );
                
            }
            this.drawPrimaryColor();
            this.drawSecondaryColor();
            this.refreshDisplay();
        }
        
    }

    // return if coordinate are in circle color selector
    isInCircle( x : number, y : number ) : boolean {

        let upperRadiusSquare :number = Math.pow( this.cAvgRadius + this.cStrokeWidth / 2, 2 );
        let lowerRadiusSquare : number = Math.pow( this.cAvgRadius - this.cStrokeWidth / 2, 2 );
        let radiusSquare : number = Math.pow( x, 2 ) + Math.pow( y, 2 );
        
        return ( radiusSquare <= upperRadiusSquare && radiusSquare >= lowerRadiusSquare );
    }

    // return if coordinate are in square selector
    isInSquare( x : number, y : number ) : boolean {
        
        let lowerX : number = this.sqrTopLeftX;
        let upperX : number = this.sqrTopLeftX + this.squareWidth;

        let lowerY : number = this.sqrTopLeftY;
        let upperY : number = this.sqrTopLeftY + this.squareHeigth;
     
        return ( ( x <= upperX ) && ( x >= lowerX) && ( y <= upperY ) && (y >= lowerY ) );
    }
    
    // return if coordinate are in square selector
    isNotCircleCursor( x : number, y : number ) : boolean {
        // TODO : check
        let lowerX : number = this.cCursorTopLeftX - 2 * this.cursorLineWidth - 1;
        let upperX : number = this.cCursorTopLeftX + this.cCursorWidth + this.cursorLineWidth;

        let lowerY : number = this.cCursorTopLeftY - 2 * this.cursorLineWidth - 1;
        let upperY : number = this.cCursorTopLeftY + this.cCursorWidth +  this.cursorLineWidth;
        //window.alert(' x: ' + x + ' y: '  + y + ' ly: '  + lowerX + ' ux: '  + upperX + ' ly: '  + lowerY + ' uy: ' + upperY);
        return ( !( ( x <= upperX ) && ( x >= lowerX) && ( y <= upperY ) && ( y >= lowerY ) ) );
    }

    // return if coordinate are in square selector
    isNotSquareCursor( x : number, y : number ) : boolean {
        // TODO : check
        let lowerX : number = this.sqrCursorTopLeftX - 2 * this.cursorLineWidth - 2;
        let upperX : number = this.sqrCursorTopLeftX + this.sqrCursorWidth;

        let lowerY : number = this.sqrCursorTopLeftY - 2 * this.cursorLineWidth - 2;
        let upperY : number = this.sqrCursorTopLeftY + this.sqrCursorWidth;
        //window.alert(' x: ' + x + ' y: '  + y + ' ly: '  + lowerX + ' ux: '  + upperX + ' ly: '  + lowerY + ' uy: ' + upperY);
        return ( !( ( x <= upperX ) && ( x >= lowerX) && ( y <= upperY ) && ( y >= lowerY ) ) );
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
            this.drawCanvasBg();
            this.drawColorCircle();
            this.drawColorCircleCursor();
            this.drawColorSquare();
            //this.drawColorSquareCursor();
            this.drawPrimaryColor();
            this.drawSecondaryColor();
        }
        else{
            //TODO : condition fail proof
            this.secondaryR = this.RedLeftInput
            //TODO redraw function
            this.secondaryColor = 'rgba( ' + this.secondaryR + ', ' + this.secondaryG + ', ' + this.secondaryB + ', ' + this.primaryAlpha + ' )';
            this.rgbToHsl( parseFloat( this.secondaryR ), parseFloat( this.secondaryG ), parseFloat( this.secondaryB ) );
            this.drawCanvasBg();
            this.drawColorCircle();
            this.drawColorCircleCursor();
            this.drawColorSquare();
            //this.drawColorSquareCursor();
            this.drawPrimaryColor();
            this.drawSecondaryColor();
        }
    }
    onGreenLeftInput() {
        if ( this.primarySelect ) {
            //TODO : condition fail proof
            this.primaryG = this.GreenLeftInput
            //TODO redraw function
            this.primaryColor = 'rgba( ' + this.primaryR + ', ' + this.primaryG + ', ' + this.primaryB + ', ' + this.primaryAlpha + ' )';
            this.rgbToHsl( parseFloat( this.primaryR ), parseFloat( this.primaryG ), parseFloat( this.primaryB ) );
            this.drawCanvasBg();
            this.drawColorCircle();
            this.drawColorCircleCursor();
            this.drawColorSquare();
            //this.drawColorSquareCursor();
            this.drawPrimaryColor();
            this.drawSecondaryColor();
        }
        else {
            //TODO : condition fail proof
            this.secondaryG = this.GreenLeftInput
            //TODO redraw function
            this.secondaryColor = 'rgba( ' + this.secondaryR + ', ' + this.secondaryG + ', ' + this.secondaryB + ', ' + this.primaryAlpha + ' )';
            this.rgbToHsl( parseFloat( this.secondaryR ), parseFloat( this.secondaryG ), parseFloat( this.secondaryB ) );
            this.drawCanvasBg();
            this.drawColorCircle();
            this.drawColorCircleCursor();
            this.drawColorSquare();
            //this.drawColorSquareCursor();
            this.drawPrimaryColor();
            this.drawSecondaryColor();
        }
       
    }
    onBlueLeftInput() {
        if ( this.primarySelect ) {
            //TODO : condition fail proof
            this.primaryB = this.BlueLeftInput
            //TODO redraw function
            this.primaryColor = 'rgba( ' + this.primaryR + ', ' + this.primaryG + ', ' + this.primaryB + ', ' + this.primaryAlpha + ' )';
            this.rgbToHsl( parseFloat( this.primaryR ), parseFloat( this.primaryG ), parseFloat( this.primaryB ) );
            this.drawCanvasBg();
            this.drawColorCircle();
            this.drawColorCircleCursor();
            this.drawColorSquare();
            //this.drawColorSquareCursor();
            this.drawPrimaryColor();
            this.drawSecondaryColor();
        }
        else {
            //TODO : condition fail proof
            this.secondaryB = this.GreenLeftInput
            //TODO redraw function
            this.secondaryColor = 'rgba( ' + this.secondaryR + ', ' + this.secondaryG + ', ' + this.secondaryB + ', ' + this.primaryAlpha + ' )';
            this.rgbToHsl( parseFloat( this.secondaryR ), parseFloat( this.secondaryG ), parseFloat( this.secondaryB ) );
            this.drawCanvasBg();
            this.drawColorCircle();
            this.drawColorCircleCursor();
            this.drawColorSquare();
            //this.drawColorSquareCursor();
            this.drawPrimaryColor();
            this.drawSecondaryColor();
        }
    }
    onRedRightInput(event : KeyboardEvent) {
        //TODO : condition fail proof
        this.secondaryR = this.RedRightInput
        //TODO redraw function
        this.secondaryColor = 'rgba( ' + this.secondaryR + ', ' + this.secondaryG + ', ' + this.secondaryB + ', ' + this.primaryAlpha + ' )';
        this.rgbToHsl( parseFloat( this.secondaryR ), parseFloat( this.secondaryG ), parseFloat( this.secondaryB ) );
        this.drawCanvasBg();
        this.drawColorCircle();
        this.drawColorCircleCursor();
        this.drawColorSquare();
        this.drawColorSquareCursor();
        this.drawPrimaryColor();
        this.drawSecondaryColor();
    }
    onGreenRightInput(event : KeyboardEvent) {
        
        //TODO : condition fail proof
        this.secondaryG = this.GreenRightInput
        //TODO redraw function
        this.secondaryColor = 'rgba( ' + this.secondaryR + ', ' + this.secondaryG + ', ' + this.secondaryB + ', ' + this.primaryAlpha + ' )';
        this.rgbToHsl( parseFloat( this.secondaryR ), parseFloat( this.secondaryG ), parseFloat( this.secondaryB ) );
        //this.drawCanvasBg();
        this.drawColorCircle();
        this.drawColorCircleCursor();
        this.drawColorSquare();
        //this.drawColorSquareCursor();
        this.drawPrimaryColor();
        this.drawSecondaryColor();
    }
    onBlueRightInput(event : KeyboardEvent) {
        //TODO : condition fail proof
        this.secondaryG = this.GreenRightInput
        //TODO redraw function
        this.secondaryColor = 'rgba( ' + this.secondaryR + ', ' + this.secondaryG + ', ' + this.secondaryB + ', ' + this.primaryAlpha + ' )';
        this.rgbToHsl( parseFloat( this.secondaryR ), parseFloat( this.secondaryG ), parseFloat( this.secondaryB ) );
        this.drawCanvasBg();
        this.drawColorCircle();
        this.drawColorCircleCursor();
        this.drawColorSquare();
        this.drawColorSquareCursor();
        this.drawPrimaryColor();
        this.drawSecondaryColor();
    }
    onSaturationLeftInput() {
        if ( this.primarySelect ) {
            //TODO : condition fail proof
            this.currentSaturation = parseFloat( this.SaturationLeftInput );
            
            //TODO : hsl to rgb
            //TODO redraw function
            //this.drawCanvasBg();
            //this.drawColorCircle();
            //this.drawColorCircleCursor();
            //this.drawColorSquare();
            //this.drawColorSquareCursor();
            this.drawPrimaryColor();
            //this.drawSecondaryColor();
        }
        else{
            //TODO : condition fail proof
            this.currentSaturation = parseFloat( this.SaturationRightInput );
            
            //TODO : hsl to rgb
            //TODO redraw function
            //this.drawCanvasBg();
            //this.drawColorCircle();
            //this.drawColorCircleCursor();
            //this.drawColorSquare();
            //this.drawColorSquareCursor();
            //this.drawPrimaryColor();
            this.drawSecondaryColor();
        }
    }
    onLightnessLeftInput() {
        if ( this.primarySelect ) {
            //TODO : condition fail proof
            this.currentLightness = parseFloat( this.LightnessLeftInput );
            //TODO : hsl to rgb
            //TODO redraw function
            
            //this.drawCanvasBg();
            //this.drawColorCircle();
            //this.drawColorCircleCursor();
            //this.drawColorSquare();
            //this.drawColorSquareCursor();
            this.drawPrimaryColor();
            //this.drawSecondaryColor();
        }
        else{
            //TODO : condition fail proof
            this.currentLightness = parseFloat( this.LightnessRightInput );
            //TODO : hsl to rgb
            //TODO redraw function
            //this.drawCanvasBg();
            //this.drawColorCircle();
            //this.drawColorCircleCursor();
            //this.drawColorSquare();
            //this.drawColorSquareCursor();
            //this.drawPrimaryColor();
            this.drawSecondaryColor();
        }
        
    }
    onSaturationRightInput(event : KeyboardEvent) {
        //TODO : condition fail proof
        this.currentSaturation = parseFloat( this.SaturationRightInput );
        
        //TODO : hsl to rgb
        //TODO redraw function
        this.drawCanvasBg();
        this.drawColorCircle();
        this.drawColorCircleCursor();
        this.drawColorSquare();
        this.drawColorSquareCursor();
        this.drawPrimaryColor();
        this.drawSecondaryColor();
    }
    onLightnessRightInput(event : KeyboardEvent) {
        //TODO : condition fail proof
        this.currentLightness = parseFloat( this.LightnessRightInput );
        //TODO : hsl to rgb
        //TODO redraw function
        this.drawCanvasBg();
        this.drawColorCircle();
        this.drawColorCircleCursor();
        this.drawColorSquare();
        this.drawColorSquareCursor();
        this.drawPrimaryColor();
        this.drawSecondaryColor();
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
    

    // change primary alpha when primary slide change
    primaryAlphaChange() : void {
        if ( this.primarySelect ) {
            this.primaryAlpha = this.currentAlpha;
            this.primaryColor = 'rgba( ' + this.primaryR + ', ' + this.primaryG + ', ' + this.primaryB + ', ' + this.primaryAlpha + ' )';
            this.drawPrimaryColor();
        }
        else {
            this.secondaryAlpha = this.currentAlpha;
            this.secondaryColor = 'rgba( ' + this.secondaryR + ', ' + this.secondaryG + ', ' + this.secondaryB + ', ' + this.secondaryAlpha + ' )';
            this.drawSecondaryColor();
        }
    }

    // change secondary alpha when secondary slide change
    secondaryAlphaChange() : void {
        this.secondaryColor = 'rgba( ' + this.secondaryR + ', ' + this.secondaryG + ', ' + this.secondaryB + ', ' + this.secondaryAlpha + ' )';
        this.drawSecondaryColor();
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

        let buffer : string = this.RedLeftInput;
        this.RedLeftInput = this.RedRightInput;
        this.RedRightInput = buffer;

        buffer = this.GreenLeftInput;
        this.GreenLeftInput = this.GreenRightInput;
        this.GreenRightInput = buffer;

        buffer = this.BlueLeftInput;
        this.BlueLeftInput = this.BlueRightInput;
        this.BlueRightInput = buffer;

        buffer = this.SaturationLeftInput;
        this.SaturationLeftInput = this.SaturationRightInput;
        this.SaturationRightInput = buffer;

        buffer = this.LightnessLeftInput;
        this.LightnessLeftInput = this.LightnessRightInput;
        this.LightnessRightInput = buffer;

        this.drawPrimaryColor();
        this.drawSecondaryColor();
    }
}