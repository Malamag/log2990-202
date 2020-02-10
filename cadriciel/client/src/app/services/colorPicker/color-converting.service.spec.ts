import { TestBed } from '@angular/core/testing';

import { ColorConvertingService } from './color-converting.service';

const validNumber = 250
const invalidNumber =2520
describe('ColorConvertingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ColorConvertingService = TestBed.get(ColorConvertingService);
    expect(service).toBeTruthy();
  });

  it('should return true', ()=>{
    const service: ColorConvertingService = TestBed.get(ColorConvertingService);
    expect(service.validateRGB(validNumber)).toBeTruthy()
  })

  it('should return false',()=>{
    const service: ColorConvertingService = TestBed.get(ColorConvertingService);
    expect(service.validateRGB(invalidNumber)).toBeFalsy()
  })

  it('should return an empty string',()=>{
    const service: ColorConvertingService = TestBed.get(ColorConvertingService);
    let spy = spyOn(service,'validateRGB')
    expect(spy).toHaveBeenCalled()
    expect(service.rgbToHex(invalidNumber).length).toEqual(0)
  })

  it('should not return an empty string',()=>{
    const service: ColorConvertingService = TestBed.get(ColorConvertingService);
    let spy = spyOn(service,'validateRGB')
    expect(spy).toHaveBeenCalled()
    expect(service.rgbToHex(validNumber).length).toBeGreaterThan(0)
  })

  it('should return an empty string',()=>{
    let alpha = 250
    const service: ColorConvertingService = TestBed.get(ColorConvertingService);
    expect(service.alphaRGBToHex(alpha).length).toEqual(0)
  })

  it('should call rgbToHex',()=>{
    let alpha = 1;
    const service: ColorConvertingService = TestBed.get(ColorConvertingService);
    let spy = spyOn(service,'rgbToHex')
    service.alphaRGBToHex(alpha)
    expect(spy).toHaveBeenCalled()
  })

  it('validateHSL should return false following a big H number',()=>{
    let h = 36510;
    let s = 1
    let l = 1
    const service: ColorConvertingService = TestBed.get(ColorConvertingService);
    expect(service.validateHSL(h,s,l)).toBeFalsy()
  })
  
  it('validateHSL should return false following a big H number',()=>{
    let h = 36510;
    let s = 1
    let l = 1
    const service: ColorConvertingService = TestBed.get(ColorConvertingService);
    expect(service.validateHSL(h,s,l)).toBeFalsy()
  })

  it('validateHSL should return false following a big S number',()=>{
    let h = 230;
    let s = 1.5
    let l = 1
    const service: ColorConvertingService = TestBed.get(ColorConvertingService);
    expect(service.validateHSL(h,s,l)).toBeFalsy()
  })

  it('validateHSL should return false following a big L number',()=>{
    let h = 230;
    let s = 1
    let l = 1.5
    const service: ColorConvertingService = TestBed.get(ColorConvertingService);
    expect(service.validateHSL(h,s,l)).toBeFalsy()
  })

  it('validateHSL should return true following in range numbers',()=>{
    let h = 230;
    let s = 1
    let l = 1
    const service: ColorConvertingService = TestBed.get(ColorConvertingService);
    expect(service.validateHSL(h,s,l)).toBeTruthy()
  })

  it('should return an invalid rgb array',()=>{
    let h = 230;
    let s = 1
    let l = 1.5
    const service: ColorConvertingService = TestBed.get(ColorConvertingService);
    let rgbContainer= service.hslToRgb(h ,s,l)
    let spy = spyOn(service,'validateHSL')
    expect(spy).toHaveBeenCalled()
    expect(rgbContainer).toEqual([-1,-1,-1])
  })

  it('should return a valid RGB array',()=>{
    let h = 230;
    let s = 1
    let l = 1
    const service: ColorConvertingService = TestBed.get(ColorConvertingService);
    let rgbContainer= service.hslToRgb(h ,s,l)
    expect(rgbContainer).toEqual([128, 128, 128])
  })

  it('should return a valid RGB array',()=>{
    let h = 50;
    let s = 1
    let l = 1
    const service: ColorConvertingService = TestBed.get(ColorConvertingService);
    let rgbContainer= service.hslToRgb(h ,s,l)
    expect(rgbContainer).toEqual([128, 128, 128])
  })

  it('should return a valid RGB array',()=>{
    let h = 70;
    let s = 1
    let l = 1
    const service: ColorConvertingService = TestBed.get(ColorConvertingService);
    let rgbContainer= service.hslToRgb(h ,s,l)
    expect(rgbContainer).toEqual([128, 128, 128])
  })

  it('should return a valid RGB array',()=>{
    let h = 150;
    let s = 1
    let l = 1
    const service: ColorConvertingService = TestBed.get(ColorConvertingService);
    let rgbContainer= service.hslToRgb(h ,s,l)
    expect(rgbContainer).toEqual([128, 128, 128])
  })

  it('should return a valid RGB array',()=>{
    let h = 270;
    let s = 1
    let l = 1
    const service: ColorConvertingService = TestBed.get(ColorConvertingService);
    let rgbContainer= service.hslToRgb(h ,s,l)
    expect(rgbContainer).toEqual([128, 128, 128])
  })

  it('should return a valid RGB array',()=>{
    let h = 310;
    let s = 1
    let l = 1
    const service: ColorConvertingService = TestBed.get(ColorConvertingService);
    let rgbContainer= service.hslToRgb(h ,s,l)
    expect(rgbContainer).toEqual([128, 128, 128])
  })

  it('should return a hue calculated with red value',()=>{
    let r= 250
    let g = 200
    let b= 150
    let primR= r/255
    let primG = g/255
    let primB = b/255
    let delta= (primR-primB)/2
    let hue = ( 60 * ( ( ( primG - primB ) / delta ) % 6 ) )
    let lightness= (primR+primB)/2
    
    let saturation =  delta / ( 1 - Math.abs( ( 2 * lightness ) - 1 ) );
    const service: ColorConvertingService = TestBed.get(ColorConvertingService);
    expect(service.rgbToHsl(r,g,b)).toEqual([hue, saturation,lightness])
  })

  it('should return a hue calculated with green value',()=>{
    let r= 200
    let g = 250
    let b= 150
    let primR= r/255
    let primG = g/255
    let primB = b/255
    let delta= (primG-primB)/2
    let hue = ( 60 * ( ( primB - primR ) / delta + 2 ) );
    let lightness= (primG+primB)/2
    
    let saturation =  delta / ( 1 - Math.abs( ( 2 * lightness ) - 1 ) );
    const service: ColorConvertingService = TestBed.get(ColorConvertingService);
    expect(service.rgbToHsl(r,g,b)).toEqual([hue, saturation,lightness])
  })

  it('should return a hue calculated with blue value',()=>{
    let r= 200
    let g = 150
    let b= 250
    let primR= r/255
    let primG = g/255
    let primB = b/255
    let delta= (primB-primG)/2
    let hue = ( 60 * ( ( primR - primG ) / delta + 4 ) )
    let lightness= (primG+primB)/2
    
    let saturation =  delta / ( 1 - Math.abs( ( 2 * lightness ) - 1 ) );
    const service: ColorConvertingService = TestBed.get(ColorConvertingService);
    expect(service.rgbToHsl(r,g,b)).toEqual([hue, saturation,lightness])
  })

  it('should return an array with zeros',()=>{
    let r= 0
    let g = 0
    let b = 0
    const service: ColorConvertingService = TestBed.get(ColorConvertingService);
    expect(service.rgbToHsl(r,g,b)).toEqual([0,0,0])
  })
  
  it('validateHex should return true',()=>{
    let hex = 48
    const service: ColorConvertingService = TestBed.get(ColorConvertingService);
    expect(service.validateHex(hex)).toBeTruthy()
  })

  it('validateHex should return false',()=>{
    let hex = 60
    const service: ColorConvertingService = TestBed.get(ColorConvertingService);
    expect(service.validateHex(hex)).toBeFalsy()
  })

  // test last function todo
});
