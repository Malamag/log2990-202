import { TestBed } from '@angular/core/testing';
import { Point } from '../../point';
import { InputObserver } from '../draw-tool/input-observer';
import { MouseHandlerService } from './mouse-handler.service';

describe('MouseHandlerService', () => {
  let iObserverStub: any;
  let htmlElemStub: any;
  let clientRectStub: any;
  let mouseEventStub: any;
  let service: MouseHandlerService;

  let pt: Point;
  beforeEach(() => {
    iObserverStub = {
      shortcut: 0,
      selected: true,

      update: () => 0,
      cancel: () => 0,
      move: (pt: Point) => 0,
      down: (pt: Point) => 0,
      goingOutsideCanvas: (pt: Point) => 0,
      goingInsideCanvas: (pt: Point) => 0,
      up: (pt: Point) => 0,
      doubleClick: () => 0
    }

    clientRectStub = {
      left: 0,
      right: 0,
      bottom: 0,
      top: 0
    }

    mouseEventStub = {
      x: 0,
      y: 0
    }

    htmlElemStub = {getBoundingClientRect: () => new DOMRect()}

    TestBed.configureTestingModule({
      providers: [
        MouseHandlerService,
        {provide: HTMLElement, useValue: htmlElemStub},
        {provide: InputObserver, useValue: iObserverStub}]
    });
    service = TestBed.get(MouseHandlerService);
    pt = new Point(2, 2); // arbitrary coords
  });

  it('should be created', () => {
    const service: MouseHandlerService = TestBed.get(MouseHandlerService);
    expect(service).toBeTruthy();
  });

 /* it('should be responsive to a window resize', ()=>{
    service.svgCanvas = htmlElemStub;
    const spy = spyOn(service.svgCanvas, "getBoundingClientRect")
    service.updateWindowSize();
    expect(spy).toHaveBeenCalled();
  });*/

  it('should return a new point according to the new canvas size', () => {
    const PT = service.windowToCanvas(pt);
    expect(PT).toBeDefined();
  });

  it('should return true if clicked point is valid (in the svg area)', () => {
    service.svgBox = clientRectStub;
    const LEFT = 5;
    const TOP = 5;
    const RIGHT = 10; // still 10 units to the right
    const BOT = 10;

    service.svgBox.left = LEFT;
    service.svgBox.top = TOP;
    service.svgBox.right = RIGHT;
    service.svgBox.bottom = BOT;

    const OK = service.validPoint(pt); // our default point must be valid
    expect(OK).toBeTruthy();

  });

  it('should return false if a clicked point is invalid', () => {
    service.svgBox = clientRectStub;
    const PT = new Point(-1, 0); // out of bounds!
    const LEFT = 5;
    const TOP = 5;
    const RIGHT = 10; // still 10 units to the right
    const BOT = 10;

    service.svgBox.left = LEFT;
    service.svgBox.top = TOP;
    service.svgBox.right = RIGHT;
    service.svgBox.bottom = BOT;

    const OK = service.validPoint(PT); // our default point must be valid
    expect(OK).toBeFalsy();
  });

  it('should be able to add an input observer', () => {
    const IP_OBS = iObserverStub; // our stub input observer
    const spy = spyOn(service.observers, 'push');
    service.addObserver(IP_OBS);
    expect(spy).toHaveBeenCalledWith(IP_OBS);
  });

  it('should update the mouse position according to the canvas', () => {
    const X = 5; // test points
    const Y = 5;
    const spy = spyOn(service, 'windowToCanvas');
    service.updatePosition(X, Y);
    expect(service.mouseWindowPosition).toEqual(new Point(X, Y));
    expect(spy).toHaveBeenCalledWith(service.mouseWindowPosition);
  });

  it('should update the position when mouse is down', () => {
    const spy = spyOn(service, 'updatePosition');
    service.down(mouseEventStub);

    expect(spy).toHaveBeenCalledWith(mouseEventStub.x, mouseEventStub.y);
  });

  it('should call an observer (down) if the event started in the workspace', () => {
    const stubValue = true;
    service.validPoint = () => stubValue; // fake function always returning true
    const spy = spyOn(service, 'callObserverDown');
    service.down(mouseEventStub);
    expect(spy).toHaveBeenCalled();
  });

  it('should not call an observer if the click was out', () => {
    service.startedInsideWorkspace = false;
    const spy = spyOn(service, 'callObserverDown');
    service.down(mouseEventStub);
    expect(spy).not.toHaveBeenCalled();
  });

  it('should update the position when mouse is up', () => {

    const spy = spyOn(service, 'updatePosition');
    service.up(mouseEventStub);

    expect(spy).toHaveBeenCalledWith(mouseEventStub.x, mouseEventStub.y);
  });

  it('should call an observer (up) if the event started in the workspace', () => {
    const stubValue = true;
    service.startedInsideWorkspace = stubValue;
    const spy = spyOn(service, 'callObserverUp');
    service.validPoint = () => stubValue;
    service.up(mouseEventStub);
    expect(spy).toHaveBeenCalled();
  });

  it('should put the first click to false after first click', () => {
    service.isFirstClick = true;
    service.up(mouseEventStub);
    expect(service.isFirstClick).toBeFalsy();
  });

  it('should call the double click observer after a double click', () => {
    jasmine.clock().install(); // setting a clock
    service.isFirstClick = true;
    service.numberOfClicks = 2; // double click
    const spy = spyOn(service, 'callObserverDoubleClick');

    service.up(mouseEventStub);
    const TIME = 200; // the function's timeout
    jasmine.clock().tick(TIME + 1); // waiting a bit longer

    expect(spy).toHaveBeenCalled();
    jasmine.clock().uninstall(); // remove the clock
  });

  it('should call an observer if the mouse is outside the canvas', () => {
    service.insideWorkspace = true;
    const spy = spyOn(service, 'callObserverOutsideCanvas');
    service.move(mouseEventStub);
    expect(spy).toHaveBeenCalled();
  });

  it('should call the move observer if mouse moved in workspace', () => {
    const spy = spyOn(service, 'callObserverMove');
    const stubValue = true;
    service.validPoint = () => stubValue; // fake function
    service.insideWorkspace = true;

    service.move(mouseEventStub);
    expect(spy).toHaveBeenCalled();
  });

  it('should call the observer if the mouse is outside canvas', () => {
    const spy = spyOn(service, 'callObserverInsideCanvas');

    const stubValue = true;
    service.validPoint = () => stubValue;
    service.insideWorkspace = false;

    service.move(mouseEventStub);
    expect(spy).toHaveBeenCalled();
  });

  it('should call move on every observer', () => {
    service.observers = [iObserverStub, iObserverStub, iObserverStub];
    const spy = spyOn(iObserverStub, 'move');
    service.callObserverMove();
    expect(spy).toHaveBeenCalledTimes(service.observers.length);
  });

  it('should call down on every observer', () => {
    service.observers = [iObserverStub, iObserverStub, iObserverStub];
    const spy = spyOn(iObserverStub, 'down');
    service.callObserverDown();
    expect(spy).toHaveBeenCalledTimes(service.observers.length);
  });

  it('should call outside canvas on every observer', () => {
    service.observers = [iObserverStub, iObserverStub, iObserverStub];
    const spy = spyOn(iObserverStub, 'goingOutsideCanvas');
    service.callObserverOutsideCanvas();
    expect(spy).toHaveBeenCalledTimes(service.observers.length);
  });

  it('should call inside canvas on every observer', () => {
    service.observers = [iObserverStub, iObserverStub, iObserverStub];
    const spy = spyOn(iObserverStub, 'goingInsideCanvas');
    service.callObserverInsideCanvas();
    expect(spy).toHaveBeenCalledTimes(service.observers.length);
  });

  it('should call up on every observer', () => {
    service.observers = [iObserverStub, iObserverStub, iObserverStub];
    const spy = spyOn(iObserverStub, 'up');
    service.callObserverUp();
    expect(spy).toHaveBeenCalledTimes(service.observers.length);
  });

  it('should call double click on every observer', () => {
    service.observers = [iObserverStub, iObserverStub, iObserverStub];
    const spy = spyOn(iObserverStub, 'doubleClick');
    service.callObserverDoubleClick();
    expect(spy).toHaveBeenCalledTimes(service.observers.length);
  });

});
