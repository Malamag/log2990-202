import { TestBed } from '@angular/core/testing';

import { ElementRef } from '@angular/core';
import { SvgDrawComponent } from 'src/app/components/draw-view/svg-draw/svg-draw.component';
import { Canvas } from '../../models/Canvas.model';
import { colorCircles } from '../../palette';
import { CanvasBuilderService } from './canvas-builder.service';

describe('CanvasBuilderService', () => {
  let service: CanvasBuilderService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SvgDrawComponent]
    }).compileComponents();
    service = TestBed.get(CanvasBuilderService);
  });

  it('should be created', () => {
    const service: CanvasBuilderService = TestBed.get(CanvasBuilderService);
    expect(service).toBeTruthy();
  });

  it('should create a canvas from form data', () => {
    const CANVAS: Canvas = {canvasWidth: 50, canvasHeight: 50, canvasColor: '#ffffff'}; // validators in NewDrawComponent filtering bad inputs
    service.setCanvasFromForm(50, 50, 'ffffff');
    expect(service.newCanvas).toEqual(CANVAS);
  });

  it('should get default sizes near from full screen size', () => {
    const DEFW = service.getDefWidth();
    const DEFH = service.getDefHeight();
    expect(DEFW).toBeCloseTo(window.innerWidth, -300); // approximation
    expect(DEFH).toBeCloseTo(window.innerHeight, -300); // top bar and side nav space
  });

  it('should whipe an existing doodle', () => {
    const elem: ElementRef = new ElementRef(SvgDrawComponent);
    const draw: String = '<rect />';
    elem.nativeElement.innerHTML = draw;

    service.whipeDraw(elem);
    expect(elem.nativeElement.innerHTML).not.toContain(draw);

  });

  it('should get a valid default color', () => {
    const col = service.getDefColor();
    expect(col).toMatch(/^[a-fA-F0-9]{6}$/);
  });

  it('should get a white default color', () => {
    const WHITE = 'ffffff';
    expect(service.getDefColor()).toEqual(WHITE);
  });

  it('should get a valid offset array for color palette in form', () => {
    const len = colorCircles.length;
    const arr = service.getPalleteAttributes();
    expect(arr.length).toEqual(len);
  });

  it('should emit the new canvas', () => {

    const spy = spyOn(service.canvSubject, 'next');
    service.emitCanvas();
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith(service.newCanvas);
  });

});
