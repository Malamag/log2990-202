import { Component } from '@angular/core';
//import { Input } from '@angular/core';


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
    opacity : number;
    currentHue : number;
    primaryColor : string;
    secondaryColor : string;
    //Hue color circle attribut (c*name)
    cX : number;
    cY : number;
    cAvgRadius : number;
    cStrokeWidth : number;
    cColors : string[];

    //Saturation, luminosity square attribut (sqr*name)
    sqrTopLeftX : number;
    sqrTopLeftY : number;
    squareWidth : number;
    squareHeigth : number;

    constructor() {}

    ngOnInit() {

        // canvas parm init
        this.canvasBgColor = 'lightgrey';
        this.canvasHeigth = 200;//temp need to be a square
        this.canvasWidth = 200;//temp
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

        this.canvas = document.getElementById( this.canvasId );
        if ( this.canvas.getContext ){
            this.ctx = this.canvas.getContext( '2d' );
            this.drawCanvasBg();
            this.initColors();
            this.drawColorCircle();
            this.drawColorSquare();
        }
    }

    //init all color in HSLA format (H, S = 100%, L = 50%, A = Opacity)
    initColors() : void {

        this.opacity = 1.0; // default opacity
        this.currentHue = 0; // default hue
        this.primaryColor = 'hsla(255,100%,50%,0.5)';
        this.secondaryColor = 'hsla(55,100%,50%,0.5)';
        this.cColors = [];
         //this 360 hue in hsl color
         let nColor : number = 360; 
         // setting hue break point at 15 hue => 24 color total for gradient use 
         for(let i : number = 0; i < nColor; i+=15){
             this.cColors.push('hsla( ' + i + ', 100%, 50%, ' + this.opacity + ')');
         }
        
    }

    //Draw the canvas background color
    drawCanvasBg() : void {
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

    // draw the saturation and luminosity color square selector
    drawColorSquare() : void {

        for ( let i : number = 0; i < this.squareWidth; ++i ) {
            for ( let j : number = 0; j < this.squareHeigth; ++j ) {

                let s = ((i/this.squareWidth)*100)+'%';
                let l = ((j/this.squareHeigth)*100)+'%' ;
                this.ctx.fillStyle = 'hsla( ' + this.currentHue + ', ' + s + ', ' + l + ', ' + this.opacity + ' )';
                this.ctx.fillRect(this.sqrTopLeftX + i, this.sqrTopLeftY + j,1, 1);//fill a 1x1 square
            }
        }
    }

    drawPrimaryColor() : void {
        
    }
    // select the function to use when color picker is clicked;
    colorSelector( event : MouseEvent ) : void {
        
        let x : number = event.offsetX - this.cX;
        let y : number = event.offsetY - this.cY;

        
        //window.alert(event.button);
        //window.alert('x : ' + event.offsetX + ' y : ' + event.offsetY + ' r2 : ' + radiusSquare + ' ru : ' + upperRadiusSquare + ' rl : ' + lowerRadiusSquare );
        if ( this.isInCircle( x, y) || this.isInSquare( event.offsetX, event.offsetY ) ) {
            // get rgb data of a 1x1 square
            let rgbData : ImageData = this.ctx.getImageData( event.offsetX, event.offsetY, 1, 1 );
            this.currentHue = this.rgbtoHue( rgbData.data[0], rgbData.data[1], rgbData.data[2] );
             
            this.drawColorSquare();
            let newColor : string = 'rgba( ' + rgbData.data[0] + ', ' + rgbData.data[1] + ', ' + rgbData.data[2] + ', ' + this.opacity + ' )';
            if ( event.button === 0 ) {
                this.primaryColor = newColor ;
            }
            else if ( event.button === 2) {
                this.secondaryColor = newColor ;
            }
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
     
        return (( x <= upperX ) && ( x >= lowerX) && ( y <= upperY ) && (y >= lowerY ) );
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

        // math conversion formula base on max prime
        if ( max === primeR ) {
            return ( 60 * ( ( primeG - primeB ) / delta % 6 ) );
        }
        else if ( max === primeG ) {
            return ( 60 * ( ( primeB - primeR ) / delta + 2 ) );
        }
        else {
            return ( 60 * ( ( primeR - primeG ) / delta + 4 ) );
        }
    }

    rgbToHsl( r : number, g : number, b : number ) : number {
        let hue : number = this.rgbtoHue( r, g, b );
        return hue;
    }
    
    //temp style
    get myStyle1(): any {
         return { 'color': this.primaryColor};
    }
    get myStyle2(): any {
        return { 'color': this.secondaryColor};
   }
}