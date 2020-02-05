import { Injectable } from '@angular/core';
import { ColorConvertingService } from './color-converting.service';
import { colorData } from '../../components/color-picker/color-data';
import { Subject } from 'rxjs';
import {  ChoosenColors } from '../../models/ChoosenColors.model';

@Injectable({
  providedIn: 'root'
})

export class ColorPickingService {
  cData = colorData; // Interface for Color data

  colors: ChoosenColors;
  colorSubject = new Subject<ChoosenColors>(); // le constuire à qqpart

  constructor(private colorConvert: ColorConvertingService) { }

  emitColors() { // observerved-observer design pattern
    this.colorSubject.next(this.colors);
  }

  setColorsFromForm(primary: string, secondary: string) {
    this.colors = new ChoosenColors(primary, secondary);
  }

  setPrimaryColor( r : number, g : number, b : number ) { // builds style string for svg element
    this.cData.primaryColor = 'rgba( ' + r + ', ' + g + ', ' + b + ', ' + this.cData.primaryAlpha + ' )';
    this.colors.primColor = this.cData.primaryColor;
  }

  setSecondaryColor ( r : number, g : number, b : number ) {
    this.cData.secondaryColor = 'rgba( ' + r + ', ' + g + ', ' + b + ', ' + this.cData.secondaryAlpha + ' )' ;
    this.colors.secColor = this.cData.secondaryColor;
  }
  

  slCursor(x: number, y:number) {
    this.cData.mycx = x;
    this.cData.mycy = y;
  }

  setColor( button : number, color : number[] ) {
    if ( button === 0 ) {
        this.cData.primaryColor = '#' + this.colorConvert.rgbaToHex( color[0] )+ this.colorConvert.rgbaToHex( color[1] ) + this.colorConvert.rgbaToHex( color[2] ) + this.colorConvert.rgbaToHex( this.cData.primaryAlpha * 255);
        //document.getElementById("colorCheckBox").checked = true;
        this.cData.primarySelect = true; 
        this.cData.currentColorSelect = 'Primary';
    }
    else if ( button === 2 ) {
        //TODO : pop-up on right click??
        this.cData.secondaryColor = '#' + this.colorConvert.rgbaToHex( color[0] )+ this.colorConvert.rgbaToHex( color[1] ) + this.colorConvert.rgbaToHex( color[2] ) + this.colorConvert.rgbaToHex( this.cData.secondaryAlpha * 255);
        //document.getElementById("colorCheckBox").checked = false;
        this.cData.primarySelect = false; 
        this.cData.currentColorSelect = 'Secondary';
    }
    this.cData.hexColorInput = this.colorConvert.rgbaToHex( color[0] )+ this.colorConvert.rgbaToHex( color[1] ) + this.colorConvert.rgbaToHex( color[2] )//only 6 char or needed for view
    this.cData.RedSliderInput = color[0];
    this.cData.GreenSliderInput = color[1];
    this.cData.BlueSliderInput = color[2];

  }
  hueSelector( event : MouseEvent ) : void {
        
    let radiusX : number = event.offsetX - 95; // why?
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

    this.cData.currentHue = Math.round(Hue);
    this.cData.currentLightness = 50;
    this.cData.currentSaturation = 100;
    this.setColor( event.button, this.colorConvert.hslToRgb(Hue) ) ;
  }

  swapPrimarySecondary() : void {
    let tempColor : string = this.cData.primaryColor;
    let tempAlpha : number = this.cData.primaryAlpha;

    this.cData.primaryColor = this.cData.secondaryColor;
    this.cData.primaryAlpha = this.cData.secondaryAlpha;

    this.cData.secondaryColor = tempColor;
    this.cData.secondaryAlpha = tempAlpha;
  }

