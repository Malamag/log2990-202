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

  
});
