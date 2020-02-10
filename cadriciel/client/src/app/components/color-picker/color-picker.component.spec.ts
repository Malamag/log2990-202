import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ColorPickerComponent } from './color-picker.component';
import { FormsModule } from '@angular/forms';
//import { Component, OnInit } from '@angular/core';
import { ColorPickingService } from '../../services/colorPicker/color-picking.service';
//import { colorData } from './color-data';
import { ChoosenColors } from 'src/app/models/ChoosenColors.model';
import { ColorConvertingService } from 'src/app/services/colorPicker/color-converting.service';

describe('ColorPickerComponent',()=>{
    let component: ColorPickerComponent;
    let fixture: ComponentFixture<ColorPickerComponent>
    beforeEach(async(()=>{
        TestBed.configureTestingModule({
            declarations:[ColorPickerComponent],
            imports:[FormsModule]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ColorPickerComponent);
        component = fixture.componentInstance
        fixture.detectChanges();
    });

    it('should create', ()=>{
        expect(component).toBeTruthy()
    })
    
    it('should assign the colors to the colors of the service',()=>{
        let primColor = "#ffffff"
        let secColor = '#ff0000'
        let colorConvertingStub = new ColorConvertingService()
        let colorPickingServiceStub = new ColorPickingService(colorConvertingStub)
        let chosenColorStub = new ChoosenColors(primColor,secColor)
        colorPickingServiceStub.colors= new ChoosenColors(chosenColorStub.primColor,chosenColorStub.secColor);
        let componentStub = new ColorPickerComponent(colorPickingServiceStub);
        componentStub.initColors();
        expect(componentStub.cData.primaryColor).toBe(primColor)
        expect(componentStub.cData.secondaryColor).toBe(secColor)
    })

    it('should assign to the default values',()=>{
        const DEF_PRIM = '#000000ff';
        const DEF_SEC = '#ff0000ff';
        let colorConvertingStub = new ColorConvertingService()
        let colorPickingServiceStub = new ColorPickingService(colorConvertingStub)
        let componentStub = new ColorPickerComponent(colorPickingServiceStub);
        componentStub.initColors();
        expect(componentStub.cData.primaryColor).toBe(DEF_PRIM)
        expect(componentStub.cData.secondaryColor).toBe(DEF_SEC)
    })

    it('should call the setColor method of the service',()=>{
        let colors: number[]= [10,55]
        let spyObj = spyOn(component.colorPicking,'setColor')
        component.setColor(colors)
        expect(spyObj).toHaveBeenCalled()
    })

    it('should call the hueSelector of the service',()=>{
        let mouseEventStub = new MouseEvent("mousedown")
        let spyObj = spyOn(component.colorPicking,'hueSelector')
        component.hueSelector(mouseEventStub)
        expect(spyObj).toHaveBeenCalled();
    })

    it('should call the slSelector of the service',()=>{
        let mouseEventStub = new MouseEvent("mousedown")
        let spyObj = spyOn(component.colorPicking,'slSelector')
        component.slSelector(mouseEventStub)
        expect(spyObj).toHaveBeenCalled();
    })

    it('should call the onContextMenu of the service',()=>{
        let mouseEventStub = new MouseEvent("mousedown")
        let spyObj = spyOn(component.colorPicking,'onContextMenu')
        component.onContextMenu(mouseEventStub)
        expect(spyObj).toHaveBeenCalled();
    })

    it('should call the selectMouseUp of the service',()=>{
        
        let spyObj = spyOn(component.colorPicking,'colorSelectOnMouseUp')
        component.colorSelectOnMouseUp()
        expect(spyObj).toHaveBeenCalled();
    })

    it('should call the hueSelectorOnMouseDown of the service',()=>{
        let mouseEventStub = new MouseEvent("mousedown")
        let spyObj = spyOn(component.colorPicking,'hueSelectorOnMouseDown')
        component.hueSelectorOnMouseDown(mouseEventStub)
        expect(spyObj).toHaveBeenCalled();
    })

    it('should call the selectorOnMouseLeave of the service',()=>{
        let mouseEventStub = new MouseEvent("mousedown")
        let spyObj = spyOn(component.colorPicking,'selectorOnMouseLeave')
        component.selectorOnMouseLeave(mouseEventStub)
        expect(spyObj).toHaveBeenCalled();
    })

    it('should call the slSelectorOnMouseLeave of the service',()=>{
        let mouseEventStub = new MouseEvent("mousedown")
        let spyObj = spyOn(component.colorPicking,'slSelectorOnMouseDown')
        component.slSelectorOnMouseDown(mouseEventStub)
        expect(spyObj).toHaveBeenCalled();
    })

    it('should call the lastColorSelector of the service',()=>{
        let mouseEventStub = new MouseEvent("mousedown")
        let lastCol = "ffffff";
        let spyObj = spyOn(component.colorPicking,'lastColorSelector')
        component.lastColorSelector(mouseEventStub, lastCol)
        expect(spyObj).toHaveBeenCalled()
    })

    it('should call onSwapSVGMouseOver of the service',()=>{
        let spyObj = spyOn(component.colorPicking,'onSwapSVGMouseOver')
        component.onSwapSVGMouseOver()
        expect(spyObj).toHaveBeenCalled()
    })

    it('should call onSwapSVGMouseLeave of the service',()=>{
        let spyObj = spyOn(component.colorPicking,'onSwapSVGMouseLeave')
        component.onSwapSVGMouseLeave()
        expect(spyObj).toHaveBeenCalled()
    })

    it('should call onSwapSVGMouseDown of the service',()=>{
        let spyObj = spyOn(component.colorPicking,'onSwapSVGMouseDown')
        component.onSwapSVGMouseDown()
        expect(spyObj).toHaveBeenCalled()
    })

    it('should call onSwapMouseUp of the service', ()=>{
        let spy = spyOn(component.colorPicking,'onSwapSVGMouseUp')
        component.onSwapSVGMouseUp()
        expect(spy).toHaveBeenCalled()
    })

    it('should call swapInputDisplay of the service',()=>{
        let spy = spyOn(component.colorPicking,'swapInputDisplay')
        let eventStub: MouseEvent= new MouseEvent("mousedown")
        component.swapInputDisplay(eventStub)
        expect(spy).toHaveBeenCalled()
    })

    it('should call refreshDisplay of the service', ()=>{
        let spy = spyOn(component.colorPicking, 'refreshDisplay')
        component.refreshDisplay()
        expect(spy).toHaveBeenCalled()
    })

    it('should call validateHexInput of the service',()=>{
        let spy = spyOn(component.colorPicking, 'validateHexInput')
        let keyboardEventStub = new KeyboardEvent("keydown")
        component.validateHexInput(keyboardEventStub)
        expect(spy).toHaveBeenCalled()
    })

    it('should call validateHexColorInput of the service',()=>{
        let spy = spyOn(component.colorPicking,'validateHexColorInput')
        let keyboardEventStub = new KeyboardEvent("keydown")
        component.validateHexColorInput(keyboardEventStub)
        expect(spy).toHaveBeenCalled()
    })

    it('should call validateRedHexInput of the service',()=>{
        let spy = spyOn(component.colorPicking,'validateRedHexInput')
        let keyboardEventStub = new KeyboardEvent("keydown")
        component.validateRedHexInput(keyboardEventStub)
        expect(spy).toHaveBeenCalled()
    })

    it('should call validateGreenHexInput of the service',()=>{
        let spy = spyOn(component.colorPicking,'validateGreenHexInput')
        let keyboardEventStub = new KeyboardEvent("keydown")
        component.validateGreenHexInput(keyboardEventStub)
        expect(spy).toHaveBeenCalled()
    })

    it('should call validateBlueHexInput of the service',()=>{
        let spy = spyOn(component.colorPicking,'validateBlueHexInput')
        let keyboardEventStub = new KeyboardEvent("keydown")
        component.validateBlueHexInput(keyboardEventStub)
        expect(spy).toHaveBeenCalled()
    })

    it('should call onHexColorInput of the service',()=>{
        let spy = spyOn(component.colorPicking,'onHexColorInput')
        let keyboardEventStub = new KeyboardEvent("keydown")
        component.onHexColorInput(keyboardEventStub)
        expect(spy).toHaveBeenCalled()
    })

    it('should call onRedHexInput of the service',()=>{
        let spy = spyOn(component.colorPicking,'onRedHexInput')
        component.onRedHexInput()
        expect(spy).toHaveBeenCalled()
    })

    it('should call onGreenHexInput of the service',()=>{
        let spy = spyOn(component.colorPicking,'onGreenHexInput')
        component.onGreenHexInput()
        expect(spy).toHaveBeenCalled()
    })

    it('should call onBlueHexInput of the service',()=>{
        let spy = spyOn(component.colorPicking,'onBlueHexInput')
        component.onBlueHexInput()
        expect(spy).toHaveBeenCalled()
    })

    it('should call onRGBSliderInput of the service', ()=>{
        let spy = spyOn(component.colorPicking,'onRGBSliderInput')
        component.onRGBSliderInput()
        expect(spy).toHaveBeenCalled()
    })

    it('should call onSLSliderInput of the service', ()=>{
        let spy= spyOn(component.colorPicking,'onSLSliderInput')
        component.onSLSliderInput()
        expect(spy).toHaveBeenCalled()
    })

    it('should call sliderAplphaChange of the service',()=>{
        let spy = spyOn(component.colorPicking, 'sliderAlphaChange')
        component.sliderAlphaChange()
        expect(spy).toHaveBeenCalled()
    })

    it('should call swapPrimarySecondary of the service',()=>{
        let spy = spyOn(component.colorPicking,'swapPrimarySecondary')
        component.swapPrimarySecondary()
        expect(spy).toHaveBeenCalled()
    })
})