  slSelector(event : MouseEvent) : void {
    this.setSLCursor( event.offsetX, event.offsetY );
    this.cData.LightnessSliderInput = event.offsetY;
    this.cData.SaturationSliderInput = event.offsetX;
    this.setColor( event.button, this.colorConvert.hslToRgb( this.cData.currentHue, event.offsetX / 100, event.offsetY /100 ) );
    
  }

  setSLCursor( x : number, y : number): void { //DONE
    this.cData.mycx = x; // le curseur devient aligné quand on y soustrait 50, but why?
    this.cData.mycy = y;
  }

  swapInputDisplay(event : any) {
    if ( event.srcElement.checked ) {
        this.cData.primarySelect = true;
    }
    else {
        this.cData.primarySelect = false;
    }
    this.refreshDisplay();
  }

  refreshDisplay() : void {
    let color : string = '' ;

    if ( this.cData.primarySelect ) {
        this.cData.currentColorSelect = 'Primary';
        color = this.cData.primaryColor;
    }
    else {
        this.cData.currentColorSelect = 'Secondary';
        color = this.cData.secondaryColor;
    }
    this.cData.hexColorInput = color.substring(1,6);
    this.updateSliderField( color );
  }

  onHexColorInput() : void {
    const CHARNUM = 6; // number of characters permitted in hexadecimal string
    if (this.cData.hexColorInput.length === CHARNUM) {
        this.updateSliderField( this.cData.hexColorInput );
        if ( this.cData.primarySelect ) {
            this.cData.primaryColor = '#' + this.cData.hexColorInput + this.colorConvert.rgbaToHex( this.cData.primaryAlpha * 255 );
        }
        else {
            this.cData.secondaryColor = '#' + this.cData.hexColorInput + this.colorConvert.rgbaToHex( this.cData.secondaryAlpha * 255 );
        }
    }
  }

    // les méthodes onRedHexInput, onGreenHex... et onBlueHex font essentiellement la mm chose...
  onRedHexInput() : void { 
      if (this.cData.redHexInput.length === 2) {
          if ( this.cData.primarySelect ) {
              this.cData.primaryColor = '#' + this.cData.redHexInput + this.cData.hexColorInput.substring( 2, 6 ) + this.colorConvert.rgbaToHex( this.cData.primaryAlpha * 255 );
              this.updateSliderField( this.cData.primaryColor );
          }
          else {
              this.cData.primaryColor = '#' + this.cData.redHexInput + this.cData.hexColorInput.substring( 2, 6 ) + this.colorConvert.rgbaToHex( this.cData.secondaryAlpha * 255 );
              this.updateSliderField( this.cData.secondaryColor );
          }
      }
  }

  onGreenHexInput() : void { //unmoved
      if (this.cData.greenHexInput.length === 2) {
          if ( this.cData.primarySelect ) {
              this.cData.primaryColor = '#' + this.cData.hexColorInput.substring( 0, 2 ) + this.cData.greenHexInput + this.cData.hexColorInput.substring( 4, 6 )  + this.colorConvert.rgbaToHex( this.cData.primaryAlpha * 255 );
              this.updateSliderField( this.cData.primaryColor );
          }
          else {
              this.cData.primaryColor = '#' + this.cData.hexColorInput.substring( 0, 2 ) + this.cData.greenHexInput + this.cData.hexColorInput.substring( 4, 6 ) + this.colorConvert.rgbaToHex( this.cData.secondaryAlpha * 255 );
              this.updateSliderField( this.cData.secondaryColor );
          }
      }
  }

  onBlueHexInput() : void { //unmoved
      if (this.cData.blueHexInput.length === 2) {
          if ( this.cData.primarySelect ) {
              this.cData.primaryColor = '#' + this.cData.hexColorInput.substring( 0, 4 ) + this.cData.blueHexInput + this.colorConvert.rgbaToHex( this.cData.primaryAlpha * 255 );
              this.updateSliderField( this.cData.primaryColor );
          }
          else {
              this.cData.primaryColor = '#' + this.cData.hexColorInput.substring( 0, 4 ) + this.cData.blueHexInput + this.colorConvert.rgbaToHex( this.cData.secondaryAlpha * 255 );
              this.updateSliderField( this.cData.secondaryColor );
          }
      }
  }

