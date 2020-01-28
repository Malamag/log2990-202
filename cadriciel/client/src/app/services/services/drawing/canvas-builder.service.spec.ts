import { TestBed } from '@angular/core/testing';

import { CanvasBuilderService } from './canvas-builder.service';
import { Canvas } from '../../../models/Canvas.model';

describe('CanvasBuilderService', () => {
  let service: CanvasBuilderService;
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = new CanvasBuilderService();
  });

  it('should be created', () => {
    const service: CanvasBuilderService = TestBed.get(CanvasBuilderService);
    expect(service).toBeTruthy();
  });

  it('should create a canvas from form data', () => {
    const CANVAS: Canvas = new Canvas(50, 50, '#ffffff');
    service.setCanvasFromForm(50, 50, 'ffffff');
    expect(service.newCanvas).toEqual(CANVAS);
  });

  /*it('should get default size if no inputs', () => {
    const DEFW = service.getDefWidth();
    const DEFH = service.getDefHeight();

  });*/


});
