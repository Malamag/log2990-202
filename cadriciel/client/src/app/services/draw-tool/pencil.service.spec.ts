import { TestBed } from '@angular/core/testing';
import { ToolsAttributes } from '../attributes/tools-attribute';
import { ColorConvertingService } from '../colorPicker/color-converting.service';
import { ColorPickingService } from '../colorPicker/color-picking.service';
import { KeyboardHandlerService } from '../keyboard-handler/keyboard-handler.service';
import { InteractionService } from '../service-interaction/interaction.service';
import { PencilService } from './pencil.service';
import { Point } from './point';
// tslint:disable: max-classes-per-file
export class FakeInteractionService extends InteractionService { }
export class FakeColorPickingService extends ColorPickingService { }
export class FakeColorConvertingService extends ColorConvertingService { }
export class MouseHandlerMock { }

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
        { provide: HTMLElement, useValue: {} },
        { provide: Boolean, useValue: false },
        { provide: Number, useValue: 0 },
        { provide: String, useValue: '' },
        { provide: KeyboardHandlerService, useValue: kbServiceStub }]

    });
    ptA = new Point(0, 0); // using a point to test position functions
    ptB = new Point(1, 2);
    ptArr = [ptA, ptB];
    service = TestBed.get(PencilService);

  });

  it('should be created', () => {
    const TEST_SERVICE: PencilService = TestBed.get(PencilService);
    expect(TEST_SERVICE).toBeTruthy();
  });

  it('should set the attributes in the subscription', () => {
    service.interaction.emitToolsAttributes({ lineThickness: 0, texture: 0 }); // arbitrary, used to check if the emssion worked
    const SPY_INTERACTION = spyOn(service.interaction.$toolsAttributes, 'subscribe');
    service.updateAttributes();
    expect(SPY_INTERACTION).toHaveBeenCalled();
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
    const SPY = spyOn(service, 'updateProgress');
    service.down(ptA);
    expect(service.currentPath.length).toBe(2); // same point added twice to manage static mouse
    expect(service.currentPath).toContain(ptA);

    expect(SPY).toHaveBeenCalled();
  });

  it('should update the drawing on mouse up inside workspace', () => {
    service.down(ptA); // pressing the mouse
    const SPY = spyOn(service, 'updateDrawing');
    service.up(ptA, true); // inside workspce
    expect(SPY).toHaveBeenCalled();
  });

  it('should not update the drawing on mouse up outside workspace', () => {
    service.down(ptA); // pressing the mouse
    const SPY = spyOn(service, 'updateDrawing');
    service.up(ptA, false); // inside workspce
    expect(SPY).not.toHaveBeenCalled();
  });

  it('should not update the drawing of the tool change is on-the-fly', () => {
    service.ignoreNextUp = true; // tool change
    const SPY = spyOn(service, 'updateDrawing');
    service.up(ptA, true);
    expect(SPY).not.toHaveBeenCalled();
  });

  it('should add the new position in the current path array on mouse down', () => {
    service.down(ptA); // press the button, move the mouse
    service.move(ptA);
    expect(service.currentPath).toContain(ptA);
  });

  it('should update progress on mouse move', () => {
    const SPY = spyOn(service, 'updateProgress');
    service.down(ptA);
    service.move(ptA);

    expect(SPY).toHaveBeenCalled();
  });

  it('should not draw if the mouse isnt pressed', () => {
    const SPY = spyOn(service, 'updateProgress');
    service.move(ptA);
    expect(SPY).not.toHaveBeenCalled();
  });

  // from here, same goes for the brush as they are similar tools
  it('should create a valid path', () => {
    const PATH = service.createPath(ptArr);
    expect(PATH).toContain('<path');
  });

  it('the path must have the same starting point has the mouse', () => {
    const PATH = service.createPath(ptArr);
    expect(PATH).toContain(`M ${ptArr[0].x} ${ptArr[0].y} `);
  });

  it('the path must be pursued by the next point', () => {
    const PATH = service.createPath(ptArr);
    expect(PATH).toContain(`L ${ptArr[1].x} ${ptArr[1].y} `);  // second and last point of our fake array
  });

  it('should have the primary color as attribute', () => {
    const PRIM = '#ffffff';
    const SEC = '#000000';
    const BACK = '#ffffff';
    service.chosenColor = { primColor: PRIM, secColor: SEC, backColor: BACK };

    const PATH = service.createPath(ptArr);

    expect(PATH).toContain(PRIM); // we want to see the primary color, but not the secondary!
    expect(PATH).not.toContain(SEC);

  });

  it('should have the choosen thickness', () => {
    const THICK = 25; // fake thickness used for this test's purpose
    service.attr.lineThickness = THICK;
    const PATH = service.createPath(ptArr);
    expect(PATH).toContain(`stroke-width="${THICK}"`); // svg attribute along with its value
  });

  it('should have a round linecap and linejoin', () => {
    const PATH = service.createPath(ptArr);

    expect(PATH).toContain('stroke-linecap="round"');
    expect(PATH).toContain('stroke-linejoin="round"');
  });

  it('should be named pencil-stroke', () => {
    const PATH = service.createPath(ptArr);
    const NAME = 'pencil-stroke';
    expect(PATH).toContain(NAME);
  });

  it('should return an empty html string if there is not enough points to compute', () => {
    const TEST_ARR = [ptA];
    const HTML_STR = service.createPath(TEST_ARR);
    expect(HTML_STR).toEqual('');
  });

  it('should not set the attributes if they are undefined in the sub', () => {
    const TEST_ATTR: ToolsAttributes = { lineThickness: 50, texture: 0 };
    service.attr = TEST_ATTR;
    service.updateAttributes();
    service.interaction.emitToolsAttributes(undefined);
    expect(service.attr).toEqual(TEST_ATTR); // no change
  });

});
