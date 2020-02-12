import { TestBed } from '@angular/core/testing';

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

  it('should prevent error', () => {
    const mouseEventMock = new MouseEvent('mousedown')
    const spy = spyOn(mouseEventMock, 'preventDefault')
    service.onContextMenu(mouseEventMock)
    expect(spy).toHaveBeenCalled()
  })

  it('should not call writeColor', () => {
    const color: number[] = []
    service.setColor(color)
    const spy = spyOn(service, 'writeColor')
    expect(spy).toHaveBeenCalledTimes(0);
  })

  it('should call functions and modify the sliders input', () => {
    const color: number[] = [10, 22, 43]
    const writeSpy = spyOn(service, 'writeColor')
    const hexSpy = spyOn(service, 'hexInputDisplayRefresh')
    service.setColor(color)
    expect(writeSpy).toHaveBeenCalled()
    expect(hexSpy).toHaveBeenCalled()
    expect(service.cData.redSliderInput).toEqual(color[0])
    expect(service.cData.greenSliderInput).toEqual(color[1])
    expect(service.cData.blueSliderInput).toEqual(color[2])
  })

  it('should not call a converting function on empty colors', () => {
    const color: number[] = [];
    const spy = spyOn(service.colorConvert, 'rgbToHex');
    service.writeColor(color, true);

    expect(spy).toHaveBeenCalledTimes(0);
  })
  it('the secondary color should not change if undefined', () => {
    const color: number[] = [20, 25, 40]

    service.writeColor(color, true)

    expect(service.cData.checkboxSliderStatus).toBeTruthy()
    expect(service.cData.currentColorSelect).toBe('Primary')

  })

  it('the primary color should not be modified if undefined', () => {

    const color: number[] = [20, 25, 40]

    service.writeColor(color, false)

    expect(service.cData.checkboxSliderStatus).toBeFalsy()
    expect(service.cData.currentColorSelect).toBe('Secondary')

  })

  it('should select a primary hue on mouse down', () => {
    service.cData.isSLSelecting = false; // we are selecting the hue
    const spy = spyOn(service, 'hueSelector');
    service.hueSelectorOnMouseDown(mouseEventStub);
    expect(spy).toHaveBeenCalledWith(mouseEventStub); // primary selection with left click
    expect(service.cData.primarySelect).toBeTruthy();
  });

  it('should call the hue selector with mouse event on hue sel', () => {
    service.cData.isHueSelecting = true;
    const spy = spyOn(service, 'hueSelector');
    service.selectorOnMouseLeave(mouseEventStub);
    expect(spy).toHaveBeenCalledWith(mouseEventStub);
  });

  it('the sl selector should be usable on mouse down (left click)', () => {
    const spy = spyOn(service, 'slSelector');
    service.cData.isHueSelecting = false; // selecting the saturation-luminance
    service.slSelectorOnMouseDown(mouseEventStub);
    expect(spy).toHaveBeenCalledWith(mouseEventStub);
    expect(service.cData.primarySelect).toBeTruthy();
  });

  it('opacities should be set to default value after hue selector changed', () => {
    service.cData.isHueSelecting = true; // need to be on hue sel. mode

    const mouseMock = new MouseEvent('mousedown');
    const spyCursor = spyOn(service, 'setSLCursor')
    const spyColor = spyOn(service, 'setColor')
    const spyDisplay = spyOn(service, 'hexInputDisplayRefresh')
    const RATE = 1; // fraction of alpha
    service.cData.primaryAlpha = RATE;
    service.cData.secondaryAlpha = RATE;
    service.hueSelector(mouseMock);

    expect(service.cData.opacitySliderInput).toEqual(100)

    expect(spyCursor).toHaveBeenCalled()
    expect(spyColor).toHaveBeenCalled()
    expect(spyDisplay).toHaveBeenCalled()
  })

  it('slider inputs shall be set after hue selection with cursor', () => {
    const DEF_ALPHA = 100; // default values for the color sliders
    const DEF_SAT = 100;
    const DEF_LIGHT = 50;
    service.cData.isHueSelecting = true;
    const mouseMock = new MouseEvent('mousedown');
    const spyCursor = spyOn(service, 'setSLCursor')
    const spyColor = spyOn(service, 'setColor')
    const spyDisplay = spyOn(service, 'hexInputDisplayRefresh')
    const spyCompute = spyOn(service, 'computeHue');

    service.hueSelector(mouseMock)

    expect(spyCursor).toHaveBeenCalled()
    expect(spyColor).toHaveBeenCalled()
    expect(spyDisplay).toHaveBeenCalled()
    expect(spyCompute).toHaveBeenCalled()

    expect(service.cData.saturationSliderInput).toEqual(DEF_SAT)
    expect(service.cData.lightnessSliderInput).toEqual(DEF_LIGHT)
    expect(service.cData.opacitySliderInput).toEqual(DEF_ALPHA)
  })

  it('opacity should be 100 on secondary alpha by default', () => {
    const OP = 100;
    const service: ColorPickingService = TestBed.get(ColorPickingService);
    service.cData.secondaryAlpha = 1;
    service.cData.isHueSelecting = true;
    const mouseMock = new MouseEvent('mousedown');
    service.cData.primarySelect = false;
    service.hueSelector(mouseMock)
    expect(service.cData.opacitySliderInput).toEqual(OP);
  })

  it('should use raduisY>=0 case', () => {
    const radiusX: number = mouseEventStubBigOffset.offsetX - 95;
    const radiusY: number = mouseEventStubBigOffset.offsetY - 95;
    const radius: number = Math.sqrt( Math.pow( radiusX, 2) + Math.pow( radiusY, 2) );
    const theta: number = Math.acos( radiusX / radius);
    const ret = 180 / Math.PI * theta
    const hue = service.computeHue(mouseEventStubBigOffset)
    expect(hue).toEqual(ret)
  })
  it('should use raduisY < 0 case', () => {
    const radiusX: number = mouseEventStubSmallOffset.offsetX - 95;
    const radiusY: number = mouseEventStubSmallOffset.offsetY - 95;
    const radius: number = Math.sqrt( Math.pow( radiusX, 2) + Math.pow( radiusY, 2) );
    const theta: number = Math.acos( radiusX / radius);
    const ret = 360 - 180 / Math.PI * theta
    const hue = service.computeHue(mouseEventStubSmallOffset)
    expect(hue).toEqual(ret)
  })

  it('should swap primary secondary', () => {
    const primColorBefore = service.cData.primaryColor
    const primAlphaBefore = service.cData.primaryAlpha
    const secColorBefore = service.cData.secondaryColor
    const secAlphaBefore = service.cData.secondaryAlpha
    service.swapPrimarySecondary()
    expect(service.cData.primaryColor).toBe(secColorBefore)
    expect(service.cData.primaryAlpha).toBe(secAlphaBefore)
    expect(service.cData.secondaryColor).toBe(primColorBefore)
    expect(service.cData.secondaryAlpha).toBe(primAlphaBefore)
  })

  it('should not call functions if not selected', () => {
    const spySaturation = spyOn(service, 'computeSaturation')
    const spyLightness = spyOn(service, 'computeLightness')
    service.cData.isSLSelecting = false
    const slSpy = spyOn(service, 'setSLCursor')
    const colorSpy = spyOn(service, 'setColor')
    service.slSelector(mouseEventStubBigOffset)
    expect(spySaturation).not.toHaveBeenCalled();
    expect(spyLightness).not.toHaveBeenCalled();
    expect(slSpy).not.toHaveBeenCalled();
    expect(colorSpy).not.toHaveBeenCalled();

  })

  it('should call functions', () => {
    const spySaturation = spyOn(service, 'computeSaturation')
    const spyLightness = spyOn(service, 'computeLightness')
    const slSpy = spyOn(service, 'setSLCursor')
    const colorSpy = spyOn(service, 'setColor')
    // created a stub to call functions of the service, otherwise the test will always pass
    const serviceStub: ColorPickingService = TestBed.get(ColorPickingService);
    const x = serviceStub.computeSaturation(mouseEventStubBigOffset);
    const y = serviceStub.computeLightness(mouseEventStubBigOffset)
    service.cData.isSLSelecting = true;
    service.slSelector(mouseEventStubBigOffset)
    expect(spySaturation).toHaveBeenCalled()
    expect(spyLightness).toHaveBeenCalled()
    expect(slSpy).toHaveBeenCalled()
    expect(colorSpy).toHaveBeenCalled()
    expect(service.cData.saturationSliderInput).toEqual(x)
    expect(service.cData.lightnessSliderInput).toEqual(y)
  })

  it('saturation should be equal to 100', () => {
    const ret = service.computeSaturation(mouseEventStubBigOffset)
    expect(ret).toEqual(100)
  })

  it('saturation should be equal to 0', () => {
    const ret = service.computeSaturation(mouseEventStubSmallOffset)
    expect(ret).toEqual(0)
  })

  it('lightness should be equal to 100', () => {
    const ret = service.computeLightness(mouseEventStubBigOffset)
    expect(ret).toEqual(100)
  })

  it('lightness should be equal to 0', () => {
    const ret = service.computeLightness(mouseEventStubSmallOffset)
    expect(ret).toEqual(0)
  })

  it('attributes should take the values of the parameters', () => {
    const x = 20
    const y = 90
    service.setSLCursor(x, y)
    expect(service.cData.slCursorX).toEqual(x)
    expect(service.cData.slCursorY).toEqual(y)
  })

  it('should prevent the error', () => {
    const mouseMock = new MouseEvent('mousedown')
    const spyMouse = spyOn(mouseMock, 'preventDefault')
    service.onContextMenu(mouseMock)
    expect(spyMouse).toHaveBeenCalled()
  })

  it('should change the swap stroke to yellow', () => {
    service.onSwapSVGMouseOver()
    expect(service.cData.swapStrokeStyle).toBe('yellow')
  })

  it('should change the swap stroke to white', () => {
    service.onSwapSVGMouseLeave()
    expect(service.cData.swapStrokeStyle).toBe('white')
  })
  it('should change the swap stroke to lightblue', () => {
    service.onSwapSVGMouseDown()
    expect(service.cData.swapStrokeStyle).toBe('lightblue')
  })

  it('should change the swap stroke to white', () => {
    service.onSwapSVGMouseUp()
    expect(service.cData.swapStrokeStyle).toBe('white')
  })

  it('should call fuctions in colorSelector with primary color selected', () => {
    service.cData.primarySelect = true
    service.cData.isHueSelecting = true
    const spyUpdate = spyOn(service, 'updateLastColor')
    const spyForm = spyOn(service, 'setColorsFromForm')
    const spyEmit = spyOn(service, 'emitColors')
    service.colorSelectOnMouseUp()
    expect(spyUpdate).toHaveBeenCalled()
    expect(spyForm).toHaveBeenCalled()
    expect(spyEmit).toHaveBeenCalled()
    expect(service.cData.isHueSelecting).toBeFalsy()
    expect(service.cData.isSLSelecting).toBeFalsy()
    expect(service.cData.rectOffsetFill).toBe('none');
  })

  it('should call fuctions in colorSelector with primary color not selected', () => {
    service.cData.primarySelect = false
    service.cData.isHueSelecting = true
    const spyUpdate = spyOn(service, 'updateLastColor')
    const spyForm = spyOn(service, 'setColorsFromForm')
    const spyEmit = spyOn(service, 'emitColors')
    service.colorSelectOnMouseUp()
    expect(spyUpdate).toHaveBeenCalled()
    expect(spyForm).toHaveBeenCalled()
    expect(spyEmit).toHaveBeenCalled()
    expect(service.cData.isHueSelecting).toBeFalsy()
    expect(service.cData.isSLSelecting).toBeFalsy()
    expect(service.cData.rectOffsetFill).toBe('none');
  })

  it(' should not call functions in colorSelector', () => {
    service.cData.isHueSelecting = false;
    service.cData.isSLSelecting = false;
    const spyUpdate = spyOn(service, 'updateLastColor')
    const spyForm = spyOn(service, 'setColorsFromForm')
    const spyEmit = spyOn(service, 'emitColors')
    service.colorSelectOnMouseUp()
    expect(spyEmit).toHaveBeenCalledTimes(0)
    expect(spyUpdate).toHaveBeenCalledTimes(0)
    expect(spyForm).toHaveBeenCalledTimes(0)
  })

  it('should update the last color on recent color palette', () => { // err
    const FILL = 'ff0000' // faked color selection, def
    service.updateLastColor(FILL); // the first color pick
    expect(service.cData.lastColorRects.length).toBeGreaterThan(0);
  });

  it('should select the last color to be the primaryColor', () => {
    let mouseEventMock: any
    const spyDisplay = spyOn(service, 'updateDisplay')
    mouseEventMock = {
      button: 0
    }
    const lastColor = 'Red'
    service.lastColorSelector(mouseEventMock, lastColor)
    expect(service.cData.primaryColor).toBe('Red')
    expect(service.cData.checkboxSliderStatus).toBeTruthy()
    expect(service.cData.primarySelect).toBeTruthy()
    expect(service.cData.currentColorSelect).toBe('Primary')
    expect(spyDisplay).toHaveBeenCalled()
    expect(service.cData.opacitySliderInput).toEqual(service.cData.primaryAlpha * 100)
  })

  it('should select the last color to be the primaryColor', () => {
    let mouseEventMock: any
    const spyDisplay = spyOn(service, 'updateDisplay')
    mouseEventMock = {
      button: 2
    }
    const lastColor = 'Red'
    service.lastColorSelector(mouseEventMock, lastColor)
    expect(service.cData.secondaryColor).toBe('Red')
    expect(service.cData.checkboxSliderStatus).toBeFalsy()
    expect(service.cData.primarySelect).toBeFalsy()
    expect(service.cData.currentColorSelect).toBe('Secondary')
    expect(spyDisplay).toHaveBeenCalled()
    expect(service.cData.opacitySliderInput).toEqual(service.cData.secondaryAlpha * 100)
  })

  it('should update the display and call functions to set and emit the colors', () => {
    const color = 'ffffff'
    const spySL = spyOn(service, 'setSLCursor')
    const spyDisplayHex = spyOn(service, 'hexInputDisplayRefresh')
    const spyColorsForm = spyOn(service, 'setColorsFromForm')
    const spyEmit = spyOn(service, 'emitColors')
    service.updateDisplay(color)

    expect(spySL).toHaveBeenCalled()
    expect(spyColorsForm).toHaveBeenCalled()
    expect(spyDisplayHex).toHaveBeenCalled()
    expect(spyEmit).toHaveBeenCalled()
  })

  it('should refresh the display for primary', () => {
    const serviceStub: ColorPickingService = TestBed.get(ColorPickingService)
    serviceStub.cData.primarySelect = true
    const spyUpdate = spyOn(service, 'updateSliderField')
    serviceStub.refreshDisplay()
    expect(serviceStub.cData.currentColorSelect).toBe('Primary')
    expect(spyUpdate).toHaveBeenCalled()
  })

  it('should refresh the display for secondary', () => {
    const serviceStub: ColorPickingService = TestBed.get(ColorPickingService)
    serviceStub.cData.primarySelect = false
    const spyUpdate = spyOn(service, 'updateSliderField')
    serviceStub.refreshDisplay()
    expect(serviceStub.cData.currentColorSelect).toBe('Secondary')
    expect(spyUpdate).toHaveBeenCalled()
  })

  it('validateHex should have been called', () => {
    const keyboardEvent = new KeyboardEvent('keyup')
    const spyValidate = spyOn(service.colorConvert, 'validateHex')
    service.validateHexInput(keyboardEvent)
    expect(spyValidate).toHaveBeenCalled()
  })

  it('should call preventError', () => {
    let fakeKeyboardEvent: any
    fakeKeyboardEvent = {
      which: 2
    }
    const serviceStub: ColorPickingService = TestBed.get(ColorPickingService)
    serviceStub.cData.hexColorInput = 'ffffff';

    const spyPrevent = spyOn(service, 'preventError')
    serviceStub.validateHexColorInput(fakeKeyboardEvent)

    expect(spyPrevent).toHaveBeenCalled()

  })

  it('should call validateHexInput', () => {
    let keyboardEvent: any
    keyboardEvent = {
      which: 8
    }
    const serviceStub: ColorPickingService = TestBed.get(ColorPickingService)
    serviceStub.cData.hexColorInput = 'ffffff'
    const spyValidate = spyOn(service, 'validateHexInput')
    const spyPrevent = spyOn(service, 'preventError')
    serviceStub.validateHexColorInput(keyboardEvent)
    expect(spyPrevent).toHaveBeenCalledTimes(0)
    expect(spyValidate).toHaveBeenCalled()
  });

  it('should prevent default browser behavior', () => {

    const spy = spyOn(kbEventStub, 'preventDefault');
    service.preventError(kbEventStub);
    expect(spy).toHaveBeenCalled();
  });

  it('should call a validator on red hexadecimal color input and prevent error', () => {
    service.cData.redHexInput = 'ff'; // valid input,arbirary
    const spyPrev = spyOn(service, 'preventError');
    const spyValidate = spyOn(service, 'validateHexInput');

    service.validateRedHexInput(kbEventStub);
    expect(spyPrev).toHaveBeenCalled();
    expect(spyValidate).toHaveBeenCalled();
  });

  it('should call a validator on green hexadecimal color input and prevent error', () => {
    service.cData.greenHexInput = 'ff'; // valid input,arbirary
    const spyPrev = spyOn(service, 'preventError');
    const spyValidate = spyOn(service, 'validateHexInput');

    service.validateGreenHexInput(kbEventStub);
    expect(spyPrev).toHaveBeenCalled();
    expect(spyValidate).toHaveBeenCalled();
  });

  it('should call a validator on blue hexadecimal color input and prevent error', () => {
    service.cData.blueHexInput = 'ff'; // valid input,arbirary
    const spyPrev = spyOn(service, 'preventError');
    const spyValidate = spyOn(service, 'validateHexInput');

    service.validateBlueHexInput(kbEventStub);
    expect(spyPrev).toHaveBeenCalled();
    expect(spyValidate).toHaveBeenCalled();
  });

  it('should update the sliders on hexadecimal input', () => {
    const INPUT = 'ffffff';
    service.cData.hexColorInput = INPUT;
    service.cData.isValideInput = true;
    const spy = spyOn(service, 'updateSliderField');

    service.onHexColorInput(kbEventStub);
    expect(spy).toHaveBeenCalled();
  });

  it('should set primary and secondary colors on hex input', () => {

    service.cData.hexColorInput = colorData.hexColorInput;
    service.cData.isValideInput = true;

    service.cData.primarySelect = true; // we are looking for our primary color
    service.onHexColorInput(kbEventStub);
    expect(service.cData.primaryColor).toBeDefined();

    // let's do the same for the secondary color
    service.cData.primarySelect = false; // we are looking for our primary color
    service.onHexColorInput(kbEventStub);
    expect(service.cData.secondaryColor).toBeDefined()

  });

  it('should update the sliders on red hexadecimal input', () => {
    const IN = 'ff'; // valid input'
    service.cData.redHexInput = IN;
    service.cData.isValideInput = true;
    service.cData.primarySelect = true; // looking for a primary color
    const spy = spyOn(service, 'updateSliderField');
    service.onRedHexInput();
    expect(spy).toHaveBeenCalled();

    // for a secondary color
    service.cData.primarySelect = false;
    service.onRedHexInput();
    expect(spy).toHaveBeenCalledTimes(2); // second time we call our spy
  });

  it('should update the sliders on green hexadecimal input', () => {
    const IN = 'ff'; // valid input'
    service.cData.greenHexInput = IN;
    service.cData.isValideInput = true;
    service.cData.primarySelect = true; // looking for a primary color
    const spy = spyOn(service, 'updateSliderField');
    service.onGreenHexInput();
    expect(spy).toHaveBeenCalled();

    // for a secondary color
    service.cData.primarySelect = false;
    service.onGreenHexInput();
    expect(spy).toHaveBeenCalledTimes(2); // second time we call our spy
  });

  it('should update the sliders on blue hexadecimal input', () => {
    const IN = 'ff'; // valid input'
    service.cData.blueHexInput = IN;
    service.cData.isValideInput = true;
    service.cData.primarySelect = true; // looking for a primary color
    const spy = spyOn(service, 'updateSliderField');
    service.onBlueHexInput();
    expect(spy).toHaveBeenCalled();

    // for a secondary color
    service.cData.primarySelect = false;
    service.onBlueHexInput();
    expect(spy).toHaveBeenCalledTimes(2); // second time we call our spy
  });

  it('should convert hex to rgba when updating slider fields', () => {
    const COLOR = 'ffffffff'; // random valid hex input for rgba
    const spy = spyOn(service.colorConvert, 'hexToRgba');

    service.updateSliderField(COLOR);
    expect(spy).toHaveBeenCalled();
  });

  it('should update the opacity slider on valid alpha data', () => {
    const COLOR = 'ffffffff';
    const EXPECTED = 100; // expected slider value (max)

    service.updateSliderField(COLOR);
    expect(service.cData.opacitySliderInput).toEqual(EXPECTED);
  });

  it('should emit the colors after setting up the cursors', () => {
    const COLOR = 'ffffffff';
    const spySL = spyOn(service, 'setSLCursor');
    const spyUpdate = spyOn(service, 'updateLastColor');
    const spySet = spyOn(service, 'setColorsFromForm');
    const spyEmit = spyOn(service, 'emitColors');

    service.updateSliderField(COLOR);

    expect(spySL).toHaveBeenCalled();
    expect(spyUpdate).toHaveBeenCalled();
    expect(spySet).toHaveBeenCalled();
    expect(spyEmit).toHaveBeenCalled();
  });

  it('should update the hue wheel and cursor on RGB slider input', () => {
    const spy = spyOn(service, 'sliderInputDisplayRefresh');
    service.onRGBSliderInput();
    expect(spy).toHaveBeenCalled();
  });

  it('should update the hue wheel and cursor on SL slider input', () => {
    const spy = spyOn(service, 'sliderInputDisplayRefresh');
    service.onSLSliderInput();
    expect(spy).toHaveBeenCalled();
  });

  it('should update the hex input on slider change', () => {
    service.cData.primaryColor = 'ffffffff';
    service.cData.secondaryColor = '000000ff';

    const spy = spyOn(service, 'hexInputDisplayRefresh');
    const spyWrite = spyOn(service, 'writeColorSlider');
    service.cData.primarySelect = true; // choosing the rimary color
    service.sliderInputDisplayRefresh();
    expect(spy).toHaveBeenCalled()
    expect(spyWrite).toHaveBeenCalledWith(true); // since its for the prim color

    service.cData.primarySelect = false; // sec color
    service.sliderInputDisplayRefresh();
    expect(spyWrite).toHaveBeenCalledWith(false);
  });

  it('should emit colors on hexadecimal input refresh', () => {
    const spy = spyOn(service, 'emitColors');
    service.hexInputDisplayRefresh()
    expect(spy).toHaveBeenCalled();
  });

  it('should write the colors on slider alpha change and emit them', () => {
    const isPrim = true;
    service.cData.primarySelect = isPrim;
    const spy = spyOn(service, 'writeColorAlphaChange');
    service.sliderAlphaChange();
    expect(spy).toHaveBeenCalledWith(isPrim);

    const spyEmit = spyOn(service, 'emitColors');
    service.sliderAlphaChange();
    expect(spy).toHaveBeenCalled();
    expect(spyEmit).toHaveBeenCalled();

  })

});
