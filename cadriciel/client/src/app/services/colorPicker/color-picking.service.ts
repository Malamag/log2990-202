import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { colorData } from '../../components/color-picker/color-data';
import { ChoosenColors } from '../../models/ChoosenColors.model';
import { ColorConvertingService } from './color-converting.service';

/*-----------------------------Color valur table-----------------------------------------*
* RGBA min/max value : R [0,255] , G [0,255] , B [0,255] , A [0,1]                       *
* HSL  min/max value : H [0,360] , S [0,1] , L [0,1]                                     *
* HEX  min/max value : R [00,FF] , G [00,FF] , B [00,FF] , A [00,FF] ( i.e FF = 255 )    *
* Display min/max value : RGB [0,255] , H [0,360] , ASL [0,100]% , HEX [00,FF]           *
* Conversion methode for display : RBAH HEX  the same value, ASL * 100 for poucent value *
* HEX color string 9 number total: #RRGGBBAA                                             *
* # is not needed for math so it need to be cut from formula (i.e substring(1,X))        *
* RR is red value.To get use substring(1,3) if # is present else substring(0,2)          *
* GG is green value.To get use substring(3,5) if # is present else substring(2,4)        *
* BB is blue value.To get use substring(5,7) if # is present else substring(4,6)         *
* AA is opacity value.To get use substring(7,9) if # is present else substring(6,8)      *
*---------------------------------------------------------------------------------------*/

@Injectable({
  providedIn: 'root'
})

export class ColorPickingService {
  cData = colorData; // Interface for Color data

  colors: ChoosenColors;
  colorSubject = new Subject<ChoosenColors>(); // le constuire à qqpart

  constructor(public colorConvert: ColorConvertingService) { }

  emitColors() { // observerved-observer design pattern
    this.colorSubject.next(this.colors);
  }

  setColorsFromForm(primary: string, secondary: string) {
    this.colors = new ChoosenColors(primary, secondary);
  }

  slCursor(x: number, y: number) {
    this.cData.saturationSliderInput = x;
    this.cData.lightnessSliderInput = y;
  }

  setColor( color: number[] ) : string {
    if (color.length < 3) {
      return '';
    } else {
      let newColor : string = '#' + this.colorConvert.rgbToHex( color[0] ) + this.colorConvert.rgbToHex( color[1] )
      + this.colorConvert.rgbToHex( color[2] ) 
      if ( this.cData.primarySelect ) {
        newColor += this.colorConvert.alphaRGBToHex( this.cData.primaryAlpha);
        this.cData.currentColorSelect = 'Primary';
        this.cData.primaryColor = newColor;
        
      } else {
        newColor += this.colorConvert.alphaRGBToHex( this.cData.secondaryAlpha);
        this.cData.currentColorSelect = 'Secondary';
        this.cData.secondaryColor = newColor;
      }
      return newColor;
    }
  }

