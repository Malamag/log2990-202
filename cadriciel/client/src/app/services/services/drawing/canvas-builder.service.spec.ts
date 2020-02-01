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

  it('should create a valid canvas from form data', () => {
    const CANVAS: Canvas = new Canvas(50, 50, '#ffffff');
    service.setCanvasFromForm(50, 50, 'ffffff');
    expect(service.newCanvas).toEqual(CANVAS);
  });

  it('should return positive integers as default sizes', () => {
    const W = service.getDefWidth();
    const H = service.getDefHeight();

    expect(W).toBeGreaterThan(0);
    expect(W.toString()).toMatch(/^\d+$/);

    expect(H).toBeGreaterThan(0);
    expect(H.toString()).toMatch(/^\d+$/);
  });

  it('should return a valid default color (white, ffffff)', () => {
    expect(service.getDefColor()).toEqual('ffffff');
  });

  it('should return a valid subscription without form data', () => {
    
  });

});
