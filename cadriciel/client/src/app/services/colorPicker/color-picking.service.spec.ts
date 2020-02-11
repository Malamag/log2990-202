import { TestBed } from '@angular/core/testing';

import { ColorPickingService } from './color-picking.service';

describe('ColorPickingService', () => {
  let mouseEventStub: any;
  let service: ColorPickingService;
  
  let mouseEventStubBigOffset:any;
  let mouseEventStubSmallOffset:any
  
  beforeEach(() => {
    mouseEventStub = {
      button:0 // left button pressed
    }
    mouseEventStubBigOffset ={
      offsetX: 160,
      offsetY: 190
    }
    mouseEventStubSmallOffset ={
      offsetX: 40,
      offsetY: 49
    }
    TestBed.configureTestingModule({
      providers: [{provide: MouseEvent, mouseEventStub}]
    })
    service= TestBed.get(ColorPickingService);
  });
 
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call the next method of the observer',()=>{
    const service: ColorPickingService = TestBed.get(ColorPickingService);
    let spy = spyOn(service.colorSubject,'next')
    service.emitColors()
    expect(spy).toHaveBeenCalled()
  })

  it('should modifiy the color with the parameters',()=>{
    let prim = "red"
    let sec = "blue"
    service.setColorsFromForm(prim, sec)
    expect(service.colors.primColor).toBe(prim)
    expect(service.colors.secColor).toBe(sec)
  })
  it('sould set the selector of the colors to the passing values',()=>{
    let x = 20
    let y = 40
    service.setSLCursor(x,y)
    expect(service.cData.slCursorX).toEqual(x)
    expect(service.cData.slCursorY).toEqual(y)
  })

  it('should prevent error',()=>{
    let mouseEventMock = new MouseEvent('mousedown')
    let spy = spyOn(mouseEventMock,'preventDefault')
    service.onContextMenu(mouseEventMock)
    expect(spy).toHaveBeenCalled()
  })

  it('should not call writeColor',()=>{
    let color: number[] = []
    service.setColor(color)
    let spy= spyOn(service,'writeColor')
    expect(spy).toHaveBeenCalledTimes(0);
  })

  it('should call functions and modify the sliders input',()=>{
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

  it('should not call a converting function on empty colors',()=>{
    let color: number[] = [];
    let spy =spyOn(service.colorConvert,'rgbToHex');
    service.writeColor(color,true);
    
    expect(spy).toHaveBeenCalledTimes(0);
  })
  it('the secondary color should not change if undefined',()=>{
    let color: number[] = [20,25,40]
    
    service.writeColor(color,true)

    expect(service.cData.checkboxSliderStatus).toBeTruthy()
    expect(service.cData.currentColorSelect).toBe('Primary')
   
  })

  it('the primary color should not be modified if undefined',()=>{
    
    let color: number[] = [20,25,40]
    
    service.writeColor(color,false)
    
    expect(service.cData.checkboxSliderStatus).toBeFalsy()
    expect(service.cData.currentColorSelect).toBe('Secondary')
    
  })

  //split from line 206 ************************
  it('should select a primary hue on mouse down', ()=>{
    service.cData.isSLSelecting = false; // we are selecting the hue
    const spy = spyOn(service, "hueSelector");
    service.hueSelectorOnMouseDown(mouseEventStub);
    expect(spy).toHaveBeenCalledWith(mouseEventStub); // primary selection with left click
    expect(service.cData.primarySelect).toBeTruthy();
  });

  it('should call the hue selector with mouse event on hue sel',()=>{
    service.cData.isHueSelecting = true;
    const spy = spyOn(service, "hueSelector");
    service.selectorOnMouseLeave(mouseEventStub);
    expect(spy).toHaveBeenCalledWith(mouseEventStub);
  });

  it('the sl selector should be usable on mouse down (left click)', ()=>{
    const spy = spyOn(service, "slSelector");
    service.cData.isHueSelecting = false; // selecting the saturation-luminance
    service.slSelectorOnMouseDown(mouseEventStub);
    expect(spy).toHaveBeenCalledWith(mouseEventStub);
    expect(service.cData.primarySelect).toBeTruthy();
  });

  it('should')


  it('opacities should be setted to default value',()=>{
    let mouseMock = new MouseEvent('mousedown');
    let spyCursor = spyOn(service,'setSLCursor')
    let spyColor = spyOn(service,'setColor')
    let spyDisplay = spyOn(service,'hexInputDisplayRefresh')
    service.hueSelector(mouseMock)
    expect(service.cData.opacitySliderInput).toEqual(100)
    expect(spyCursor).toHaveBeenCalledTimes(0)
    expect(spyColor).toHaveBeenCalledTimes(0)
    expect(spyDisplay).toHaveBeenCalledTimes(0)
  })
  it('functions should be called',()=>{
    service.cData.isHueSelecting = true;
    let mouseMock = new MouseEvent('mousedown');
    let spyCursor = spyOn(service,'setSLCursor')
    let spyColor = spyOn(service,'setColor')
    let spyDisplay = spyOn(service,'hexInputDisplayRefresh')
    let spyCompute = spyOn(service,'computeHue')
    service.hueSelector(mouseMock)
    expect(spyCursor).toHaveBeenCalled()
    expect(spyColor).toHaveBeenCalled()
    expect(spyDisplay).toHaveBeenCalled()
    expect(spyCompute).toHaveBeenCalled()
    expect(service.cData.saturationSliderInput).toEqual(100)
    expect(service.cData.lightnessSliderInput).toEqual(50)
    expect(service.cData.opacitySliderInput).toEqual(100)
  })

  it('opacity should be 50',()=>{
    const service: ColorPickingService = TestBed.get(ColorPickingService);
    service.cData.isHueSelecting = true;
    let mouseMock = new MouseEvent('mousedown');
    service.cData.primarySelect = false;
    service.hueSelector(mouseMock)
    expect(service.cData.opacitySliderInput).toEqual(50)
  })

  it('should use raduisY>=0 case',()=>{
    let radiusX : number = mouseEventStubBigOffset.offsetX - 95;
    let radiusY : number = mouseEventStubBigOffset.offsetY - 95;
    let radius : number = Math.sqrt( Math.pow( radiusX, 2) + Math.pow( radiusY, 2) );
    let theta : number = Math.acos( radiusX / radius);
    let ret = 180/Math.PI*theta
    let hue = service.computeHue(mouseEventStubBigOffset)
    expect(hue).toEqual(ret)
  })
  it('should use raduisY < 0 case',()=>{
    let radiusX : number = mouseEventStubSmallOffset.offsetX - 95;
    let radiusY : number = mouseEventStubSmallOffset.offsetY - 95;
    let radius : number = Math.sqrt( Math.pow( radiusX, 2) + Math.pow( radiusY, 2) );
    let theta : number = Math.acos( radiusX / radius);
    let ret = 360-180/Math.PI*theta
    let hue = service.computeHue(mouseEventStubSmallOffset)
    expect(hue).toEqual(ret)
  })

  it('should swap primary secondary',()=>{
    let primColorBefore = service.cData.primaryColor
    let primAlphaBefore = service.cData.primaryAlpha
    let secColorBefore = service.cData.secondaryColor
    let secAlphaBefore = service.cData.secondaryAlpha
    service.swapPrimarySecondary()
    expect(service.cData.primaryColor).toBe(secColorBefore)
    expect(service.cData.primaryAlpha).toBe(secAlphaBefore)
    expect(service.cData.secondaryColor).toBe(primColorBefore)
    expect(service.cData.secondaryAlpha).toBe(primAlphaBefore)
  })

  it('should not call functions',()=>{
    let spySaturation = spyOn(service, 'computeSaturation')
    let spyLightness = spyOn(service, 'computeLightness')
    service.cData.isSLSelecting = false
    let slSpy = spyOn(service,'setSLCursor')
    let colorSpy = spyOn(service,'setColor') 
    service.slSelector(mouseEventStubBigOffset)
    expect(spySaturation).toHaveBeenCalledTimes(0)
    expect(spyLightness).toHaveBeenCalledTimes(0)
    expect(slSpy).toHaveBeenCalledTimes(0)
    expect(colorSpy).toHaveBeenCalledTimes(0)
    expect(service.cData.saturationSliderInput).toEqual(100)
    expect(service.cData.lightnessSliderInput).toEqual(50)
  })
  
  it('should call functions',()=>{
    let spySaturation = spyOn(service, 'computeSaturation')
    let spyLightness = spyOn(service, 'computeLightness')
    let slSpy = spyOn(service,'setSLCursor')
    let colorSpy = spyOn(service,'setColor')
    // created a stub to call functions of the service, otherwise the test will always pass
    const serviceStub: ColorPickingService = TestBed.get(ColorPickingService);
    let x = serviceStub.computeSaturation(mouseEventStubBigOffset);
    let y = serviceStub.computeLightness(mouseEventStubBigOffset)
    service.cData.isSLSelecting = true; 
    service.slSelector(mouseEventStubBigOffset)
    expect(spySaturation).toHaveBeenCalled()
    expect(spyLightness).toHaveBeenCalled()
    expect(slSpy).toHaveBeenCalled()
    expect(colorSpy).toHaveBeenCalled()
    expect(service.cData.saturationSliderInput).toEqual(x)
    expect(service.cData.lightnessSliderInput).toEqual(y)
  })

  it('saturation should be equal to 100',()=>{
    let ret =service.computeSaturation(mouseEventStubBigOffset)
    expect(ret).toEqual(100)
  })

  it('saturation should be equal to 0',()=>{
    let ret =service.computeSaturation(mouseEventStubSmallOffset)
    expect(ret).toEqual(0)
  })

  it('lightness should be equal to 100',()=>{
    let ret =service.computeLightness(mouseEventStubBigOffset)
    expect(ret).toEqual(100)
  })

  it('lightness should be equal to 0',()=>{
    let ret =service.computeLightness(mouseEventStubSmallOffset)
    expect(ret).toEqual(0)
  })

  it('attributes should take the values of the parameters',()=>{
    let x = 20
    let y = 90
    service.setSLCursor(x,y)
    expect(service.cData.slCursorX).toEqual(x)
    expect(service.cData.slCursorY).toEqual(y)
  })

  it('should prevent the error',()=>{
    const mouseMock = new MouseEvent('mousedown')
    let spyMouse = spyOn(mouseMock, 'preventDefault')
    service.onContextMenu(mouseMock)
    expect(spyMouse).toHaveBeenCalled()
  })

  it('should change the swap stroke to yellow',()=>{
    service.onSwapSVGMouseOver()
    expect(service.cData.swapStrokeStyle).toBe('yellow')
  })

  it('should change the swap stroke to white',()=>{
    service.onSwapSVGMouseLeave()
    expect(service.cData.swapStrokeStyle).toBe('white')
  })
  it('should change the swap stroke to lightblue',()=>{
    service.onSwapSVGMouseDown()
    expect(service.cData.swapStrokeStyle).toBe('lightblue')
  })

  it('should change the swap stroke to white',()=>{
    service.onSwapSVGMouseUp()
    expect(service.cData.swapStrokeStyle).toBe('white')
  })

  it('should call fuctions in colorSelector with primary color selected', ()=>{
    service.cData.primarySelect = true
    service.cData.isHueSelecting= true
    let spyUpdate = spyOn(service,'updateLastColor')
    let spyForm = spyOn(service,'setColorsFromForm')
    let spyEmit = spyOn(service,'emitColors')
    service.colorSelectOnMouseUp()
    expect(spyUpdate).toHaveBeenCalled()
    expect(spyForm).toHaveBeenCalled()
    expect(spyEmit).toHaveBeenCalled()
    expect(service.cData.isHueSelecting).toBeFalsy()
    expect(service.cData.isSLSelecting).toBeFalsy()
    expect(service.cData.rectOffsetFill).toBe('none');
  })

  it('should call fuctions in colorSelector with primary color not selected', ()=>{
    service.cData.primarySelect = false
    service.cData.isHueSelecting= true
    let spyUpdate = spyOn(service,'updateLastColor')
    let spyForm = spyOn(service,'setColorsFromForm')
    let spyEmit = spyOn(service,'emitColors')
    service.colorSelectOnMouseUp()
    expect(spyUpdate).toHaveBeenCalled()
    expect(spyForm).toHaveBeenCalled()
    expect(spyEmit).toHaveBeenCalled()
    expect(service.cData.isHueSelecting).toBeFalsy()
    expect(service.cData.isSLSelecting).toBeFalsy()
    expect(service.cData.rectOffsetFill).toBe('none');
  })

  it(' should not call functions in colorSelector',()=>{
    service.cData.isHueSelecting = false;
    service.cData.isSLSelecting = false;
    let spyUpdate = spyOn(service,'updateLastColor')
    let spyForm = spyOn(service,'setColorsFromForm')
    let spyEmit = spyOn(service,'emitColors')
    service.colorSelectOnMouseUp()
    expect(spyEmit).toHaveBeenCalledTimes(0)
    expect(spyUpdate).toHaveBeenCalledTimes(0)
    expect(spyForm).toHaveBeenCalledTimes(0)
  })

});
