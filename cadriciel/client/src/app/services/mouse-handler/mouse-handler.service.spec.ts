import { TestBed } from '@angular/core/testing';
import { InputObserver } from '../draw-tool/input-observer';
import { Point } from '../draw-tool/point';
import { MouseHandlerService } from './mouse-handler.service';

describe('MouseHandlerService', () => {
    // tslint:disable-next-line: no-any
    let iObserverStub: any;
    // tslint:disable-next-line: no-any
    let htmlElemStub: any;
    // tslint:disable-next-line: no-any
    let clientRectStub: any;
    // tslint:disable-next-line: no-any
    let mouseEventStub: any;
    let service: MouseHandlerService;

    let pt: Point;
    beforeEach(() => {
        iObserverStub = {
            shortcut: 0,
            selected: true,

            update: () => 0,
            cancel: () => 0,
            move: (ptM: Point) => 0,
            down: (ptD: Point) => 0,
            goingOutsideCanvas: (ptO: Point) => 0,
            goingInsideCanvas: (ptI: Point) => 0,
            up: (ptU: Point) => 0,
            doubleClick: () => 0,
            wheelMove: (av: boolean, prec: boolean, clockWise: boolean) => 0,
        };

        clientRectStub = {
            left: 0,
            right: 0,
            bottom: 0,
            top: 0,
        };

        mouseEventStub = {
            x: 0,
            y: 0,
        };

        htmlElemStub = { getBoundingClientRect: () => new DOMRect() };

        TestBed.configureTestingModule({
            providers: [
                MouseHandlerService,
                { provide: HTMLElement, useValue: htmlElemStub },
                { provide: InputObserver, useValue: iObserverStub },
            ],
        });
        service = TestBed.get(MouseHandlerService);
        pt = new Point(2, 2); // arbitrary coords
    });

    it('should be created', () => {
        const TEST_SERVICE: MouseHandlerService = TestBed.get(MouseHandlerService);
        expect(TEST_SERVICE).toBeTruthy();
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
        // tslint:disable-next-line: no-magic-numbers
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
        const SPY = spyOn(service.observers, 'push');
        service.addObserver(IP_OBS);
        expect(SPY).toHaveBeenCalledWith(IP_OBS);
    });

    it('should update the mouse position according to the canvas', () => {
        const X = 5; // test points
        const Y = 5;
        const SPY = spyOn(service, 'windowToCanvas');
        service.updatePosition(X, Y);
        expect(service.mouseWindowPosition).toEqual(new Point(X, Y));
        expect(SPY).toHaveBeenCalledWith(service.mouseWindowPosition);
    });

    it('should update the position when mouse is down', () => {
        const SPY = spyOn(service, 'updatePosition');
        service.down(mouseEventStub);

        expect(SPY).toHaveBeenCalledWith(mouseEventStub.x, mouseEventStub.y);
    });

    it('should call an observer (down) if the event started in the workspace', () => {
        const STUB_VALUE = true;
        service.validPoint = () => STUB_VALUE; // fake function always returning true
        const SPY = spyOn(service, 'callObserverDown');
        service.down(mouseEventStub);
        expect(SPY).toHaveBeenCalled();
    });

    it('should not call an observer if the click was out', () => {
        service.validPoint = jasmine.createSpy().and.returnValue(false);
        const SPY = spyOn(service, 'callObserverDown');
        service.down(mouseEventStub);
        expect(SPY).not.toHaveBeenCalled();
    });

    it('should update the position when mouse is up', () => {
        const SPY = spyOn(service, 'updatePosition');
        service.up(mouseEventStub);

        expect(SPY).toHaveBeenCalledWith(mouseEventStub.x, mouseEventStub.y);
    });

    it('should call an observer (up) if the event started in the workspace', () => {
        const STUB_VALUE = true;
        service.startedInsideWorkspace = STUB_VALUE;
        const SPY = spyOn(service, 'callObserverUp');
        service.validPoint = () => STUB_VALUE;
        service.up(mouseEventStub);
        expect(SPY).toHaveBeenCalled();
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
        const SPY = spyOn(service, 'callObserverDoubleClick');

        service.up(mouseEventStub);
        const TIME = 200; // the function's timeout
        jasmine.clock().tick(TIME + 1); // waiting a bit longer

        expect(SPY).toHaveBeenCalled();
        jasmine.clock().uninstall(); // remove the clock
    });

    it('should call an observer if the mouse is outside the canvas', () => {
        service.validPoint = jasmine.createSpy().and.returnValue(false);
        service.insideWorkspace = true;
        const SPY = spyOn(service, 'callObserverOutsideCanvas');
        service.move(mouseEventStub);
        expect(SPY).toHaveBeenCalled();
    });

    it('should call the move observer if mouse moved in workspace', () => {
        const SPY = spyOn(service, 'callObserverMove');

        service.validPoint = jasmine.createSpy().and.returnValue(true); // fake function
        service.insideWorkspace = true;

        service.move(mouseEventStub);
        expect(SPY).toHaveBeenCalled();
    });

    it('should call the observer if the mouse is outside canvas', () => {
        const SPY = spyOn(service, 'callObserverInsideCanvas');

        const STUB_VALUE = true;
        service.validPoint = () => STUB_VALUE;
        service.insideWorkspace = false;

        service.move(mouseEventStub);
        expect(SPY).toHaveBeenCalled();
    });

    it('should call move on every observer', () => {
        service.observers = [iObserverStub, iObserverStub, iObserverStub];
        const SPY = spyOn(iObserverStub, 'move');
        service.callObserverMove();
        expect(SPY).toHaveBeenCalledTimes(service.observers.length);
    });
    /*
  it('should call down on every observer', () => {
    service.observers = [iObserverStub, iObserverStub, iObserverStub];
    const spy = spyOn(iObserverStub, 'down');
    service.callObserverDown();
    expect(spy).toHaveBeenCalledTimes(service.observers.length);
  });*/

    it('should call outside canvas on every observer', () => {
        service.observers = [iObserverStub, iObserverStub, iObserverStub];
        const SPY = spyOn(iObserverStub, 'goingOutsideCanvas');
        service.callObserverOutsideCanvas();
        expect(SPY).toHaveBeenCalledTimes(service.observers.length);
    });

    it('should call inside canvas on every observer', () => {
        service.observers = [iObserverStub, iObserverStub, iObserverStub];
        const SPY = spyOn(iObserverStub, 'goingInsideCanvas');
        service.callObserverInsideCanvas();
        expect(SPY).toHaveBeenCalledTimes(service.observers.length);
    });

    it('should call up on every observer', () => {
        service.observers = [iObserverStub, iObserverStub, iObserverStub];
        const SPY = spyOn(iObserverStub, 'up');
        service.callObserverUp();
        expect(SPY).toHaveBeenCalledTimes(service.observers.length);
    });

    it('should call double click on every observer', () => {
        service.observers = [iObserverStub, iObserverStub, iObserverStub];
        const SPY = spyOn(iObserverStub, 'doubleClick');
        service.callObserverDoubleClick();
        expect(SPY).toHaveBeenCalledTimes(service.observers.length);
    });

    it('should call down click on every observer', () => {
        service.observers = [iObserverStub, iObserverStub, iObserverStub];
        const SPY = spyOn(iObserverStub, 'down');
        service.callObserverDown(false);
        expect(SPY).toHaveBeenCalledTimes(service.observers.length);
    });
    /************ */
    it('should not call outside canvas on unselected observer', () => {
        iObserverStub.selected = false;
        service.observers = [iObserverStub, iObserverStub, iObserverStub];
        const SPY = spyOn(iObserverStub, 'goingOutsideCanvas');
        service.callObserverOutsideCanvas();
        expect(SPY).not.toHaveBeenCalled();
    });

    it('should not call inside canvas on unselected observer', () => {
        iObserverStub.selected = false;
        service.observers = [iObserverStub, iObserverStub, iObserverStub];
        const SPY = spyOn(iObserverStub, 'goingInsideCanvas');
        service.callObserverInsideCanvas();
        expect(SPY).not.toHaveBeenCalled();
    });

    it('should not call up on unselected observer', () => {
        iObserverStub.selected = false;
        service.observers = [iObserverStub, iObserverStub, iObserverStub];
        const SPY = spyOn(iObserverStub, 'up');
        service.callObserverUp();
        expect(SPY).not.toHaveBeenCalled();
    });

    it('should not call double click unselected observer', () => {
        iObserverStub.selected = false;
        service.observers = [iObserverStub, iObserverStub, iObserverStub];
        const SPY = spyOn(iObserverStub, 'doubleClick');
        service.callObserverDoubleClick();
        expect(SPY).not.toHaveBeenCalled();
    });

    it('should not call down click on unselected observer', () => {
        iObserverStub.selected = false;
        service.observers = [iObserverStub, iObserverStub, iObserverStub];
        const SPY = spyOn(iObserverStub, 'doubleClick');
        service.down(mouseEventStub);
        expect(SPY).not.toHaveBeenCalled();
    });
    it('should update the wheel observers', () => {
        const WHEEL_EVENT = new WheelEvent('whell');
        const SPY = spyOn(service, 'callObserverWheel');
        service.wheel(WHEEL_EVENT);
        expect(SPY).toHaveBeenCalledWith(!WHEEL_EVENT.shiftKey, WHEEL_EVENT.altKey, WHEEL_EVENT.deltaY >= 0);
    });
    it('should call the wheel move of every observer', () => {
        iObserverStub.selected = true;
        const AV = true;
        const PR = false;
        const CW = true;
        const NB_CALLS = 3;
        service.observers = [iObserverStub, iObserverStub, iObserverStub];
        const SPY = spyOn(iObserverStub, 'wheelMove');
        service.callObserverWheel(AV, PR, CW);
        expect(SPY).toHaveBeenCalledTimes(NB_CALLS);
    });
    it('should not update the observers with wheel move', () => {
        iObserverStub.selected = false;
        const AV = true;
        const PR = false;
        const CW = true;
        service.observers = [iObserverStub, iObserverStub, iObserverStub];
        const SPY = spyOn(iObserverStub, 'wheelMove');
        service.callObserverWheel(AV, PR, CW);
        expect(SPY).not.toHaveBeenCalled();
    });
});