  hueSelector( event: MouseEvent ): void {
    let hue = 0
    if ( this.cData.isHueSelecting) {
      hue = this.computeHue(event)
      this.cData.currentHue = Math.round(hue)
      let color = this.setColor( this.colorConvert.hslToRgb(hue, this.cData.saturationSliderInput / this.cData.POURCENT_MODIFIER,
                                 this.cData.lightnessSliderInput / this.cData.POURCENT_MODIFIER ) ) ;
      this.updateDisplay( color );
    }
  }
  computeHue(event: MouseEvent): number {
    // Hue circle radius is 90px and stroke widht 10px which mean average radius is ( 100 - 90 ) / 2 = 95
    // Which is subtract from offset to center circle for math formula
    const radiusX: number = event.offsetX - 95;
    const radiusY: number = event.offsetY - 95;
    const radius: number = Math.sqrt( Math.pow( radiusX, 2) + Math.pow( radiusY, 2) );
    const theta: number = Math.acos( radiusX / radius);
    let Hue = 0;
    // hue is a value of 0 to 360 degree but theta is in radiant so conversion are needed depending on raduisY signe
    if ( radiusY >= 0 ) {
        Hue = 180 / Math.PI * theta;
    } else {
        Hue = 360 - 180 / Math.PI * theta;
    }
    return Hue;
  }
  // Exchange primary and secondary value
  swapPrimarySecondary(): void {
    const tempColor: string = this.cData.primaryColor;
    const tempAlpha: number = this.cData.primaryAlpha;

    this.cData.primaryColor = this.cData.secondaryColor;
    this.cData.primaryAlpha = this.cData.secondaryAlpha;

    this.cData.secondaryColor = tempColor;
    this.cData.secondaryAlpha = tempAlpha;
    let color = this.selectDisplayColor();
    this.updateDisplay(color);
  }
  // saturation/lightness selector
  slSelector(event: MouseEvent): void {
    if ( this.cData.isSLSelecting) {
      const x: number = event.offsetX - 50;
      const y: number = event.offsetY - 50;
      this.setSLCursor( x, y );
      this.cData.saturationSliderInput = x;
      this.cData.lightnessSliderInput = y;
      let hsl : number[] = [this.cData.currentHue, this.cData.saturationSliderInput / this.cData.POURCENT_MODIFIER, this.cData.lightnessSliderInput / this.cData.POURCENT_MODIFIER];
      let color = this.setColor( this.colorConvert.hslToRgb(this.cData.currentHue, this.cData.saturationSliderInput / this.cData.POURCENT_MODIFIER,
                    this.cData.lightnessSliderInput / this.cData.POURCENT_MODIFIER ) ) ;
      this.updateDisplayHSL( hsl );
      this.updateDisplayRGB( this.colorConvert.hexToRgba( color ) );
      this.upadateDisplayHex( color );
    }
  }
  // Set position of x and y of saturatio/lightness cursor
  setSLCursor( x: number, y: number): void {
    this.cData.slCursorX = x;
    this.cData.slCursorY = y;
  }
  onContextMenu(event: MouseEvent): void {
    event.preventDefault();
  }
  onSwapSVGMouseOver(): void {
    this.cData.swapStrokeStyle = 'yellow';
  }
  onSwapSVGMouseLeave(): void {
    this.cData.swapStrokeStyle = 'white';
  }
  onSwapSVGMouseDown(): void {
    this.cData.swapStrokeStyle = 'lightblue';
  }
  onSwapSVGMouseUp(): void {
    this.cData.swapStrokeStyle = 'white';
  }
  // Mouse up event function when mouse on a color selector
  colorSelectOnMouseUp(): void {
    if ( this.cData.isSLSelecting || this.cData.isHueSelecting) {
      this.cData.rectOffsetFill = 'none';
      this.cData.isHueSelecting = false;
      this.cData.isSLSelecting = false;
      if ( this.cData.primarySelect ) {
          this.updateLastColor( this.cData.primaryColor );
      } else {
          this.updateLastColor( this.cData.secondaryColor );
      }
      this.setColorsFromForm(this.cData.primaryColor, this.cData.secondaryColor);
      this.emitColors();
    }
  }
  // Mouse down event function when mouse on hue selector
  hueSelectorOnMouseDown(event: MouseEvent ): void {
    if (!(this.cData.isSLSelecting)) {
      this.cData.isHueSelecting = true;
      this.cData.rectOffsetFill = 'white';
      this.cData.primarySelect = (event.button === 0);
      this.hueSelector(event);
    }
  }
  selectorOnMouseLeave(event: MouseEvent): void {
    if (this.cData.isHueSelecting) {
      this.hueSelector(event);
    }
  }
  // Mouse down event function when mouse on saturation/lightness selector
  slSelectorOnMouseDown(event: MouseEvent ): void {
    if (!(this.cData.isHueSelecting)) {
      this.cData.isSLSelecting = true;
      this.cData.primarySelect = (event.button === 0);
      this.slSelector(event);
    }
  }
  // Update last color table with a new color
  updateLastColor( newColor: string ): void {
    for (let i = 0; i < this.cData.lastColorRects.length; i++ ) {
      if (this.cData.lastColorRects[i].fill === 'none') {
        this.cData.lastColorRects[i].fill = newColor.substring( 0, 7 );
        return;
      }
    }
    for (let i = 0; i < this.cData.lastColorRects.length - 1; i++ ) {
      this.cData.lastColorRects[i].fill = this.cData.lastColorRects[i + 1].fill;
    }
    this.cData.lastColorRects[this.cData.lastColorRects.length - 1].fill = newColor.substring( 0, 7 );
  }

  lastColorSelector( event: MouseEvent, lastColor: string ): void {
    this.cData.primarySelect = ( event.button === 0 );
    let color = this.setColor( this.colorConvert.hexToRgba( lastColor ) );
    this.updateDisplay( color );
  }

