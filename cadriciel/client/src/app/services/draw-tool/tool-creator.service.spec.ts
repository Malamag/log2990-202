import { TestBed } from '@angular/core/testing';
import { ColorConvertingService } from '../colorPicker/color-converting.service';
import { ColorPickingService } from '../colorPicker/color-picking.service';
import { InteractionService } from '../service-interaction/interaction.service';
import { BrushService } from './brush.service';
import { LineService } from './line.service';
import { PencilService } from './pencil.service';
import { RectangleService } from './rectangle.service';
import { ToolCreator } from './tool-creator';
// tslint:disable: max-classes-per-file
export class FakeCpService extends ColorPickingService { }
export class FakeItService extends InteractionService { }
// tslint:enable: max-classes-per-file
describe('ToolCreator', () => {
  // let elem: HTMLElement;

  // tslint:disable-next-line: no-any
  let colorConvertingStub: any;
  let service: ToolCreator;

  beforeEach(() => {
    const PEN_SPY = jasmine.createSpy('PencilService');
    const RECT_SPY = jasmine.createSpy('RectangleService');
    const LINE_SPY = jasmine.createSpy('LineService');
    const BRUSH_SPY = jasmine.createSpy('BrushService');

    colorConvertingStub = {
      hsvToHex: () => '',
      validateHSL: () => true,
      validateHex: () => true,
      rgbToHex: () => '',
      hslToRgb: () => [],
      hexToRgba: () => [],
      validateRGB: () => true,
      rgbToHsl: () => [],
      alphaRGBToHex: () => ''
    };

    TestBed.configureTestingModule({
      providers: [
        ToolCreator,
        { provide: HTMLElement, useValue: { getAttribute: () => 0 } },
        { provide: Element, useValue: { getAttribute: () => 0 } },
        { provide: PencilService, useValue: PEN_SPY },
        { provide: RectangleService, useValue: RECT_SPY },
        { provide: BrushService, useValue: BRUSH_SPY },
        { provide: LineService, useValue: LINE_SPY },
        { provide: InteractionService, useValue: FakeItService },
        { provide: ColorPickingService, useValue: FakeCpService },
        { provide: ColorConvertingService, useValue: colorConvertingStub }]
    });

    service = TestBed.get(ToolCreator);
  });

  it('should be created', () => {
    const TEST_SERVICE: ToolCreator = TestBed.get(ToolCreator);
    expect(TEST_SERVICE).toBeTruthy();
  });

  it('should create a new pencil service', () => {
    const PEN = service.CreatePencil(true, new FakeItService(), new FakeCpService(colorConvertingStub));
    expect(PEN).toEqual(jasmine.any(PencilService)); // checks if object is if the right instance
  });

  it('should create a new brush service', () => {
    const BRUSH = service.CreateBrush(true, new FakeItService(), new FakeCpService(colorConvertingStub));
    expect(BRUSH).toEqual(jasmine.any(BrushService));
  });

  it('should create a new rectangle service', () => {
    const RECT = service.CreateRectangle(true, new FakeItService(), new FakeCpService(colorConvertingStub));
    expect(RECT).toEqual(jasmine.any(RectangleService));
  });

  it('should create a new line service', () => {
    const LINE = service.CreateLine(true, new FakeItService(), new FakeCpService(colorConvertingStub));
    expect(LINE).toEqual(jasmine.any(LineService));
  });

});
