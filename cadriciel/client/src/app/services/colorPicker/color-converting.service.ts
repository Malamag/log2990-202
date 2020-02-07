import { Injectable } from '@angular/core';
import { colorData } from '../../components/color-picker/color-data';
@Injectable({
  providedIn: 'root'
})
export class ColorConvertingService {
  cData = colorData; // Interface for Color data
  constructor() { }
  
  //RGB [0,255]
  validateRGB(r : number) : Boolean {
      return ( (r >= 0) && (r <= 255) );
  }
  rgbToHex( r : number = 0) : string {
    let hex : string = '' ;
    let bits : number[] = [];
    if(!this.validateRGB(r)){
        return '';
    }
    bits[0] = r >> 4;
    bits[1] = r & 0xf;
    
    for (let i = 0; i < 2; i++) {
        if (bits[i] > 9) {
            hex += String.fromCharCode(bits[i] + 55);
        }
        else {
            hex += '' + bits[i];
        }
    }    
    return hex;
  }
  alphaRGBToHex(a : number) : string {
    let alpha : number = a * 255;
    if( !this.validateRGB(alpha)){
        return '';
    }
    return this.rgbToHex(alpha);
  }
  validateHSL( H : number, S : number, L : number) : boolean {
    let hOk = (H >= 0) && (H <=360);
    let sOk = (S >= 0) && (S <= 1);
    let lOk = (L >= 0) && (L <= 1);
    return (hOk && sOk && lOk);
  }
  hslToRgb( H : number = 0, S : number = 1, L : number = 0.5 ): number[] {
    let rgb : number[] = [-1,-1,-1];
    if(!this.validateHSL(H,S,L)){
        return rgb;
    }
    let C : number = ( 1 - Math.abs( 2 * L - 1 ) ) * S;
    let X : number = C * ( 1 - Math.abs( H / 60  % 2 - 1 ) );
    let m : number = L - C / 2;

    let R : number = 0;
    let G : number = 0;
    let B : number = 0;

    //Math formula for conversion
    if ( ( 0 <= H ) && ( H < 60 ) ) {
        R = C;
        G = X;
        B = 0;
    }
    else if ( ( 60 <= H ) && ( H < 120 ) ) {
        R = X;
        G = C;
        B = 0;
    }
    else if ( ( 120 <= H ) && ( H < 180 ) ) {
        R = 0;
        G = C;
        B = X;
    }
    else if ( ( 180 <= H ) && ( H < 240 ) ) {
        R = 0;
        G = X;
        B = C;
    }
    else if ( ( 240 <= H ) && ( H < 300 ) ) {
        R = X;
        G = 0;
        B = C;
    }
    else if ( ( 300 <= H ) && ( H < 360 ) ) {
        R = C;
        G = 0;
        B = X;
    }
    rgb[0] = Math.round( ( R + m ) * 255 );
    rgb[1] = Math.round( ( G + m ) * 255 );
    rgb[2] = Math.round( ( B + m ) * 255 );
    
    return rgb;
  }

  rgbToHsl( r : number, g : number, b : number ) : number[] { //DONE
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

    lightness = ( max + min ) / 2;
    
    if ( delta ) {
        saturation = delta / ( 1 - Math.abs( ( 2 * lightness ) - 1 ) );
    }

    let hsl : number[] = [];
    hsl[0] = hue;
    hsl[1] = saturation;
    hsl[2] = lightness;
    
    return hsl;
  }
  validateHex(hex : number) : Boolean {
    let hexOk : Boolean = false;
    for(let i : number = 0; i < this.cData.hexNumber.length; i++) {
        if ( hex === this.cData.hexNumber[i] ){
          hexOk = true;
          break;
        }
    }
    return hexOk;
  }
  hexToRgba( hex : string ) : number[] {
    let colorBits : string = hex;
    // check if first char is a # (ascii code number is 35) and remove it
    let rgba : number[] = [-1,-1,-1,-1];
    if (hex.charCodeAt(0) ===  35 ) {
        colorBits = hex.substring(1 , hex.length);
    }
    //if string is impair return -1 to all value
    if (colorBits.length % 2) {
        return rgba;
    }

    let ascii0 : number = 48;// 0 ascii code number
    let asciiA : number = 65;// A ascii code number
    let asciia : number = 97;// a ascii code number
    
    let buffer : number[] = [];
    for ( let i : number = 0; i < colorBits.length; i++ ) {
        //Return -1 on rbga if char is invalide
        if(this.validateHex(colorBits.charCodeAt(i))){
            return rgba;
        }
        buffer[i] = colorBits.charCodeAt(i);
        if ( buffer[i] >= asciia ) {
            buffer[i] -= asciia - 10;//hex letter start at 10 
        }
        else if ( buffer[i] >= asciiA ){
            buffer[i] -=  asciiA - 10;
        }
        else {
            buffer[i] -= ascii0;
        }
    }
    for ( let j : number = 0; j < buffer.length / 2; j++) {
        rgba[j] = ( buffer[j * 2] << 4 ) | ( buffer[j * 2 + 1]);
    }
    if ( colorBits.length <= 6 ) {
        rgba[3] = -1;
    }
    else {
        //opacity for rgba is between [0,1] while for hex it's [0,255]
        rgba[3] = rgba[3] / 255;
    }
    if ( colorBits.length <= 4 ) {
        rgba[2] = -1;
    }
    if ( colorBits.length <= 2 ) {
        rgba[1] = -1;
    }
    return rgba;
  }
}
