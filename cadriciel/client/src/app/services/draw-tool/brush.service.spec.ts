import { TestBed } from '@angular/core/testing';

import { BrushService } from './brush.service';

import { ChoosenColors } from 'src/app/models/ChoosenColors.model';
import { ToolsAttributes } from '../attributes/tools-attribute';
import { KeyboardHandlerService } from '../keyboard-handler/keyboard-handler.service';
import { InteractionService } from '../service-interaction/interaction.service';
import { Point } from './point';

export class fakeInteractionService extends InteractionService { }

describe('BrushService', () => {
  let service: BrushService
  let ptA: Point;
  let ptB: Point;
  let ptArr: Point[];
  let kbServiceStub: any;

  beforeEach(() => {
    kbServiceStub = {}
    TestBed.configureTestingModule({
      providers:
      [{provide: HTMLElement, useValue: {}},
        {provide: Boolean, useValue: false},
        {provide: Number, useValue: 0},
        {provide: String, useValue: ''},
        {provide: KeyboardHandlerService, kbServiceStub}]

    });
    ptA = new Point(0, 0);
    ptB = new Point(1, 2);
    ptArr = [ptA, ptB];
    service = TestBed.get(BrushService);

  });

  it('should be created', () => {
    const service: BrushService = TestBed.get(BrushService);
    expect(service).toBeTruthy();
  });

  it('should set the attributes in the subscription', () => {
    service.interaction.emitToolsAttributes(new ToolsAttributes(0, 0)); // emit fake
    const spyInteraction = spyOn(service.interaction.$toolsAttributes, 'subscribe');
    service.updateAttributes();
    expect(spyInteraction).toHaveBeenCalled();
    expect(service.attr).toBeDefined();

  });

  it('should create a valid path', () => {
    const path = service.createPath(ptArr);
    expect(path).toContain('<path');
  });

  it('the path must have the same starting point has the mouse', () => {
    const path = service.createPath(ptArr);
    expect(path).toContain(`M ${ptArr[0].x} ${ptArr[0].y} `);
  });

  it('the path must be pursued by the next point', () => {
    const path = service.createPath(ptArr);
    expect(path).toContain(`L ${ptArr[1].x} ${ptArr[1].y} `);  // second and last point of our fake array
  });

  it('should have the primary color as attribute', () => {
    const prim = '#ffffff';
    const sec = '#000000';

    service.chosenColor = new ChoosenColors(prim, sec);

    const path = service.createPath(ptArr);

    expect(path).toContain(prim); // we want to see the primary color, but not the secondary!
    expect(path).not.toContain(sec);

  });

  it('should have the choosen thickness', () => {
    const thick = 25; // fake thickness used for this test's purpose
    service.attr.lineThickness = thick
    const path = service.createPath(ptArr);
    expect(path).toContain(`stroke-width="${thick}"`); // svg attribute along with its value
  });

  it('should have a round linecap and linejoin', () => {
    const path = service.createPath(ptArr);

    expect(path).toContain('stroke-linecap="round"');
    expect(path).toContain('stroke-linejoin="round"');
  });

  it('should be named brush-stroke', () => {
    const path = service.createPath(ptArr);
    const name = 'brush-stroke';
    expect(path).toContain(name);
  });

  it('a filter of a unique id should be present on the brush stroke', () => {
    const path = service.createPath(ptArr);
    const filerId = new Date().getTime();
    expect(path).toContain(`filter="url(#${filerId})"`);
  });

  it('should build a gaussian blur filter based on a given scale', () => {
    const SCALE = 1;
    const ID = 0;
    const filter = service.createBluredFilter(SCALE, ID);

    expect(filter).toContain('<filter');
    expect(filter).toContain('feGaussianBlur'); // filter name (svg)

    expect(filter).toContain(`stdDeviation="${SCALE}"`); // check for attribute application

  });

  it('should build a noise filter with displacement', () => {
    const W = 1;
    const SCALE = 1;
    const FREQ = 1;
    const ID = 0;

    const filter = service.createNoiseFilter(W, SCALE, FREQ, ID);
    expect(filter).toContain('<filter');

    // turbulence filter attributes
    expect(filter).toContain(`<feTurbulence type="turbulence" baseFrequency="${FREQ}" numOctaves="2" result="turbulence"/>`)
    expect(filter).toContain(`scale="${W * SCALE}"`);

    // offset check, as set in brush.service.ts
    expect(filter).toContain(`<feOffset in="turbulence" dx="${((-W * SCALE) / 4)}" dy="${((-W * SCALE) / 4)}"/>`)

  });

  it('should apply a blured texture', () => {
    const TYPE = 'blured';
    service.textures[0].type = TYPE;
    const spy = spyOn(service, 'createBluredFilter');
    service.createPath(ptArr);
    expect(spy).toHaveBeenCalled();
  });

  it('should create a noise filter', () => {

    service.attr.texture = 1;

    const spy = spyOn(service, 'createNoiseFilter');
    service.createPath(ptArr);
    expect(spy).toHaveBeenCalled();
  });

});
