import { TestBed } from '@angular/core/testing';
import { ColorConvertingService } from '../colorPicker/color-converting.service';
import { ColorPickingService } from '../colorPicker/color-picking.service';
import { KeyboardHandlerService } from '../keyboard-handler/keyboard-handler.service';
import { InteractionService } from '../service-interaction/interaction.service';
import { PencilService } from './pencil.service';
import { Point } from './point';
// tslint:disable: max-classes-per-file
export class FakeInteractionService extends InteractionService {}
export class FakeColorPickingService extends ColorPickingService {}
export class FakeColorConvertingService extends ColorConvertingService {}
export class MouseHandlerMock {}
// tslint:enable: max-classes-per-file
describe('PencilService', () => {
  let service: PencilService;
  let ptA: Point;
  let ptB: Point;
  let ptArr: Point[];
  // tslint:disable-next-line: no-any
  let kbServiceStub: any;
  beforeEach(() => {
    kbServiceStub = {};
    TestBed.configureTestingModule({
    providers: [
      {provide: HTMLElement, useValue: {}},
      {provide: Boolean, useValue: false},
      {provide: Number, useValue: 0},
      {provide: String, useValue: ''},
      {provide: KeyboardHandlerService, useValue: kbServiceStub}]

  });
    ptA = new Point(0, 0); // using a point to test position functions
    ptB = new Point(1, 2);
    ptArr = [ptA, ptB];
    service = TestBed.get(PencilService);

});

  it('should be created', () => {
    const testService: PencilService = TestBed.get(PencilService);
    expect(testService).toBeTruthy();
  });

  it('should set the attributes in the subscription', () => {
    service.interaction.emitToolsAttributes({lineThickness: 0, texture: 0}); // arbitrary, used to check if the emssion worked
    const spyInteraction = spyOn(service.interaction.$toolsAttributes, 'subscribe');
    service.updateAttributes();
    expect(spyInteraction).toHaveBeenCalled();
    expect(service.attr).toBeDefined();

  });
/*
  it('should update progress on mouse down', () => {
    const spy = spyOn(service, 'updateProgress');
    service.down(ptA); // simulating a mouse down at given point
    service.update(kbServiceStub);

    expect(spy).toHaveBeenCalled();
  });*/

  it('should update the current path on mouse down', () => {
    const spy = spyOn(service,  'updateProgress');
    service.down(ptA);
    expect(service.currentPath.length).toBe(2); // same point added twice to manage static mouse
    expect(service.currentPath).toContain(ptA);

    expect(spy).toHaveBeenCalled();
  });

  it('should update the drawing on mouse up inside workspace', () => {
    service.down(ptA); // pressing the mouse
    const spy = spyOn(service, 'updateDrawing');
    service.up(ptA, true); // inside workspce
    expect(spy).toHaveBeenCalled();
  });

  it('should not update the drawing on mouse up outside workspace', () => {
    service.down(ptA); // pressing the mouse
    const spy = spyOn(service, 'updateDrawing');
    service.up(ptA, false); // inside workspce
    expect(spy).not.toHaveBeenCalled();
  });

  it('should not update the drawing of the tool change is on-the-fly', () => {
    service.ignoreNextUp = true; // tool change
    const spy = spyOn(service, 'updateDrawing');
    service.up(ptA, true);
    expect(spy).not.toHaveBeenCalled();
  });

  it('should add the new position in the current path array on mouse down', () => {
    service.down(ptA); // press the button, move the mouse
    service.move(ptA);
    expect(service.currentPath).toContain(ptA);
  });

  it('should update progress on mouse move', () => {
    const spy = spyOn(service, 'updateProgress');
    service.down(ptA);
    service.move(ptA);

    expect(spy).toHaveBeenCalled();
  });

  it('should not draw if the mouse isnt pressed', () => {
    const spy = spyOn(service, 'updateProgress');
    service.move(ptA);
    expect(spy).not.toHaveBeenCalled();
  });

  // from here, same goes for the brush as they are similar tools
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
    const back = '#ffffff';
    service.chosenColor = {primColor: prim, secColor: sec, backColor: back};

    const path = service.createPath(ptArr);

    expect(path).toContain(prim); // we want to see the primary color, but not the secondary!
    expect(path).not.toContain(sec);

  });

  it('should have the choosen thickness', () => {
    const thick = 25; // fake thickness used for this test's purpose
    service.attr.lineThickness = thick;
    const path = service.createPath(ptArr);
    expect(path).toContain(`stroke-width="${thick}"`); // svg attribute along with its value
  });

  it('should have a round linecap and linejoin', () => {
    const path = service.createPath(ptArr);

    expect(path).toContain('stroke-linecap="round"');
    expect(path).toContain('stroke-linejoin="round"');
  });

  it('should be named pencil-stroke', () => {
    const path = service.createPath(ptArr);
    const name = 'pencil-stroke';
    expect(path).toContain(name);
  });

});
