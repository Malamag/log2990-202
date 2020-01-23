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
    //Hue circle attribut (c*name)
    cradius : number;
    cstroke : number;

    //Saturation, luminosity square attribut (sqr*name)
    sqrTopLeftX : number;
    sqrTopLeftY : number;

    constructor() {}

    ngOnInit() {

        this.canvasBgColor = 'lightgrey';
        this.canvasHeigth = 200;//temp
        this.canvasWidth = 200;//temp
        this.canvasId = 'color-picker';//temp

        this.canvas = document.getElementById( this.canvasId );
        if ( this.canvas.getContext ){
            this.ctx = this.canvas.getContext( '2d' );
            this.drawCanvasBg();
        }
    }

    //Draw the canvas background color
    drawCanvasBg() : void {
        this.ctx.clearRect( 0, 0, this.canvasWidth, this.canvasHeigth );
        this.ctx.fillStyle = this.canvasBgColor;
        this.ctx.fillRect( 0, 0, this.canvasWidth, this.canvasHeigth );
    }
}