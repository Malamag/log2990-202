import { Injectable } from '@angular/core';
import { ColorConvertingService } from './color-converting.service';
import { colorData } from '../../components/color-picker/color-data';
import { Subject } from 'rxjs';
import { ChoosenColors } from '../../models/ChoosenColors.model';


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

  slCursor(x: number, y:number) {
    this.cData.saturationSliderInput = x;
    this.cData.lightnessSliderInput = y;
  }

  setColor( color : number[] ) {
    if ( this.cData.primarySelect ) {
        this.cData.primaryColor = '#' + this.colorConvert.rgbaToHex( color[0] )+ this.colorConvert.rgbaToHex( color[1] ) + this.colorConvert.rgbaToHex( color[2] ) + this.colorConvert.rgbaToHex( this.cData.primaryAlpha * 255);
        this.cData.checkboxSliderStatus = true;
        this.cData.currentColorSelect = 'Primary';
    }
    else {
        //TODO : pop-up on right click??
        this.cData.secondaryColor = '#' + this.colorConvert.rgbaToHex( color[0] )+ this.colorConvert.rgbaToHex( color[1] ) + this.colorConvert.rgbaToHex( color[2] ) + this.colorConvert.rgbaToHex( this.cData.secondaryAlpha * 255);
        this.cData.checkboxSliderStatus = false; 
        this.cData.currentColorSelect = 'Secondary';
    }
    this.cData.hexColorInput = this.colorConvert.rgbaToHex( color[0] )+ this.colorConvert.rgbaToHex( color[1] ) + this.colorConvert.rgbaToHex( color[2] )//only 6 char or needed for view
    this.cData.redSliderInput = color[0];
    this.cData.greenSliderInput = color[1];
    this.cData.blueSliderInput = color[2];
    this.hexInputRefresh();
    if ( this.cData.isMouseup ) {
        this.updateLastColor( this.cData.hexColorInput );
        this.setColorsFromForm(this.cData.primaryColor, this.cData.secondaryColor);
        this.emitColors();
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
        this.cData.saturationSliderInput = 100;
        this.cData.lightnessSliderInput = 50;
        this.cData.opacitySliderInput = 100;
        if (this.cData.primarySelect ) {
            this.cData.primaryAlpha = this.cData.opacitySliderInput / 100;
        }
        else {
            this.cData.secondaryAlpha = this.cData.opacitySliderInput / 100;
        }
        this.setSLCursor( this.cData.saturationSliderInput, this.cData.lightnessSliderInput );
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
        this.cData.saturationSliderInput = x;
        this.cData.lightnessSliderInput = y;
        this.setColor( this.colorConvert.hslToRgb(this.cData.currentHue, this.cData.saturationSliderInput / 100, this.cData.lightnessSliderInput / 100 ) ) ;
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
        this.cData.primaryColor = lastColor;
        this.cData.checkboxSliderStatus = true;
        this.cData.primarySelect = true; 
        this.cData.currentColorSelect = 'Primary';
    }
    else if ( button === 2 ) {
        //TODO : pop-up on right click??
        this.cData.secondaryColor = lastColor;
        this.cData.checkboxSliderStatus = false;
        this.cData.primarySelect = false; 
        this.cData.currentColorSelect = 'Secondary';
    }
    this.cData.hexColorInput = lastColor.substring( 1, 7 );//only 6 char or needed for view
    let color : number[] = this.colorConvert.hexToRgba( lastColor.substring( 1, 9 ) );
    this.cData.redSliderInput = color[0];
    this.cData.greenSliderInput = color[1];
    this.cData.blueSliderInput = color[2];
    this.cData.opacitySliderInput = Math.round( color[3] / 255 * 100 );
    let hsl : number[] = this.colorConvert.rgbToHsl( color[0], color[1], color[2] );
    this.cData.currentHue = hsl[0];
    this.cData.saturationSliderInput = Math.round( hsl[1] * 100 );
    this.cData.lightnessSliderInput = Math.round( hsl[2] * 100);
    this.setSLCursor( this.cData.saturationSliderInput, this.cData.lightnessSliderInput );
    this.hexInputRefresh();
    this.setColorsFromForm(this.cData.primaryColor, this.cData.secondaryColor);
    this.emitColors();
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
  validateHex(hexString : string) : any {
    let hexOk : any = true;
    let valideNubmer : any[] = [];
    for(let i : number = 0; i < hexString.length; i++) {
      for( let j: number = 0; j < this.cData.hexNumber.length; j++){
        valideNubmer[i] = false;
        if ( hexString[i] === this.cData.hexNumber[j] ){
          valideNubmer[i] = true;
          break;
        }
      }
    }
    let badChar : string = '';
    for( let z : number = 0; z < valideNubmer.length; z++){
      if(!valideNubmer[z]){
        badChar += hexString[z];
        hexOk = false;
      }
    } 
    if (!hexOk && hexString.length > 0){
      if (badChar.length < 2){
        window.alert( badChar + " n'est pas un chiffre hexadécimale valide!");
      }
      else{
        window.alert( badChar + " ne sont pas des chiffres hexadécimale valide!");
      }
      
    }
    return hexOk;
  }
  onHexColorInput() : void { //unmoved
      if ( this.cData.hexColorInput.length === 6) {
        if( this.validateHex(this.cData.hexColorInput) ) {
          this.updateSliderField( this.cData.hexColorInput );
          if ( this.cData.primarySelect ) {
              this.cData.primaryColor = '#' + this.cData.hexColorInput + this.colorConvert.rgbaToHex( this.cData.primaryAlpha * 255 );
          }
          else {
              this.cData.secondaryColor = '#' + this.cData.hexColorInput + this.colorConvert.rgbaToHex( this.cData.secondaryAlpha * 255 );
          }
          this.cData.redHexInput = this.cData.hexColorInput.substring(0, 2);
          this.cData.greenHexInput = this.cData.hexColorInput.substring(2, 4);
          this.cData.blueHexInput = this.cData.hexColorInput.substring(4, 6);
        }
      }
  }

  onRedHexInput() : void { //unmoved
      if ( this.cData.redHexInput.length === 2) {
        if ( this.validateHex(this.cData.redHexInput + this.cData.greenHexInput + this.cData.blueHexInput) ) {
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
  }

  onGreenHexInput() : void { //unmoved
      if (this.cData.greenHexInput.length === 2) {
        if (this.validateHex(this.cData.redHexInput + this.cData.greenHexInput + this.cData.blueHexInput)){
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
  }

  onBlueHexInput() : void { //unmoved
      if (this.cData.blueHexInput.length === 2) {
        if(this.validateHex(this.cData.redHexInput + this.cData.greenHexInput + this.cData.blueHexInput)){
          if ( this.cData.primarySelect ) {
              this.cData.primaryColor = '#' + this.cData.hexColorInput.substring( 0, 4 ) + this.cData.blueHexInput + this.colorConvert.rgbaToHex( this.cData.primaryAlpha * 255 );
              this.updateSliderField( this.cData.primaryColor );
          }
          else {
              this.cData.secondaryColor = '#' + this.cData.hexColorInput.substring( 0, 4 ) + this.cData.blueHexInput + this.colorConvert.rgbaToHex( this.cData.secondaryAlpha * 255 );
              this.updateSliderField( this.cData.secondaryColor );
          }
        }
      }
      this.cData.hexColorInput = this.cData.hexColorInput.substring( 0, 4 ) + this.cData.blueHexInput;
  }

  updateSliderField( color : string) : void { //unmoved
      let rgba : number[] = this.colorConvert.hexToRgba( color );
      this.cData.redSliderInput = rgba[0];
      this.cData.greenSliderInput = rgba[1];
      this.cData.blueSliderInput = rgba[2];
      if ( rgba[3] !== -1 ) {
          this.cData.opacitySliderInput = rgba[3] / 255 * 100;
      }
      
      let hsl : number[] = this.colorConvert.rgbToHsl( this.cData.redSliderInput, this.cData.greenSliderInput, this.cData.blueSliderInput );
      this.cData.currentHue = hsl[0];
      this.cData.saturationSliderInput = Math.round( hsl[1] * 100 );
      this.cData.lightnessSliderInput = Math.round( hsl[2] * 100 );
      this.setSLCursor(this.cData.saturationSliderInput, this.cData.lightnessSliderInput);
  }
  // Red left input change
  onRGBSliderInput() : void { //unmoved
      let hsl =this.colorConvert.rgbToHsl( this.cData.redSliderInput, this.cData.greenSliderInput, this.cData.blueSliderInput );
      this.cData.currentHue = hsl[0];
      this.cData.saturationSliderInput = Math.round( hsl[1] * 100 );
      this.cData.lightnessSliderInput = Math.round( hsl[2] * 100 ); 
      this.slSliderRefresh();
  }

  onSLSliderInput() : void { //unmoved
      let rgb = this.colorConvert.hslToRgb( this.cData.currentHue, this.cData.saturationSliderInput / 100, this.cData.lightnessSliderInput / 100);
      this.cData.redSliderInput = rgb[0];
      this.cData.greenSliderInput = rgb[1];
      this.cData.blueSliderInput = rgb[2];
      this.slSliderRefresh();
  }

  slSliderRefresh() : void {
      if ( this.cData.primarySelect ) {
          this.cData.primaryColor = '#' + this.colorConvert.rgbaToHex( this.cData.redSliderInput )+ this.colorConvert.rgbaToHex( this.cData.greenSliderInput ) + this.colorConvert.rgbaToHex( this.cData.blueSliderInput ) + this.colorConvert.rgbaToHex( this.cData.primaryAlpha * 255);
          this.updateLastColor( this.cData.primaryColor );
      }
      else{        
        this.cData.secondaryColor = '#' + this.colorConvert.rgbaToHex( this.cData.redSliderInput )+ this.colorConvert.rgbaToHex( this.cData.greenSliderInput ) + this.colorConvert.rgbaToHex( this.cData.blueSliderInput ) + this.colorConvert.rgbaToHex( this.cData.secondaryAlpha * 255);
        this.updateLastColor( this.cData.secondaryColor );
      }
      this.setSLCursor( this.cData.saturationSliderInput, this.cData.lightnessSliderInput );
      this.hexInputRefresh();
  }

  hexInputRefresh() : void {
    this.cData.redHexInput = this.colorConvert.rgbaToHex( this.cData.redSliderInput );
    this.cData.greenHexInput = this.colorConvert.rgbaToHex( this.cData.greenSliderInput );
    this.cData.blueHexInput = this.colorConvert.rgbaToHex( this.cData.blueSliderInput );
    this.cData.hexColorInput = this.cData.redHexInput + this.cData.greenHexInput + this.cData.blueHexInput;
  }
  sliderAlphaChange() : void {
    if ( this.cData.primarySelect === true) {
        this.cData.primaryAlpha = this.cData.opacitySliderInput / 100;
        this.cData.primaryColor = '#' + this.colorConvert.rgbaToHex( this.cData.redSliderInput ) + this.colorConvert.rgbaToHex( this.cData.greenSliderInput ) + this.colorConvert.rgbaToHex( this.cData.blueSliderInput ) + this.colorConvert.rgbaToHex( this.cData.primaryAlpha * 255 );
    }
    else {
        this.cData.secondaryAlpha = this.cData.opacitySliderInput / 100;
        this.cData.secondaryColor = '#' + this.colorConvert.rgbaToHex( this.cData.redSliderInput ) + this.colorConvert.rgbaToHex( this.cData.greenSliderInput ) + this.colorConvert.rgbaToHex( this.cData.blueSliderInput ) + this.colorConvert.rgbaToHex( this.cData.secondaryAlpha * 255 );
    }
  }  
}

