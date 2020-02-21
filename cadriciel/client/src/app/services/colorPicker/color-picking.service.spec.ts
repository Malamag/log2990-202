/*import { TestBed } from '@angular/core/testing';

import { colorData } from 'src/app/components/color-picker/color-data';
import { ColorPickingService } from './color-picking.service';

describe('ColorPickingService', () => {
  let mouseEventStub: any;
  let service: ColorPickingService;

  let mouseEventStubBigOffset: any;
  let mouseEventStubSmallOffset: any
  let kbEventStub: any;

  beforeEach(() => {
    kbEventStub = {
      preventDefault: () => 0 ,
      which: 7
    }

    mouseEventStub = {
      button: 0 // left button pressed
    }
    mouseEventStubBigOffset = {
      offsetX: 160, // mouse positions
      offsetY: 190
    }
    mouseEventStubSmallOffset = {
      offsetX: 40,
      offsetY: 49
    }
    TestBed.configureTestingModule({
      providers: [
        {provide: MouseEvent, mouseEventStub},
        {provide: KeyboardEvent, kbEventStub}]
    })
    service = TestBed.get(ColorPickingService);
    service.cData = colorData;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call the next method of the observer', () => {
    const service: ColorPickingService = TestBed.get(ColorPickingService);
    const spy = spyOn(service.colorSubject, 'next')
    service.emitColors()
    expect(spy).toHaveBeenCalled()
  })

  it('should modifiy the color with the parameters', () => {
    const prim = 'red'
    const sec = 'blue'
    service.setColorsFromForm(prim, sec)
    expect(service.colors.primColor).toBe(prim)
    expect(service.colors.secColor).toBe(sec)
  })
  it('sould set the selector of the colors to the passing values', () => {
    const x = 20
    const y = 40
    service.setSLCursor(x, y)
    expect(service.cData.slCursorX).toEqual(x)
    expect(service.cData.slCursorY).toEqual(y)
  })

  it('setColor should not call functions',()=>{
    let color: number[] = [];
    const spyRgb = spyOn(service.colorConvert,'rgbToHex');
    const spyAlphaRGB = spyOn(service.colorConvert,'alphaRGBToHex');
    service.setColor(color);
    expect(spyRgb).toHaveBeenCalledTimes(0);
    expect(spyAlphaRGB).toHaveBeenCalledTimes(0);
  });

  it('setColor should call functions and set the selector to primary',()=>{
    let color: number[] = [1,2,3];
    const spyRgb = spyOn(service.colorConvert,'rgbToHex');
    const spyAlphaRGB = spyOn(service.colorConvert,'alphaRGBToHex');
    service.cData.primarySelect =true;
    service.setColor(color);
    expect(spyRgb).toHaveBeenCalled();
    expect(spyAlphaRGB).toHaveBeenCalled();
    expect(service.cData.currentColorSelect).toBe('Primary');
  });

  it('setColor should call functions and set the the selector to secondary',()=>{
    let color: number[] = [1,2,3];
    const spyRgb = spyOn(service.colorConvert,'rgbToHex');
    const spyAlphaRGB = spyOn(service.colorConvert,'alphaRGBToHex');
    service.cData.primarySelect =false;
    service.setColor(color);
    expect(spyRgb).toHaveBeenCalled();
    expect(spyAlphaRGB).toHaveBeenCalled();
    expect(service.cData.currentColorSelect).toBe('Secondary');
  });

  it('hueSelector should call functions',()=>{
    const spyCompute = spyOn(service,'computeHue');
    const spySet= spyOn(service,'setColor');
    const spyDisplay= spyOn(service,'updateDisplay');
    service.cData.isHueSelecting = true;
    service.hueSelector(mouseEventStub);
    expect(spyCompute).toHaveBeenCalled();
    expect(spySet).toHaveBeenCalled();
    expect(spyDisplay).toHaveBeenCalled();
  });

  it('Hue should be computed using radiusY bigger than zero',()=>{
    const radiusX: number = mouseEventStubBigOffset.offsetX - 95;
    const radiusY: number = mouseEventStubBigOffset.offsetY - 95;
    const radius: number = Math.sqrt( Math.pow( radiusX, 2) + Math.pow( radiusY, 2) );
    const theta: number = Math.acos( radiusX / radius);
    let Hue = 180 / Math.PI * theta;
    expect(service.computeHue(mouseEventStubBigOffset)).toEqual(Hue);
  });

  it('Hue should be computed using radiusY smaller than zero',()=>{
    const radiusX: number = mouseEventStubSmallOffset.offsetX - 95;
    const radiusY: number = mouseEventStubSmallOffset.offsetY - 95;
    const radius: number = Math.sqrt( Math.pow( radiusX, 2) + Math.pow( radiusY, 2) );
    const theta: number = Math.acos( radiusX / radius);
    let Hue = 360-180 / Math.PI * theta;
    expect(service.computeHue(mouseEventStubSmallOffset)).toEqual(Hue);
  });

  it('should swap primary and secondary colors',()=>{
    const tmpPrimaryColor = service.cData.primaryColor;
    const tmpPrimaryAlpha = service.cData.primaryAlpha;
    const tmpSecColor = service.cData.secondaryColor;
    const tmpSecAlpha = service.cData.secondaryAlpha;
    const spySelectDisplay = spyOn(service,'selectDisplayColor');
    const spyDisplay = spyOn(service,'updateDisplay')
    service.swapPrimarySecondary();
    expect(service.cData.primaryColor).toBe(tmpSecColor);
    expect(service.cData.primaryAlpha).toBe(tmpSecAlpha);
    expect(service.cData.secondaryColor).toBe(tmpPrimaryColor);
    expect(service.cData.secondaryAlpha).toBe(tmpPrimaryAlpha);
    expect(spySelectDisplay).toHaveBeenCalled();
    expect(spyDisplay).toHaveBeenCalled();
  });


});*/
