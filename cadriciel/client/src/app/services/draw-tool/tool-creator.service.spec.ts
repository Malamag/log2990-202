import { TestBed } from '@angular/core/testing';

import { colorData } from 'src/app/components/color-picker/color-data';
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

  let colorConvertingStub: ColorConvertingService;
  let service: ToolCreator;

  beforeEach(() => {
    const penSpy = jasmine.createSpy('PencilService');
    const rectSpy = jasmine.createSpy('RectangleService');
    const lineSpy = jasmine.createSpy('LineService');
    const brushSpy = jasmine.createSpy('BrushService');

    colorConvertingStub = {
      hsvToHex : () => '',
      validateHSL: () => true,
      validateHex: () => true,
      rgbToHex: () => '',
      hslToRgb: () => [],
      hexToRgba: () => [],
      validateRGB: () => true,
      rgbToHsl: () => [],
      cData: colorData,
      alphaRGBToHex: () => ''
    };

    TestBed.configureTestingModule({
      providers: [
        ToolCreator,
        { provide: HTMLElement, useValue: {} },
        { provide: PencilService, useValue: penSpy },
        { provide: RectangleService, useValue: rectSpy },
        { provide: BrushService, useValue: brushSpy },
        { provide: LineService, useValue: lineSpy },
        { provide: InteractionService, useValue: FakeItService },
        { provide: ColorPickingService, useValue: FakeCpService },
        { provide: ColorConvertingService, useValue: colorConvertingStub }]
    });

    service = TestBed.get(ToolCreator);
  });

  it('should be created', () => {
    const testService: ToolCreator = TestBed.get(ToolCreator);
    expect(testService).toBeTruthy();
  });

  it('should create a new pencil service', () => {
    const pen = service.CreatePencil(true, new FakeItService(), new FakeCpService(colorConvertingStub));
    expect(pen).toEqual(jasmine.any(PencilService)); // checks if object is if the right instance
  });

  it('should create a new brush service', () => {
    const brush = service.CreateBrush(true, new FakeItService(), new FakeCpService(colorConvertingStub));
    expect(brush).toEqual(jasmine.any(BrushService));
  });

  it('should create a new rectangle service', () => {
    const rect = service.CreateRectangle(true, new FakeItService(), new FakeCpService(colorConvertingStub));
    expect(rect).toEqual(jasmine.any(RectangleService));
  });

  it('should create a new line service', () => {
    const line = service.CreateLine(true, new FakeItService(), new FakeCpService(colorConvertingStub));
    expect(line).toEqual(jasmine.any(LineService));
  });

});
