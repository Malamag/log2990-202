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
        const INIT_SPY = spyOn(component, 'initColors');
        const EMIT_SPY = spyOn(component.colorPicking, 'emitColors');
        component.ngOnInit();
        expect(INIT_SPY).toHaveBeenCalled();
        expect(EMIT_SPY).toHaveBeenCalled();
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
        const FIRST = 1;
        const SECOND = 2;
        const THIRD = 3;
        const SET_SPY = spyOn(component.colorPicking, 'setColor');
        component.setColor([FIRST, SECOND, THIRD]);
        expect(SET_SPY).toHaveBeenCalled();
    });
    it('should call hue selector', () => {
        const MOUSE_STUB = new MouseEvent('mousedown');
        const HUE_SPY = spyOn(component.colorPicking, 'hueSelector');
        component.hueSelector(MOUSE_STUB);
        expect(HUE_SPY).toHaveBeenCalled();
    });
    it('should call sl selector', () => {
        const MOUSE_STUB = new MouseEvent('mousedown');
        const SL_SPY = spyOn(component.colorPicking, 'slSelector');
        component.slSelector(MOUSE_STUB);
        expect(SL_SPY).toHaveBeenCalled();
    });
    it('should call on context menu', () => {
        const MOUSE_STUB = new MouseEvent('mousedown');
        const CONTEXT_SPY = spyOn(component.colorPicking, 'onContextMenu');
        component.onContextMenu(MOUSE_STUB);
        expect(CONTEXT_SPY).toHaveBeenCalled();
    });
    it('should call color select on mouse up', () => {
        const SELECTOR_SPY = spyOn(component.colorPicking, 'colorSelectOnMouseUp');
        component.colorSelectOnMouseUp();
        expect(SELECTOR_SPY).toHaveBeenCalled();
    });
    it('should call the hue selector on mouse down', () => {
        const MOUSE_STUB = new MouseEvent('mousedown');
        const HUE_SPY = spyOn(component.colorPicking, 'hueSelectorOnMouseDown');
        component.hueSelectorOnMouseDown(MOUSE_STUB);
        expect(HUE_SPY).toHaveBeenCalled();
    });
    it('should call the selector on mouse leave', () => {
        const MOUSE_STUB = new MouseEvent('mousedown');
        const SELECTOR_SPY = spyOn(component.colorPicking, 'selectorOnMouseLeave');
        component.selectorOnMouseLeave(MOUSE_STUB);
        expect(SELECTOR_SPY).toHaveBeenCalled();
    });
    it('should call the slSelector', () => {
        const MOUSE_STUB = new MouseEvent('mousedown');
        const SELECTOR_SPY = spyOn(component.colorPicking, 'slSelectorOnMouseDown');
        component.slSelectorOnMouseDown(MOUSE_STUB);
        expect(SELECTOR_SPY).toHaveBeenCalled();
    });
    it('should call the last color selector', () => {
        const MOUSE_STUB = new MouseEvent('mousedown');
        const LAST_COLOR = 'ffffffff';
        const LAST_COLOR_SPY = spyOn(component.colorPicking, 'lastColorSelector');
        component.lastColorSelector(MOUSE_STUB, LAST_COLOR);
        expect(LAST_COLOR_SPY).toHaveBeenCalled();
    });
    it('should call swap on mouse over', () => {
        const SWAP_SPY = spyOn(component.colorPicking, 'onSwapSVGMouseOver');
        component.onSwapSVGMouseOver();
        expect(SWAP_SPY).toHaveBeenCalled();
    });
    it('should call swap on mouse leave', () => {
        const SWAP_SPY = spyOn(component.colorPicking, 'onSwapSVGMouseLeave');
        component.onSwapSVGMouseLeave();
        expect(SWAP_SPY).toHaveBeenCalled();
    });
    it('should call swap on mouse down', () => {
        const SWAP_SPY = spyOn(component.colorPicking, 'onSwapSVGMouseDown');
        component.onSwapSVGMouseDown();
        expect(SWAP_SPY).toHaveBeenCalled();
    });
    it('should call swap on mouse up', () => {
        const SWAP_SPY = spyOn(component.colorPicking, 'onSwapSVGMouseUp');
        component.onSwapSVGMouseUp();
        expect(SWAP_SPY).toHaveBeenCalled();
    });
    it('should call on radio button change', () => {
        const RADIO_SPY = spyOn(component.colorPicking, 'onRadioButtonChange');
        const COLOR_MODE = 'Primary';
        component.onRadioButtonChange(COLOR_MODE);
        expect(RADIO_SPY).toHaveBeenCalled();
    });
    it('should swap input display', () => {
        const SWAP_SPY = spyOn(component.colorPicking, 'swapInputDisplay');
        component.swapInputDisplay();
        expect(SWAP_SPY).toHaveBeenCalled();
    });
    it('should call validate hex input', () => {
        const VALIDATOR_SPY = spyOn(component.colorPicking, 'validateHexInput');
        const KEYBOARD_STUB = new KeyboardEvent('keyUp');
        const HEX_LENGTH = 10;
        const HEX = '0000';
        component.validateHexInput(KEYBOARD_STUB, HEX_LENGTH, HEX);
        expect(VALIDATOR_SPY).toHaveBeenCalled();
    });
    it('should call onHexInput', () => {
        const INIT_SPY = spyOn(component.colorPicking, 'onHexInput');
        const NUM = 10;
        component.onHexInput(NUM, '00000000', 'background');
        expect(INIT_SPY).toHaveBeenCalled();
    });
    it('should call on sl slider input', () => {
        const SLIDER_SPY = spyOn(component.colorPicking, 'onSLSliderInput');
        component.onSLSliderInput();
        expect(SLIDER_SPY).toHaveBeenCalled();
    });
    it('should call slider alpha change', () => {
        const SLIDER_SPY = spyOn(component.colorPicking, 'sliderAlphaChange');
        component.sliderAlphaChange();
        expect(SLIDER_SPY).toHaveBeenCalled();
    });
    it('should swap primary secondary', () => {
        const SWAP_SPY = spyOn(component.colorPicking, 'swapPrimarySecondary');
        component.swapPrimarySecondary();
        expect(SWAP_SPY).toHaveBeenCalled();
    });
});
