import { Injectable } from '@angular/core';
import { ColorConvertingService } from './color-converting.service';
import { colorData } from '../../components/color-picker/color-data';
import { Subject } from 'rxjs';
import { ChoosenColors } from '../../models/ChoosenColors.model';


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

  slCursor(x: number, y:number) {
    this.cData.saturationSliderInput = x;
    this.cData.lightnessSliderInput = y;
  }

  setColor( color : number[] ) {
    if(color.length <3){
      return;
    }
    else{
      if ( this.cData.primarySelect ) {
        this.writeColor(color,true )
      }
      else {
          this.writeColor(color, false);
      }
      this.cData.hexColorInput = this.colorConvert.rgbToHex( color[0] )+ this.colorConvert.rgbToHex( color[1] )
      + this.colorConvert.rgbToHex( color[2] )
      this.cData.redSliderInput = color[0];
      this.cData.greenSliderInput = color[1];
      this.cData.blueSliderInput = color[2];
      this.hexInputDisplayRefresh();
    }
  }

  writeColor(color: number[], primary:boolean){
    if(color.length<3){
      return;
    }
    else{
      if(primary){
        this.cData.primaryColor = '#' + this.colorConvert.rgbToHex( color[0] )+ this.colorConvert.rgbToHex( color[1] ) 
          + this.colorConvert.rgbToHex( color[2] ) + this.colorConvert.alphaRGBToHex( this.cData.primaryAlpha);
          this.cData.checkboxSliderStatus = true;
          this.cData.currentColorSelect = 'Primary';
      }
      else{
        this.cData.secondaryColor = '#' + this.colorConvert.rgbToHex( color[0] )+ this.colorConvert.rgbToHex( color[1] ) 
          + this.colorConvert.rgbToHex( color[2] ) + this.colorConvert.alphaRGBToHex( this.cData.secondaryAlpha);
          this.cData.checkboxSliderStatus = false; 
          this.cData.currentColorSelect = 'Secondary';
      }
    }
  }
  hueSelector( event : MouseEvent ) : void {
    let Hue: number =0
    if ( this.cData.isHueSelecting) {
      Hue = this.computeHue(event)    
      this.cData.currentHue = Math.round(Hue)
      // here we set saturation, lightness to default value i.e 100% and 50%
      this.cData.saturationSliderInput = 100;
      this.cData.lightnessSliderInput = 50;
      // opacity conversion for display
      if (this.cData.primarySelect ) {
        this.cData.opacitySliderInput = Math.round(this.cData.primaryAlpha * 100);
      }
      else {
        this.cData.opacitySliderInput = Math.round(this.cData.secondaryAlpha * 100);
      }
      this.setSLCursor( this.cData.saturationSliderInput, this.cData.lightnessSliderInput );
      this.setColor( this.colorConvert.hslToRgb(Hue) ) ;
      this.hexInputDisplayRefresh();
    }
  }
  computeHue(event: MouseEvent): number{
    // Hue circle radius is 90px and stroke widht 10px which mean average radius is ( 100 - 90 ) / 2 = 95
    // Which is subtract from offset to center circle for math formula 
    let radiusX : number = event.offsetX - 95;
    let radiusY : number = event.offsetY - 95;
    let radius : number = Math.sqrt( Math.pow( radiusX, 2) + Math.pow( radiusY, 2) );
    let theta : number = Math.acos( radiusX / radius);
    let Hue : number = 0;
    // hue is a value of 0 to 360 degree but theta is in radiant so conversion are needed depending on raduisY signe
    if ( radiusY >= 0 ){
        Hue = 180 / Math.PI * theta;
    }
    else{
        Hue = 360 - 180 / Math.PI * theta;
    }
    return Hue;
  }
  //Exchange primary and secondary value
  swapPrimarySecondary() : void {
    let tempColor : string = this.cData.primaryColor;
    let tempAlpha : number = this.cData.primaryAlpha;

    this.cData.primaryColor = this.cData.secondaryColor;
    this.cData.primaryAlpha = this.cData.secondaryAlpha;

    this.cData.secondaryColor = tempColor;
    this.cData.secondaryAlpha = tempAlpha;
    this.refreshDisplay();
  }
  //saturation/lightness selector
  slSelector(event : MouseEvent) : void {
    if( this.cData.isSLSelecting) { 
      // -2 to offset to align mouse pointer and color cursor 
      let x : number = this.computeSaturation(event)
      let y : number = this.computeLightness(event)
      this.setSLCursor( x, y );
      this.cData.saturationSliderInput = x;
      this.cData.lightnessSliderInput = y;
      this.setColor( this.colorConvert.hslToRgb(this.cData.currentHue, this.cData.saturationSliderInput / 100,
        this.cData.lightnessSliderInput / 100 ) ) ;
    }  
  }

  computeSaturation(event: MouseEvent): number{
    let x : number = event.offsetX - 50;
    if ( x > 100 ) {
      x = 100;
    }
    else if ( x < 0 ) {
      x = 0;
    }
    return x;
  }

  computeLightness(event: MouseEvent): number{
    let y : number = event.offsetY - 50;
    if ( y > 100 ) {
      y = 100;
    }
    else if ( y < 0 ) {
      y = 0;
    }
    return y
  }
  //Set position of x and y of saturatio/lightness cursor
  setSLCursor( x : number, y : number): void {
    this.cData.slCursorX = x;
    this.cData.slCursorY = y;
  }
  onContextMenu(event : MouseEvent) : void {
    event.preventDefault();
  }
  onSwapSVGMouseOver() : void {
    this.cData.swapStrokeStyle = 'yellow';
  }
  onSwapSVGMouseLeave() : void {
    this.cData.swapStrokeStyle = 'white';
  }
  onSwapSVGMouseDown() : void {
    this.cData.swapStrokeStyle = 'lightblue';
  }
  onSwapSVGMouseUp() : void {
    this.cData.swapStrokeStyle = 'white';
  }
  //Mouse up event function when mouse on a color selector
  colorSelectOnMouseUp(): void{
    if ( this.cData.isSLSelecting || this.cData.isHueSelecting) {
      this.cData.rectOffsetFill = 'none';
      this.cData.isHueSelecting = false;
      this.cData.isSLSelecting = false;
      if( this.cData.primarySelect ) {
          this.updateLastColor( this.cData.primaryColor );
      }
      else {
          this.updateLastColor( this.cData.secondaryColor );
      }
      this.setColorsFromForm(this.cData.primaryColor, this.cData.secondaryColor);
      this.emitColors();
    }
  }
  //Mouse down event function when mouse on hue selector
  hueSelectorOnMouseDown(event : MouseEvent ): void{
    if (!(this.cData.isSLSelecting)) {
      this.cData.isHueSelecting = true;
      this.cData.rectOffsetFill = 'white';
      if ( event.button === 0 ) {
          this.cData.primarySelect = true;     
      }
      else {
          this.cData.primarySelect = false;
      }
      this.hueSelector(event);
    }
  }
  selectorOnMouseLeave(event : MouseEvent): void{
    if (this.cData.isHueSelecting){
      this.hueSelector(event);
    }
  }
  //Mouse down event function when mouse on saturation/lightness selector
  slSelectorOnMouseDown(event : MouseEvent ): void{
    if (!(this.cData.isHueSelecting)) {
      this.cData.isSLSelecting = true;
      if ( event.button === 0 ) {
          this.cData.primarySelect = true;     
      }
      else {
          this.cData.primarySelect = false;
      }
      this.slSelector(event);
    }
  }
  //Update last color table with a new color
  updateLastColor( newColor : string ) : void {
    for(let i = 0; i < this.cData.lastColorRects.length; i++ ) {
      if(this.cData.lastColorRects[i].fill === 'none'){
        this.cData.lastColorRects[i].fill = newColor.substring( 0, 7 );
        return;
      }
    }
    for(let i = 0; i < this.cData.lastColorRects.length - 1; i++ ) {
      this.cData.lastColorRects[i].fill = this.cData.lastColorRects[i + 1].fill;
    }
    this.cData.lastColorRects[this.cData.lastColorRects.length - 1].fill = newColor.substring( 0, 7 );
  }
  lastColorSelector( event : MouseEvent, lastColor : string ) : void {
    if ( event.button === 0 ) {
        this.cData.primaryColor = lastColor;
        this.cData.checkboxSliderStatus = true;
        this.cData.primarySelect = true; 
        this.cData.currentColorSelect = 'Primary';
        this.cData.opacitySliderInput = this.cData.primaryAlpha * 100;
    }
    else if ( event.button === 2 ) {
        this.cData.secondaryColor = lastColor;
        this.cData.checkboxSliderStatus = false;
        this.cData.primarySelect = false; 
        this.cData.currentColorSelect = 'Secondary';
        this.cData.opacitySliderInput = this.cData.secondaryAlpha * 100;
    }
    this.updateDisplay(lastColor)
  }

  updateDisplay(lastColor: string){
    this.cData.hexColorInput = lastColor.substring( 1, 7 );//only 1 to 7 char are needed for view
    //RGBA value of last color for display
    let color : number[] = this.colorConvert.hexToRgba( lastColor.substring( 1, 9 ) );
    this.cData.redSliderInput = color[0];
    this.cData.greenSliderInput = color[1];
    this.cData.blueSliderInput = color[2];
    this.cData.opacitySliderInput;
    //HSL value of last color for display
    let hsl : number[] = this.colorConvert.rgbToHsl( color[0], color[1], color[2] );
    this.cData.currentHue = hsl[0];
    this.cData.saturationSliderInput = Math.round( hsl[1] * 100 );
    this.cData.lightnessSliderInput = Math.round( hsl[2] * 100);
    this.setSLCursor( this.cData.saturationSliderInput, this.cData.lightnessSliderInput );
    this.hexInputDisplayRefresh();
    this.setColorsFromForm(this.cData.primaryColor, this.cData.secondaryColor);
    this.emitColors();
  }
  //Change color display between primary and secondary
  swapInputDisplay(event : MouseEvent) {
    if ( (event.srcElement as HTMLInputElement).checked ) {
        this.cData.primarySelect = true;
    }
    else {
        this.cData.primarySelect = false;
    }
    this.refreshDisplay();
  }
  //udapte display with current value
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
  //validate if char is hexadecimal. A window alert is send id invalide char are found
  validateHexInput(event : KeyboardEvent ) : void {
    if (!this.colorConvert.validateHex(event.which)){
      event.preventDefault();
      return;
    }
    this.cData.isValideInput = true;
    
  }
  validateHexColorInput(event : KeyboardEvent ) : void {
    this.cData.isValideInput = false;
    if (event.which !== 8){
      if (this.cData.hexColorInput.length === 6){
        event.preventDefault();
        return;
      }
    }
    this.validateHexInput(event);
  
  }
  preventError(event: KeyboardEvent){
    event.preventDefault();
    return;
  }
  validateRedHexInput(event : KeyboardEvent ) : void {
    this.cData.isValideInput = false;
    if (event.which !== 8){
      if (this.cData.redHexInput.length === 2){
        this.preventError(event)
      }
    }
    this.validateHexInput(event);
  }
  validateGreenHexInput(event : KeyboardEvent ) : void {
    this.cData.isValideInput = false;
    if (event.which !== 8){
      if (this.cData.greenHexInput.length === 2){
        this.preventError(event)
      }
    }
    this.validateHexInput(event);
  }
  validateBlueHexInput(event : KeyboardEvent ) : void {
    this.cData.isValideInput = false;
    if (event.which !== 8){
      if (this.cData.blueHexInput.length === 2){
        this.preventError(event)
      }
    }
    this.validateHexInput(event);
  }
  /**
  * Hex color text field input event function
  * Update display if valide value are input 
  **/
  onHexColorInput(event : KeyboardEvent) : void {
    if ( (this.cData.hexColorInput.length === 6) && this.cData.isValideInput) {
      this.updateSliderField( this.cData.hexColorInput);
      if ( this.cData.primarySelect ) {
          this.cData.primaryColor = '#' + this.cData.hexColorInput + this.colorConvert.alphaRGBToHex( this.cData.primaryAlpha );
      }
      else {
          this.cData.secondaryColor = '#' + this.cData.hexColorInput + this.colorConvert.alphaRGBToHex( this.cData.secondaryAlpha );
      }
      this.cData.redHexInput = this.cData.hexColorInput.substring(0, 2);
      this.cData.greenHexInput = this.cData.hexColorInput.substring(2, 4);
      this.cData.blueHexInput = this.cData.hexColorInput.substring(4, 6);
    }
  }
  /**
  * Red hex text field input event function
  * Update display if valide value are input 
  **/
  onRedHexInput() : void {
    if ( (this.cData.redHexInput.length === 2) && this.cData.isValideInput) {
      if ( this.cData.primarySelect ) {
        this.cData.primaryColor = this.writeHexColor("Red", true)
        this.updateSliderField( this.cData.primaryColor );
      }
      else {
          this.cData.secondaryColor = this.writeHexColor("Red", false)
          this.updateSliderField( this.cData.secondaryColor );
      }
      this.cData.hexColorInput = this.cData.redHexInput + this.cData.hexColorInput.substring( 2, 6 );
    }
  }

  writeHexColor(color:string, prim: boolean): string{
    let ret:string ="";
    if(color === "Red"){
      ret += '#' + this.cData.redHexInput + this.cData.hexColorInput.substring( 2, 6 )
    }
    else if(color === "Green"){
      ret += '#' + this.cData.hexColorInput.substring( 0, 2 ) + this.cData.greenHexInput + this.cData.hexColorInput.substring( 4, 6 )
    }
    else if(color ==="Blue"){
      ret+= '#' + this.cData.hexColorInput.substring( 0, 4 ) + this.cData.blueHexInput
    }
    if(prim){
      ret += this.colorConvert.alphaRGBToHex( this.cData.primaryAlpha );
    }
    else if(!prim){
      ret += this.colorConvert.alphaRGBToHex( this.cData.secondaryAlpha );
    }
    return ret;
  }
 
  onGreenHexInput() : void { //unmoved
    if ((this.cData.greenHexInput.length === 2) && this.cData.isValideInput) {
      if ( this.cData.primarySelect ) {
          this.cData.primaryColor = this.writeHexColor("Green",true)
          this.updateSliderField( this.cData.primaryColor );
      }
      else {
          this.cData.secondaryColor = this.writeHexColor("Green", false)
          this.updateSliderField( this.cData.secondaryColor );
      }
      this.cData.hexColorInput = this.cData.hexColorInput.substring( 0, 2 ) + this.cData.greenHexInput +
       this.cData.hexColorInput.substring( 4, 6 );
    }
  }

  onBlueHexInput() : void { //unmoved
    if ((this.cData.blueHexInput.length === 2) && this.cData.isValideInput) {
      if ( this.cData.primarySelect ) {
          this.cData.primaryColor = this.writeHexColor("Blue", true)
          this.updateSliderField( this.cData.primaryColor );
      }
      else {
          this.cData.secondaryColor = this.writeHexColor("Blue", false)
          this.updateSliderField( this.cData.secondaryColor );
        }
    }
    this.cData.hexColorInput = this.cData.hexColorInput.substring( 0, 4 ) + this.cData.blueHexInput;
  }
  /**
  * Update display with a given color
  **/
 // put on notice
  updateSliderField( color : string) : void {
    let rgba : number[] = this.colorConvert.hexToRgba( color );
    this.cData.redSliderInput = rgba[0];
    this.cData.greenSliderInput = rgba[1];
    this.cData.blueSliderInput = rgba[2];
    //if opacity existeb i.e fourth attribut of hexToRgba is not -1 then we set opacity after conversion for display 
    if ( rgba[3] !== -1 ) {
        this.cData.opacitySliderInput = rgba[3] * 100;
    }
    
    let hsl : number[] = this.colorConvert.rgbToHsl( this.cData.redSliderInput, this.cData.greenSliderInput, this.cData.blueSliderInput );
    this.cData.currentHue = hsl[0];
    //hsl saturation and ligthness value are between [0;1] while display is [0;100]%.So we need to multiply by 100
    this.cData.saturationSliderInput = Math.round( hsl[1] * 100 );
    this.cData.lightnessSliderInput = Math.round( hsl[2] * 100 );
    this.setSLCursor(this.cData.saturationSliderInput, this.cData.lightnessSliderInput);
    this.updateLastColor(color);
    this.setColorsFromForm(this.cData.primaryColor, this.cData.secondaryColor);
    this.emitColors();
  }
  // RBG slider input event function
  onRGBSliderInput() : void {
    let hsl =this.colorConvert.rgbToHsl( this.cData.redSliderInput, this.cData.greenSliderInput, this.cData.blueSliderInput );
    this.cData.currentHue = hsl[0];
    //hsl saturation and ligthness value are between [0;1] while display is [0;100]%.So we need to multiply by 100
    this.cData.saturationSliderInput = Math.round( hsl[1] * 100 );
    this.cData.lightnessSliderInput = Math.round( hsl[2] * 100 ); 
    this.sliderInputDisplayRefresh();
  }
  //Saturation and lightness slider input event function
  onSLSliderInput() : void {
    //hsl saturation and ligthness value are between [0;1] while display is [0;100]%.So we need to divide by 100
    let rgb = this.colorConvert.hslToRgb( this.cData.currentHue, this.cData.saturationSliderInput / 100,
       this.cData.lightnessSliderInput / 100);
    this.cData.redSliderInput = rgb[0];
    this.cData.greenSliderInput = rgb[1];
    this.cData.blueSliderInput = rgb[2];
    this.sliderInputDisplayRefresh();
  }
  writeColorSlider(prim:boolean): string{
    let ret:string =""
    ret += '#' + this.colorConvert.rgbToHex( this.cData.redSliderInput )+ this.colorConvert.rgbToHex( this.cData.greenSliderInput ) 
    ret += this.colorConvert.rgbToHex( this.cData.blueSliderInput )
    if(prim){
      ret += this.colorConvert.alphaRGBToHex( this.cData.primaryAlpha );
    }
    else{
      this.colorConvert.alphaRGBToHex( this.cData.secondaryAlpha );
    }
    return ret
  }
  //Refresh display following a slider input
  // put on notice
  sliderInputDisplayRefresh() : void {
    if ( this.cData.primarySelect ) {
        this.cData.primaryColor = this.writeColorSlider(true)
        this.updateLastColor( this.cData.primaryColor );
    }
    else{        
      this.cData.secondaryColor = this.writeColorSlider(false)
      this.updateLastColor( this.cData.secondaryColor );
    }
    this.setColorsFromForm(this.cData.primaryColor, this.cData.secondaryColor);
    this.emitColors();
    this.setSLCursor( this.cData.saturationSliderInput, this.cData.lightnessSliderInput );
    this.hexInputDisplayRefresh();
  }
  //Refresh hex display following an input
  hexInputDisplayRefresh() : void {
    this.cData.redHexInput = this.colorConvert.rgbToHex( this.cData.redSliderInput );
    this.cData.greenHexInput = this.colorConvert.rgbToHex( this.cData.greenSliderInput );
    this.cData.blueHexInput = this.colorConvert.rgbToHex( this.cData.blueSliderInput );
    this.cData.hexColorInput = this.cData.redHexInput + this.cData.greenHexInput + this.cData.blueHexInput;
    this.setColorsFromForm(this.cData.primaryColor, this.cData.secondaryColor);
    this.emitColors();
  }
  
  writeColorAlphaChange(prim: boolean): string{
    let ret: string ="";
    ret += '#' + this.colorConvert.alphaRGBToHex( this.cData.redSliderInput ) 
    ret +=  this.colorConvert.alphaRGBToHex( this.cData.greenSliderInput ) + this.colorConvert.alphaRGBToHex( this.cData.blueSliderInput )
    if(prim){
      this.colorConvert.alphaRGBToHex( this.cData.primaryAlpha );
    }
    else{
      this.colorConvert.alphaRGBToHex( this.cData.secondaryAlpha );
    }
    return ret
  }
  sliderAlphaChange() : void {
    if ( this.cData.primarySelect === true) {
        this.cData.primaryAlpha = this.cData.opacitySliderInput / 100;
        this.cData.primaryColor = this.writeColorAlphaChange(true)
    }
    else {
        this.cData.secondaryAlpha = this.cData.opacitySliderInput / 100;
        this.cData.secondaryColor = this.writeColorAlphaChange(false)
    }
    this.setColorsFromForm(this.cData.primaryColor, this.cData.secondaryColor);
    this.emitColors();
  }  
}

