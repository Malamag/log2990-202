import { Injectable } from '@angular/core';
import { ColorConvertingService } from './color-converting.service';


@Injectable({
  providedIn: 'root'
})
export class ColorPickingService {
  //mycx : number = 100; //Déplacés dans colpickingservice
  //mycy : number = 50;

  saturationInput : number = 100;
  lightnessInput : number = 50;

  primaryColor: string;
  secondaryColor: string;
  primarySelect: boolean;
  currentColorSelect: string;

  hexColorInput: string;
  RedSliderInput: number;
  GreenSliderInput: number;
  BlueSliderInput: number;

  primaryAlpha: number;
  secondaryAlpha: number;
  currentHue: number;
  currentLightness: number;
  currentSaturation: number;
  redHexInput: any;
  greenHexInput: any;
  blueHexInput: any;

  constructor(private colorConverter: ColorConvertingService) { }

  slCursor(x: number, y:number) {
    this.saturationInput = x;
    this.lightnessInput = y;
  }

  setColor( button : number, color : number[] ) {
    if ( button === 0 ) {
        this.primaryColor = '#' + this.colorConverter.rgbaToHex( color[0] )+ this.colorConverter.rgbaToHex( color[1] ) + this.colorConverter.rgbaToHex( color[2] ) + this.colorConverter.rgbaToHex( this.primaryAlpha * 255);
        //document.getElementById("colorCheckBox").checked = true;
        this.primarySelect = true; 
        this.currentColorSelect = 'Primary';
    }
    else if ( button === 2 ) {
        //TODO : pop-up on right click??
        this.secondaryColor = '#' + this.colorConverter.rgbaToHex( color[0] )+ this.colorConverter.rgbaToHex( color[1] ) + this.colorConverter.rgbaToHex( color[2] ) + this.colorConverter.rgbaToHex( this.secondaryAlpha * 255);
        //document.getElementById("colorCheckBox").checked = false;
        this.primarySelect = false; 
        this.currentColorSelect = 'Secondary';
    }
    this.hexColorInput = this.colorConverter.rgbaToHex( color[0] )+ this.colorConverter.rgbaToHex( color[1] ) + this.colorConverter.rgbaToHex( color[2] )//only 6 char or needed for view
    this.RedSliderInput = color[0];
    this.GreenSliderInput = color[1];
    this.BlueSliderInput = color[2];

  }
  hueSelector( event : MouseEvent ) : void {
        
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
    this.setColor( event.button, this.colorConverter.hslToRgb(Hue) ) ;
  }

  swapPrimarySecondary() : void {
    let tempColor : string = this.primaryColor;
    let tempAlpha : number = this.primaryAlpha;

    this.primaryColor = this.secondaryColor;
    this.primaryAlpha = this.secondaryAlpha;

    this.secondaryColor = tempColor;
    this.secondaryAlpha = tempAlpha;
  }
 
}