  updateSliderField( color : string) : void { //unmoved
      let rgba : number[] = this.colorConvert.hexToRgba( color );
      this.cData.RedSliderInput = rgba[0];
      this.cData.GreenSliderInput = rgba[1];
      this.cData.BlueSliderInput = rgba[2];
      if ( rgba[3] !== -1 ) {
          this.cData.OpacitySliderInput = rgba[3] / 255 * 100;
      }
      
      let hsl : number[] = this.colorConvert.rgbToHsl( this.cData.RedSliderInput, this.cData.GreenSliderInput, this.cData.BlueSliderInput );
      this.cData.currentHue = hsl[0];
      this.cData.SaturationSliderInput = Math.round( hsl[1] * 100 );
      this.cData.LightnessSliderInput = Math.round( hsl[2] * 100 );
  }
  // Red left input change
  onRGBSliderInput() : void { // RGB sliders may not be needed (see trello)
      let hsl =this.colorConvert.rgbToHsl( this.cData.RedSliderInput, this.cData.GreenSliderInput, this.cData.BlueSliderInput );
      this.cData.currentHue = hsl[0];
      this.cData.SaturationSliderInput = Math.round( hsl[1] * 100 );
      this.cData.LightnessSliderInput = Math.round( hsl[2] * 100 ); 
      this.slSliderRefresh();
  }

  onSLSliderInput() : void { //unmoved
      let rgb = this.colorConvert.hslToRgb( this.cData.currentHue, this.cData.SaturationSliderInput / 100, this.cData.LightnessSliderInput / 100);
      this.cData.RedSliderInput = rgb[0];
      this.cData.GreenSliderInput = rgb[1];
      this.cData.BlueSliderInput = rgb[2];
      this.slSliderRefresh();
  }

  slSliderRefresh() : void {
      if ( this.cData.primarySelect === true ) {
          this.setPrimaryColor( this.cData.RedSliderInput, this.cData.GreenSliderInput, this.cData.BlueSliderInput );
      }
      else{        
          this.setPrimaryColor( this.cData.RedSliderInput, this.cData.GreenSliderInput, this.cData.BlueSliderInput );
      }
      this.setSLCursor( this.cData.SaturationSliderInput, this.cData.LightnessSliderInput );
  }

  sliderAlphaChange() : void {
    if ( this.cData.primarySelect === true) {
        this.cData.primaryAlpha = this.cData.OpacitySliderInput / 100;
        this.cData.primaryColor = '#' + this.colorConvert.rgbaToHex( this.cData.RedSliderInput ) + this.colorConvert.rgbaToHex( this.cData.GreenSliderInput ) + this.colorConvert.rgbaToHex( this.cData.BlueSliderInput ) + this.colorConvert.rgbaToHex( this.cData.primaryAlpha * 255 );
    }
    else {
        this.cData.secondaryAlpha = this.cData.OpacitySliderInput / 100;
        this.cData.primaryColor = '#' + this.colorConvert.rgbaToHex( this.cData.RedSliderInput ) + this.colorConvert.rgbaToHex( this.cData.GreenSliderInput ) + this.colorConvert.rgbaToHex( this.cData.BlueSliderInput ) + this.colorConvert.rgbaToHex( this.cData.primaryAlpha * 255 );
    }
  }

  nSLSliderInput() : void { //unmoved
    let rgb = this.colorConvert.hslToRgb( this.cData.currentHue, this.cData.SaturationSliderInput / 100, this.cData.LightnessSliderInput / 100);
    this.cData.RedSliderInput = rgb[0];
    this.cData.GreenSliderInput = rgb[1];
    this.cData.BlueSliderInput = rgb[2];
    this.slSliderRefresh();
  }

}

