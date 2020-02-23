import { TestBed } from '@angular/core/testing';
import { colorData } from 'src/app/components/color-picker/color-data';
import { ColorPickingService } from './color-picking.service';
import { ColorConvertingService } from './color-converting.service';

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
      offsetY: 190,
      button: 2
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
    const spy = spyOn(service.colorSubject, 'next')
    service.emitColors()
    expect(spy).toHaveBeenCalled()
  })

  it('should modifiy the color with the parameters', () => {
    const prim = 'red'
    const sec = 'blue'
    const bg = 'Green'
    service.setColorsFromForm(prim, sec, bg)
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

  it('set color should set the primary color to the string returned by the converter',()=>{
    let color : number[] = [1, 2, 3]
    const spyRgb = spyOn(service.colorConvert,'rgbToHex');
    const spyAlphaRGB = spyOn(service.colorConvert,'alphaRGBToHex');
    const converter = new ColorConvertingService()
    let expectedColor = '#'+ converter.rgbToHex(color[0])+converter.rgbToHex(color[1])+ converter.rgbToHex(color[2])
    expectedColor += converter.alphaRGBToHex(service.cData.primaryAlpha);
    service.setColor(color)
    expect(spyRgb).toHaveBeenCalled()
    expect(spyAlphaRGB).toHaveBeenCalled()
    expect(service.cData.primaryColor).toBe(expectedColor);
  })

  it('set color should set the secondary color to the string returned by the converter',()=>{
    let color : number[] = [1, 2, 3]
    const spyRgb = spyOn(service.colorConvert,'rgbToHex');
    const spyAlphaRGB = spyOn(service.colorConvert,'alphaRGBToHex');
    const converter = new ColorConvertingService()
    let expectedColor = '#'+ converter.rgbToHex(color[0])+converter.rgbToHex(color[1])+ converter.rgbToHex(color[2])
    expectedColor += converter.alphaRGBToHex(service.cData.secondaryAlpha);
    service.cData.colorMode = "Secondary";
    service.setColor(color)
    expect(spyRgb).toHaveBeenCalled()
    expect(spyAlphaRGB).toHaveBeenCalled()
    expect(service.cData.secondaryColor).toBe(expectedColor);
  })
  it('set color should set the background color to the string returned by the converter',()=>{
    let color : number[] = [1, 2, 3]
    const spyRgb = spyOn(service.colorConvert,'rgbToHex');
    const spyAlphaRGB = spyOn(service.colorConvert,'alphaRGBToHex');
    const converter = new ColorConvertingService()
    let expectedColor = '#'+ converter.rgbToHex(color[0])+converter.rgbToHex(color[1])+ converter.rgbToHex(color[2])
    expectedColor += converter.alphaRGBToHex(service.cData.backgroundColorAlpha);
    service.cData.colorMode = service.cData.BACKGROUND_COLOR_MODE;
    service.setColor(color)
    expect(spyRgb).toHaveBeenCalled()
    expect(spyAlphaRGB).toHaveBeenCalled()
    expect(service.cData.backgroundColor).toBe(expectedColor);
  })
  it('color mode should be background color mode',()=>{
    service.cData.colorMode = service.cData.BACKGROUND_COLOR_MODE;
    service.setColorMode(mouseEventStub);
    expect(service.cData.colorMode).toBe(service.cData.BACKGROUND_COLOR_MODE)
  })

  it('color mode should change to primary color mode',()=>{
    service.cData.colorMode = service.cData.SECONDARY_COLOR_MODE;
    service.setColorMode(mouseEventStub);
    expect(service.cData.colorMode).toBe(service.cData.PRIMARY_COLOR_MODE)
  })
  it('color mode should change to secondary color mode',()=>{
    service.cData.colorMode = service.cData.PRIMARY_COLOR_MODE;
    service.setColorMode(mouseEventStubBigOffset);
    expect(service.cData.colorMode).toBe(service.cData.SECONDARY_COLOR_MODE)
  })
  it('should set the SLCursor to the parameters values',()=>{
    const x: number =1;
    const y: number =2;
    service.setSLCursor(x,y);
    expect(service.cData.slCursorX).toEqual(x);
    expect(service.cData.slCursorY).toEqual(y);
  })
  it('slSelector method should not call functions',()=>{
    const spySL = spyOn(service,'setSLCursor');
    const spyColor = spyOn(service,'setColor');
    const spyUpdate = spyOn(service, 'updateDisplay');
    service.cData.isSLSelecting = false;
    service.slSelector(mouseEventStubBigOffset);
    expect(spySL).toHaveBeenCalledTimes(0);
    expect(spyColor).toHaveBeenCalledTimes(0);
    expect(spyUpdate).toHaveBeenCalledTimes(0);
  })
  it('slSelector should call functions and set values to attributes',()=>{
    const spySL = spyOn(service,'setSLCursor');
    const spyColor = spyOn(service,'setColor');
    const spyUpdate = spyOn(service, 'updateDisplay');
    service.cData.isSLSelecting = true;
    service.slSelector(mouseEventStubBigOffset)
    expect(spySL).toHaveBeenCalled();
    expect(spyColor).toHaveBeenCalled();
    expect(spyUpdate).toHaveBeenCalled();
    expect(service.cData.saturationSliderInput).toEqual((mouseEventStubBigOffset.offsetX-25)*2)
    expect(service.cData.lightnessSliderInput).toEqual((mouseEventStubBigOffset.offsetY-25)*2)
  })
  it('last color selector should call setters and update the display',()=>{
    const spyColorMode = spyOn(service,'setColorMode');
    const spyColor = spyOn(service,'setColor');
    const spyUpdate = spyOn(service,'updateDisplay')
    const color ='ffffffff'
    service.lastColorSelector(mouseEventStub, color);
    expect(spyColorMode).toHaveBeenCalled();
    expect(spyColor).toHaveBeenCalled();
    expect(spyUpdate).toHaveBeenCalled();
  })
  it('should call to prevent the error',()=>{
    const mouseStub = new MouseEvent('mousedown');
    const spyPrevent = spyOn(mouseStub,'preventDefault');
    service.onContextMenu(mouseStub);
    expect(spyPrevent).toHaveBeenCalled();
  })
  
});