  updateDisplay(color: string) {
    // RGBA value of last color for display
    const rgb: number[] = this.colorConvert.hexToRgba( color.substring( 1, 9 ) );
    this.updateDisplayRGB( rgb );
    // HSL value of last color for display
    const hsl: number[] = this.colorConvert.rgbToHsl( rgb[0], rgb[1], rgb[2] );
    this.updateDisplayHSL( hsl );
    this.upadateDisplayHex( color );
    this.setColorsFromForm(this.cData.primaryColor, this.cData.secondaryColor);
    this.emitColors();
  }
  updateDisplayRGB( rgb : number[]) : void {
    this.cData.redSliderInput = rgb[0];
    this.cData.greenSliderInput = rgb[1];
    this.cData.blueSliderInput = rgb[2];
    this.cData.opacitySliderInput = Math.round( rgb[3] * this.cData.POURCENT_MODIFIER );
  }
  updateDisplayHSL( hsl : number[] ) : void {
    this.cData.currentHue = hsl[0];
    let newSaturation : number = Math.round( hsl[1] * this.cData.POURCENT_MODIFIER );
    if ( newSaturation !== this.cData.MIN_SATURATION_VALUE ) {
      this.cData.saturationSliderInput = newSaturation;
    }
    this.cData.lightnessSliderInput = Math.round( hsl[2] * this.cData.POURCENT_MODIFIER );
    this.setSLCursor( this.cData.saturationSliderInput, this.cData.lightnessSliderInput );
  }
  upadateDisplayHex( hex : string ) : void {
    this.cData.hexColorInput = hex.substring( 1, 7 ); // only 1 to 7 char are needed for view
    this.cData.redHexInput = hex.substring( 1, 3 );
    this.cData.greenHexInput = hex.substring( 3, 5 );
    this.cData.blueHexInput = hex.substring( 5, 7 );
  }
  // Change color display between primary and secondary
  swapInputDisplay(event: MouseEvent) {
    let color = this.selectDisplayColor();
    this.updateDisplay(color);
  }
  // udapte display with current value
  selectDisplayColor(): string {
    let color = '' ;

    if ( this.cData.primarySelect ) {
        this.cData.currentColorSelect = 'Primary';
        color = this.cData.primaryColor;
    } else {
        this.cData.currentColorSelect = 'Secondary';
        color = this.cData.secondaryColor;
    }
    return color;
  }
  // validate if char is hexadecimal. A window alert is send id invalide char are found
  validateHexInput(event: KeyboardEvent, hexLength : number, hex: string ): void {
    event.stopPropagation();
    this.cData.isValideInput = false;
    //left/right arrow
    if ( event.which === 37 || event.which === 39 ) {
      return;
    }
    //if not backspace
    if (event.which !== 8) {
      if (hex.length === hexLength) {
        event.preventDefault();
        return;
      }
    }
    const validator = this.colorConvert.validateHex(event.which)
    if (!validator) {
      event.preventDefault();
      return;
    }
    this.cData.isValideInput = true;
  }
  /**
  * Red hex text field input event function
  * Update display if valide value are input
  **/
  onHexInput(hexLength : number, hex: string, hexInputField : string): void {
    if ( (hex.length === hexLength) && this.cData.isValideInput) {
      if ( this.cData.primarySelect ) {
        this.cData.primaryColor = this.writeHexColor(hexInputField, true)
        this.updateDisplay( this.cData.primaryColor );
      } else {
          this.cData.secondaryColor = this.writeHexColor(hexInputField, false)
          this.updateDisplay( this.cData.secondaryColor );
      }
    }
  }
  writeHexColor(color: string, prim: boolean): string {
    let ret = '';
    if (color === this.cData.RED_INPUT_FIELD) {
      ret += '#' + this.cData.redHexInput + this.cData.hexColorInput.substring( 2, 6 );
    } else if (color === this.cData.GREEN_INPUT_FIELD) {
      ret += '#' + this.cData.hexColorInput.substring( 0, 2 ) + this.cData.greenHexInput + this.cData.hexColorInput.substring( 4, 6 );
    } else if (color === this.cData.BLUE_INPUT_FIELD) {
      ret += '#' + this.cData.hexColorInput.substring( 0, 4 ) + this.cData.blueHexInput;
    } else if (color === this.cData.COLOR_HEX_INPUT_FIELD){
      ret += '#' + this.cData.hexColorInput;
    }
    if (prim) {
      ret += this.colorConvert.alphaRGBToHex( this.cData.primaryAlpha );
    } else if (!prim) {
      ret += this.colorConvert.alphaRGBToHex( this.cData.secondaryAlpha );
    }
    return ret;
  }

  /**
  * Update display with a given color
  **/
  // RBG slider input event function
  onRGBSliderInput(slider : string ): void {
    const rgb :number[] = [this.cData.redSliderInput,this.cData.greenSliderInput,this.cData.blueSliderInput];
    this.sliderColorUpdate( rgb );
  }
  // Saturation and lightness slider input event function
  onSLSliderInput(): void {
    // hsl saturation and ligthness value are between [0;1] while display is [0;100]%.So we need to divide by 100
    const rgb = this.colorConvert.hslToRgb( this.cData.currentHue, this.cData.saturationSliderInput / this.cData.POURCENT_MODIFIER,
       this.cData.lightnessSliderInput / this.cData.POURCENT_MODIFIER);
    this.sliderColorUpdate( rgb );
  }
  sliderColorUpdate( rgb : number[] ) : void {
    let newColor = this.setColor( rgb );
    this.updateDisplay( newColor );
    this.updateLastColor( newColor );
  }
  sliderAlphaChange(): void {
    if ( this.cData.primarySelect ) {
        this.cData.primaryAlpha = this.cData.opacitySliderInput / this.cData.POURCENT_MODIFIER;
        this.cData.primaryColor = this.cData.primaryColor.substring(0,7)+ this.colorConvert.alphaRGBToHex( this.cData.primaryAlpha );
    } else {
        this.cData.secondaryAlpha = this.cData.opacitySliderInput / this.cData.POURCENT_MODIFIER;
        this.cData.secondaryColor = this.cData.secondaryColor.substring(0,7)+ this.colorConvert.alphaRGBToHex( this.cData.secondaryAlpha );
    }
    this.setColorsFromForm(this.cData.primaryColor, this.cData.secondaryColor);
    this.emitColors();
  }
}
