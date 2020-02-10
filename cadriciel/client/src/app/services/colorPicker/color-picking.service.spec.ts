import { TestBed } from '@angular/core/testing';

import { ColorPickingService } from './color-picking.service';

describe('ColorPickingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));
 
  it('should be created', () => {
    const service: ColorPickingService = TestBed.get(ColorPickingService);
    expect(service).toBeTruthy();
  });

  it('should call the next method of the observer',()=>{
    const service: ColorPickingService = TestBed.get(ColorPickingService);
    let spy = spyOn(service.colorSubject,'next')
    service.emitColors()
    expect(spy).toHaveBeenCalled()
  })

  it('should modifie the color with the parameters',()=>{
    let prim = "red"
    let sec = "blue"
    const service: ColorPickingService = TestBed.get(ColorPickingService);
    service.setColorsFromForm(prim, sec)
    expect(service.colors.primColor).toBe(prim)
    expect(service.colors.secColor).toBe(sec)
  })
  it('sould set the selector of the colors to the passing values',()=>{
    let x = 20
    let y = 40
    const service: ColorPickingService = TestBed.get(ColorPickingService);
    service.setSLCursor(x,y)
    expect(service.cData.slCursorX).toEqual(x)
    expect(service.cData.slCursorY).toEqual(y)
  })

  it('should prevent error',()=>{
    let mouseEventMock = new MouseEvent('mousedown')
    let spy = spyOn(mouseEventMock,'preventDefault')
    const service: ColorPickingService = TestBed.get(ColorPickingService);
    service.onContextMenu(mouseEventMock)
    expect(spy).toHaveBeenCalled()
  })

  it('should not call writeColor',()=>{
    const service: ColorPickingService = TestBed.get(ColorPickingService);
    let color: number[] = []
    service.setColor(color)
    let spy= spyOn(service,'writeColor')
    expect(spy).toHaveBeenCalledTimes(0);
  })

  it('should call functions and modify the sliders input',()=>{
    const service: ColorPickingService = TestBed.get(ColorPickingService);
    let color: number[]= [10,22,43]
    let writeSpy =spyOn(service,'writeColor')
    let hexSpy = spyOn(service, 'hexInputDisplayRefresh')
    service.setColor(color)
    expect(writeSpy).toHaveBeenCalled()
    expect(hexSpy).toHaveBeenCalled()
    expect(service.cData.redSliderInput).toEqual(color[0])
    expect(service.cData.greenSliderInput).toEqual(color[1])
    expect(service.cData.blueSliderInput).toEqual(color[2])
  })

  it('the colors should be undefined',()=>{
    const service: ColorPickingService = TestBed.get(ColorPickingService);
    let color: number[] = []
    let spy =spyOn(service.colorConvert,'rgbToHex')
    service.writeColor(color,true)
    expect(service.cData.primaryColor).toBeUndefined()
    expect(service.cData.secondaryColor).toBeUndefined()
    expect(spy).toHaveBeenCalledTimes(0)
  })
  it('the secondary color should not change and rgbToHex to be called',()=>{
    const service: ColorPickingService = TestBed.get(ColorPickingService);
    let color: number[] = [20,25,40]
    let spy =spyOn(service.colorConvert,'rgbToHex')
    service.writeColor(color,true)
    expect(service.cData.secondaryColor).toBeUndefined()
    expect(service.cData.checkboxSliderStatus).toBeTruthy()
    expect(service.cData.currentColorSelect).toBe('Primary')
    expect(spy).toHaveBeenCalledTimes(3)
  })

  it('the primary color should not change and rgbToHex to be called',()=>{
    const service: ColorPickingService = TestBed.get(ColorPickingService);
    let color: number[] = [20,25,40]
    let spy =spyOn(service.colorConvert,'rgbToHex')
    service.writeColor(color,false)
    expect(service.cData.primaryColor).toBeUndefined()
    expect(service.cData.checkboxSliderStatus).toBeFalsy()
    expect(service.cData.currentColorSelect).toBe('Secondary')
    expect(spy).toHaveBeenCalledTimes(3)
  })

  //it('')  
});
