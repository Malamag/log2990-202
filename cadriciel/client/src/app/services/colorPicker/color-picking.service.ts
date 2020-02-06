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
  setPrimaryColor( r : number, g : number, b : number ) {
    this.cData.primaryColor = '#' + this.colorConvert.rgbaToHex( r )+ this.colorConvert.rgbaToHex( g ) + this.colorConvert.rgbaToHex( b ) + this.colorConvert.rgbaToHex( this.cData.primaryAlpha * 255);
  }

  setSecondaryColor ( r : number, g : number, b : number ) {
    this.cData.secondaryColor = '#' + this.colorConvert.rgbaToHex( r )+ this.colorConvert.rgbaToHex( g ) + this.colorConvert.rgbaToHex( b ) + this.colorConvert.rgbaToHex( this.cData.secondaryAlpha * 255);
  }

  slCursor(x: number, y:number) {
    this.cData.SaturationSliderInput = x;
    this.cData.LightnessSliderInput = y;
  }

  setColor( color : number[] ) {
    if ( this.cData.primarySelect ) {
        this.cData.primaryColor = '#' + this.colorConvert.rgbaToHex( color[0] )+ this.colorConvert.rgbaToHex( color[1] ) + this.colorConvert.rgbaToHex( color[2] ) + this.colorConvert.rgbaToHex( this.cData.primaryAlpha * 255);
        //document.getElementById("colorCheckBox").checked = true;
        this.cData.currentColorSelect = 'Primary';
    }
    else {
        //TODO : pop-up on right click??
        this.cData.secondaryColor = '#' + this.colorConvert.rgbaToHex( color[0] )+ this.colorConvert.rgbaToHex( color[1] ) + this.colorConvert.rgbaToHex( color[2] ) + this.colorConvert.rgbaToHex( this.cData.secondaryAlpha * 255);
        //document.getElementById("colorCheckBox").checked = false; 
        this.cData.currentColorSelect = 'Secondary';
    }
    this.cData.hexColorInput = this.colorConvert.rgbaToHex( color[0] )+ this.colorConvert.rgbaToHex( color[1] ) + this.colorConvert.rgbaToHex( color[2] )//only 6 char or needed for view
    this.cData.RedSliderInput = color[0];
    this.cData.GreenSliderInput = color[1];
    this.cData.BlueSliderInput = color[2];
    this.hexInputRefresh();
    if ( this.cData.isMouseup ) {
        this.updateLastColor( this.cData.hexColorInput );
    }
  }
  hueSelector( event : MouseEvent ) : void {
    if ( this.cData.isColorSelecting ) {    
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

        this.cData.currentHue = Math.round(Hue);
        this.cData.currentLightness = 50;
        this.cData.currentSaturation = 100;
        this.cData.SaturationSliderInput = 100;
        this.cData.LightnessSliderInput = 50;
        this.cData.OpacitySliderInput = 100;
        if (this.cData.primarySelect ) {
            this.cData.primaryAlpha = this.cData.OpacitySliderInput / 100;
        }
        else {
            this.cData.secondaryAlpha = this.cData.OpacitySliderInput / 100;
        }
        this.setSLCursor( this.cData.SaturationSliderInput, this.cData.LightnessSliderInput );
        this.setColor( this.colorConvert.hslToRgb(Hue) ) ;
        this.hexInputRefresh();
    }
  }
  swapPrimarySecondary() : void {
    let tempColor : string = this.cData.primaryColor;
    let tempAlpha : number = this.cData.primaryAlpha;

    this.cData.primaryColor = this.cData.secondaryColor;
    this.cData.primaryAlpha = this.cData.secondaryAlpha;

    this.cData.secondaryColor = tempColor;
    this.cData.secondaryAlpha = tempAlpha;
    this.refreshDisplay();
  }

  slSelector(event : MouseEvent) : void {
    if( this.cData.isColorSelecting ) { 
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
        this.cData.SaturationSliderInput = x;
        this.cData.LightnessSliderInput = y;
        this.setColor( this.colorConvert.hslToRgb(this.cData.currentHue, this.cData.SaturationSliderInput / 100, this.cData.LightnessSliderInput / 100 ) ) ;
    }  
  }

  setSLCursor( x : number, y : number): void { //DONE
    this.cData.mycx = x;
    this.cData.mycy = y;
  }

  onMouseUp(): void{
    this.cData.isColorSelecting = false;
    if( this.cData.primarySelect ) {
        this.updateLastColor( this.cData.primaryColor );
    }
    else {
        this.updateLastColor( this.cData.secondaryColor );
    }
  }
  onMouseDown(event : MouseEvent ): void{
    this.cData.isColorSelecting = true;
    if ( event.button === 0 ) {
        this.cData.primarySelect = true;     
    }
    else {
        this.cData.primarySelect = false;
    }
    this.hueSelector(event);
  }
  onMouseDown2(event : MouseEvent ): void{
    this.cData.isColorSelecting = true;
    if ( event.button === 0 ) {
        this.cData.primarySelect = true;     
    }
    else {
        this.cData.primarySelect = false;
    }
    this.slSelector(event);
  }
  updateLastColor( newColor : string ) : void {
    let buffer : string[] =[];
    for(let i = 1; i < this.cData.lastColor.length; i++ ) {
        buffer.push( this.cData.lastColor[i] );
    }
    buffer.push( newColor.substring( 0, 7 ) );
    this.cData.lastColor = buffer;
  }
  firstLastColorSelect( event : MouseEvent ) : void {
    this.lastColorSelector( event.button, this.cData.lastColor[0] );
  }
  secondLastColorSelect( event : MouseEvent ) : void {
    this.lastColorSelector( event.button, this.cData.lastColor[1] );
  }
  thirdLastColorSelect( event : MouseEvent ) : void {
    this.lastColorSelector( event.button, this.cData.lastColor[2] );
  }
  fourthLastColorSelect( event : MouseEvent ) : void {
    this.lastColorSelector( event.button, this.cData.lastColor[3] );
  }
  fifthLastColorSelect( event : MouseEvent ) : void {
    this.lastColorSelector( event.button, this.cData.lastColor[4] );
  }
  sixthLastColorSelect( event : MouseEvent ) : void {
    this.lastColorSelector( event.button, this.cData.lastColor[5] );
  }
  seventhLastColorSelect( event : MouseEvent ) : void {
    this.lastColorSelector( event.button, this.cData.lastColor[6] );
  }
  eighthLastColorSelect( event : MouseEvent ) : void {
    this.lastColorSelector( event.button, this.cData.lastColor[7] );
  }
  ninethLastColorSelect( event : MouseEvent ) : void {
    this.lastColorSelector( event.button, this.cData.lastColor[8] );
  }
  tenthLastColorSelect( event : MouseEvent ) : void {
    this.lastColorSelector( event.button, this.cData.lastColor[9] );
  }
  lastColorSelector( button : number, lastColor : string ) : void {
    if ( button === 0 ) {
        this.cData.primaryColor = lastColor;// + this.rgbaToHex( this.primaryAlpha * 255 );
        //document.getElementById("colorCheckBox").checked = true;
        this.cData.primarySelect = true; 
        this.cData.currentColorSelect = 'Primary';
    }
    else if ( button === 2 ) {
        //TODO : pop-up on right click??
        this.cData.secondaryColor = lastColor;//  + this.rgbaToHex( this.secondaryAlpha * 255 );
        //document.getElementById("colorCheckBox").checked = false;
        this.cData.primarySelect = false; 
        this.cData.currentColorSelect = 'Secondary';
    }
    this.cData.hexColorInput = lastColor.substring( 1, 7 );//only 6 char or needed for view
    let color : number[] = this.colorConvert.hexToRgba( lastColor.substring( 1, 9 ) );
    this.cData.RedSliderInput = color[0];
    this.cData.GreenSliderInput = color[1];
    this.cData.BlueSliderInput = color[2];
    this.cData.OpacitySliderInput = Math.round( color[3] / 255 * 100 );
    let hsl : number[] = this.colorConvert.rgbToHsl( color[0], color[1], color[2] );
    this.cData.currentHue = hsl[0];
    this.cData.SaturationSliderInput = Math.round( hsl[1] * 100 );
    this.cData.LightnessSliderInput = Math.round( hsl[2] * 100);
    this.setSLCursor( this.cData.SaturationSliderInput, this.cData.LightnessSliderInput );
    this.hexInputRefresh();
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
    this.cData.hexColorInput = color.substring(1,7);
    this.updateSliderField( color );
  }

  onHexColorInput() : void { //unmoved
    if (this.cData.hexColorInput.length === 6) {
        this.updateSliderField( this.cData.hexColorInput );
        if ( this.cData.primarySelect ) {
            this.cData.primaryColor = '#' + this.cData.hexColorInput + this.colorConvert.rgbaToHex( this.cData.primaryAlpha * 255 );
        }
        else {
            this.cData.secondaryColor = '#' + this.cData.hexColorInput + this.colorConvert.rgbaToHex( this.cData.secondaryAlpha * 255 );
        }
        this.cData.redHexInput = this.cData.hexColorInput.substring(0, 2);
        this.cData.blueHexInput = this.cData.hexColorInput.substring(2, 4);
        this.cData.greenHexInput = this.cData.hexColorInput.substring(4, 6);
    }
  }

  onRedHexInput() : void { //unmoved
      if (this.cData.redHexInput.length === 2) {
          if ( this.cData.primarySelect ) {
              this.cData.primaryColor = '#' + this.cData.redHexInput + this.cData.hexColorInput.substring( 2, 6 ) + this.colorConvert.rgbaToHex( this.cData.primaryAlpha * 255 );
              this.updateSliderField( this.cData.primaryColor );
          }
          else {
              this.cData.secondaryColor = '#' + this.cData.redHexInput + this.cData.hexColorInput.substring( 2, 6 ) + this.colorConvert.rgbaToHex( this.cData.secondaryAlpha * 255 );
              this.updateSliderField( this.cData.secondaryColor );
          }
          this.cData.hexColorInput = this.cData.redHexInput + this.cData.hexColorInput.substring( 2, 6 );
      }
  }

  onGreenHexInput() : void { //unmoved
      if (this.cData.greenHexInput.length === 2) {
          if ( this.cData.primarySelect ) {
              this.cData.primaryColor = '#' + this.cData.hexColorInput.substring( 0, 2 ) + this.cData.greenHexInput + this.cData.hexColorInput.substring( 4, 6 )  + this.colorConvert.rgbaToHex( this.cData.primaryAlpha * 255 );
              this.updateSliderField( this.cData.primaryColor );
          }
          else {
              this.cData.secondaryColor = '#' + this.cData.hexColorInput.substring( 0, 2 ) + this.cData.greenHexInput + this.cData.hexColorInput.substring( 4, 6 ) + this.colorConvert.rgbaToHex( this.cData.secondaryAlpha * 255 );
              this.updateSliderField( this.cData.secondaryColor );
          }
          this.cData.hexColorInput = this.cData.hexColorInput.substring( 0, 2 ) + this.cData.greenHexInput + this.cData.hexColorInput.substring( 4, 6 );
      }
  }

  onBlueHexInput() : void { //unmoved
      if (this.cData.blueHexInput.length === 2) {
          if ( this.cData.primarySelect ) {
              this.cData.primaryColor = '#' + this.cData.hexColorInput.substring( 0, 4 ) + this.cData.blueHexInput + this.colorConvert.rgbaToHex( this.cData.primaryAlpha * 255 );
              this.updateSliderField( this.cData.primaryColor );
          }
          else {
              this.cData.secondaryColor = '#' + this.cData.hexColorInput.substring( 0, 4 ) + this.cData.blueHexInput + this.colorConvert.rgbaToHex( this.cData.secondaryAlpha * 255 );
              this.updateSliderField( this.cData.secondaryColor );
          }
      }
      this.cData.hexColorInput = this.cData.hexColorInput.substring( 0, 4 ) + this.cData.blueHexInput;
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
      this.setSLCursor(this.cData.SaturationSliderInput, this.cData.LightnessSliderInput);
  }
  // Red left input change
  onRGBSliderInput() : void { //unmoved
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
      if ( this.cData.primarySelect ) {
          this.setPrimaryColor( this.cData.RedSliderInput, this.cData.GreenSliderInput, this.cData.BlueSliderInput );
          this.updateLastColor( this.cData.primaryColor );
      }
      else{        
          this.setSecondaryColor( this.cData.RedSliderInput, this.cData.GreenSliderInput, this.cData.BlueSliderInput );
          this.updateLastColor( this.cData.secondaryColor );
      }
      this.setSLCursor( this.cData.SaturationSliderInput, this.cData.LightnessSliderInput );
      this.hexInputRefresh();
  }

  hexInputRefresh() : void {
    this.cData.redHexInput = this.colorConvert.rgbaToHex( this.cData.RedSliderInput );
    this.cData.greenHexInput = this.colorConvert.rgbaToHex( this.cData.GreenSliderInput );
    this.cData.blueHexInput = this.colorConvert.rgbaToHex( this.cData.BlueSliderInput );
    this.cData.hexColorInput = this.cData.redHexInput + this.cData.greenHexInput + this.cData.blueHexInput;
  }
  sliderAlphaChange() : void {
    if ( this.cData.primarySelect === true) {
        this.cData.primaryAlpha = this.cData.OpacitySliderInput / 100;
        this.cData.primaryColor = '#' + this.colorConvert.rgbaToHex( this.cData.RedSliderInput ) + this.colorConvert.rgbaToHex( this.cData.GreenSliderInput ) + this.colorConvert.rgbaToHex( this.cData.BlueSliderInput ) + this.colorConvert.rgbaToHex( this.cData.primaryAlpha * 255 );
    }
    else {
        this.cData.secondaryAlpha = this.cData.OpacitySliderInput / 100;
        this.cData.secondaryColor = '#' + this.colorConvert.rgbaToHex( this.cData.RedSliderInput ) + this.colorConvert.rgbaToHex( this.cData.GreenSliderInput ) + this.colorConvert.rgbaToHex( this.cData.BlueSliderInput ) + this.colorConvert.rgbaToHex( this.cData.secondaryAlpha * 255 );
    }
  }

  
}

