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
    service.emitColors()
    let spy = spyOn(service.colorSubject,'next')
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

  
});
