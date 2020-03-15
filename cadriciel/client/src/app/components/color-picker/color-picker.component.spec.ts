import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ColorPickerComponent } from './color-picker.component';
describe('ColorPickerComponent', () => {
    let component: ColorPickerComponent;
    let fixture: ComponentFixture<ColorPickerComponent>;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ColorPickerComponent],
            imports: [FormsModule]
        })
        .compileComponents();
    }));
    beforeEach(() => {
        fixture = TestBed.createComponent(ColorPickerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('should init colors and emit them', () => {
        const initSpy = spyOn(component, 'initColors');
        const emitSpy = spyOn(component.colorPicking, 'emitColors');
        component.ngOnInit();
        expect(initSpy).toHaveBeenCalled();
        expect(emitSpy).toHaveBeenCalled();
    });
    it('should init colors with the default values', () => {
        const DEF_PRIM = '#000000ff';
        const DEF_SEC = '#ff0000ff';
        const DEF_BG = '#ffffffff';
        component.initColors();
        expect(component.cData.primaryColor).toBe(DEF_PRIM);
        expect(component.cData.secondaryColor).toBe(DEF_SEC);
        expect(component.cData.backgroundColor).toBe(DEF_BG);
    });
    it(' should init colors with the custom values', () => {
        // const colorPicking = new ColorPickingService(new ColorConvertingService());
        const PRIM_COLOR = '#ffffffff';
        const SEC_COLOR = '#ffffffff';
        const BG_COLOR = '#00000000';
        // colorPicking.colorSubject.next(new ChoosenColors(PRIM_COLOR, SEC_COLOR,BG_COLOR));
        component.colorPicking.colorSubject.next({primColor: PRIM_COLOR, secColor: SEC_COLOR, backColor: BG_COLOR});
        component.initColors();
        expect(component.cData.primaryColor).toBe(PRIM_COLOR);
        expect(component.cData.secondaryColor).toBe(SEC_COLOR);
        expect(component.cData.backgroundColor).toBe(BG_COLOR);
    });
    it('should call set color', () => {
        const setSpy = spyOn(component.colorPicking, 'setColor');
        component.setColor([1, 2, 3]);
        expect(setSpy).toHaveBeenCalled();
    });
    it('should call hue selector', () => {
        const mouseStub = new MouseEvent('mousedown');
        const hueSpy = spyOn(component.colorPicking, 'hueSelector');
        component.hueSelector(mouseStub);
        expect(hueSpy).toHaveBeenCalled();
    });
    it('should call sl selector', () => {
        const mouseStub = new MouseEvent('mousedown');
        const slSpy = spyOn(component.colorPicking, 'slSelector');
        component.slSelector(mouseStub);
        expect(slSpy).toHaveBeenCalled();
    });
    it('should call on context menu', () => {
        const mouseStub = new MouseEvent('mousedown');
        const contextSpy = spyOn(component.colorPicking, 'onContextMenu');
        component.onContextMenu(mouseStub);
        expect(contextSpy).toHaveBeenCalled();
    });
    it('should call color select on mouse up', () => {
        const selectorSpy = spyOn(component.colorPicking, 'colorSelectOnMouseUp');
        component.colorSelectOnMouseUp();
        expect(selectorSpy).toHaveBeenCalled();
    });
    it('should call the hue selector on mouse down', () => {
        const mouseStub = new MouseEvent('mousedown');
        const hueSpy = spyOn(component.colorPicking, 'hueSelectorOnMouseDown');
        component.hueSelectorOnMouseDown(mouseStub);
        expect(hueSpy).toHaveBeenCalled();
    });
    it('should call the selector on mouse leave', () => {
        const mouseStub = new MouseEvent('mousedown');
        const selectorSpy = spyOn(component.colorPicking, 'selectorOnMouseLeave');
        component.selectorOnMouseLeave(mouseStub);
        expect(selectorSpy).toHaveBeenCalled();
    });
    it('should call the slSelector', () => {
        const mouseStub = new MouseEvent('mousedown');
        const selectorSpy = spyOn(component.colorPicking, 'slSelectorOnMouseDown');
        component.slSelectorOnMouseDown(mouseStub);
        expect(selectorSpy).toHaveBeenCalled();
    });
    it('should call the last color selector', () => {
        const mouseStub = new MouseEvent('mousedown');
        const lastColor = 'ffffffff';
        const lastColorSpy = spyOn(component.colorPicking, 'lastColorSelector');
        component.lastColorSelector(mouseStub, lastColor);
        expect(lastColorSpy).toHaveBeenCalled();
    });
    it('should call swap on mouse over', () => {
        const swapSpy = spyOn(component.colorPicking, 'onSwapSVGMouseOver');
        component.onSwapSVGMouseOver();
        expect(swapSpy).toHaveBeenCalled();
    });
    it('should call swap on mouse leave', () => {
        const swapSpy = spyOn(component.colorPicking, 'onSwapSVGMouseLeave');
        component.onSwapSVGMouseLeave();
        expect(swapSpy).toHaveBeenCalled();
    });
    it('should call swap on mouse down', () => {
        const swapSpy = spyOn(component.colorPicking, 'onSwapSVGMouseDown');
        component.onSwapSVGMouseDown();
        expect(swapSpy).toHaveBeenCalled();
    });
    it('should call swap on mouse up', () => {
        const swapSpy = spyOn(component.colorPicking, 'onSwapSVGMouseUp');
        component.onSwapSVGMouseUp();
        expect(swapSpy).toHaveBeenCalled();
    });
    it('should call on radio button change', () => {
        const radioSpy = spyOn(component.colorPicking, 'onRadioButtonChange');
        const colorMode = 'Primary';
        component.onRadioButtonChange(colorMode);
        expect(radioSpy).toHaveBeenCalled();
    });
    it('should swap input display', () => {
        const swapSpy = spyOn(component.colorPicking, 'swapInputDisplay');
        component.swapInputDisplay();
        expect(swapSpy).toHaveBeenCalled();
    });
    it('should call validate hex input', () => {
        const validatorSpy = spyOn(component.colorPicking, 'validateHexInput');
        const keyboardEventStub = new KeyboardEvent('keyUp');
        const hexLength = 10;
        const hex = '0000';
        component.validateHexInput(keyboardEventStub, hexLength, hex);
        expect(validatorSpy).toHaveBeenCalled();
    });
    it('should call onHexInput', () => {
        const inputSpy = spyOn(component.colorPicking, 'onHexInput');
        component.onHexInput(10, '00000000', 'background');
        expect(inputSpy).toHaveBeenCalled();
    });
    it('should call on sl slider input', () => {
        const sliderSpy = spyOn(component.colorPicking, 'onSLSliderInput');
        component.onSLSliderInput();
        expect(sliderSpy).toHaveBeenCalled();
    });
    it('should call slider alpha change', () => {
        const sliderSpy = spyOn(component.colorPicking, 'sliderAlphaChange');
        component.sliderAlphaChange();
        expect(sliderSpy).toHaveBeenCalled();
    });
    it('should swap primary secondary', () => {
        const swapSpy = spyOn(component.colorPicking, 'swapPrimarySecondary');
        component.swapPrimarySecondary();
        expect(swapSpy).toHaveBeenCalled();
    });
});
