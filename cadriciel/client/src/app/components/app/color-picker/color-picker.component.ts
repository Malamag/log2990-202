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
    Opacity : number;
    //Hue color circle attribut (c*name)
    cX : number;
    cY : number;
    cAvgRadius : number;
    cStrokeWidth : number;
    cColors : string[];

    //Saturation, luminosity square attribut (sqr*name)
    sqrTopLeftX : number;
    sqrTopLeftY : number;

    constructor() {}

    ngOnInit() {

        this.canvasBgColor = 'lightgrey';
        this.canvasHeigth = 200;//temp
        this.canvasWidth = 200;//temp
        this.canvasId = 'color-picker';//temp
        this.Opacity = 1.0; // default opacity
        this.cStrokeWidth = this.canvasWidth / 10; 
        this.cAvgRadius = ( this.canvasWidth - this.cStrokeWidth ) / 2;
        this.cX = this.canvasWidth / 2;
        this.cY = this.canvasHeigth / 2;

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

        this.cColors = [];
         //this 360 hue in hsl color
         let nColor : number = 360; 
         // setting hue break point at 15 hue => 24 color total for gradient use 
         for(let i : number = 0; i < nColor; i+=15){
             this.cColors.push('hsla( ' + i + ', 100%, 50%, ' + this.Opacity + ')');
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

        let squareWidth : number = this.canvasWidth / 2;
        let squareHeigth : number = this.canvasHeigth / 2;

        // square is center on canvas
        // top left corner
        let topLeftX : number = this.canvasWidth / 4;
        let topLeftY : number = this.canvasHeigth / 4;
        
        for ( let i : number = 0; i < squareWidth; ++i ) {
            for ( let j : number = 0; j < squareHeigth; ++j ) {

                let s = ((i/squareWidth)*100)+'%';
                let l = ((j/squareHeigth)*100)+'%' ;
                this.ctx.fillStyle = 'hsla( 0, ' + s + ', ' + l + ', ' + this.Opacity + ' )';
                this.ctx.fillRect(topLeftX + i, topLeftY + j,1, 1);//fill a 1x1 square
            }
        }
    }
}