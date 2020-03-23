import { TestBed } from '@angular/core/testing';

import { KeyboardHandlerService } from '../keyboard-handler/keyboard-handler.service';
import { AerosolService } from './aerosol.service';
import { Point } from './point';

describe('AerosolService', () => {
    let service: AerosolService;
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
                { provide: KeyboardHandlerService, kbServiceStub },
            ],
        }),
        ptA = new Point(0, 0);
        ptB = new Point(1, 2);
        ptArr = [ptA, ptB];
        service = TestBed.get(AerosolService);
    });

    it('should be created', () => {
        const AEROSOL_SERVICE: AerosolService = TestBed.get(AerosolService);
        expect(AEROSOL_SERVICE).toBeTruthy();
    });

    it('should set the attributes in the subscription', () => {
        service.interaction.emitAerosolAttributes({ emissionPerSecond: 20, diameter: 20 }); // emit fake
        const SPY_INTERACTION = spyOn(service.interaction.$aerosolAttributes, 'subscribe');
        service.updateAttributes();
        expect(SPY_INTERACTION).toHaveBeenCalled();
        // tslint:disable-next-line: no-string-literal
        expect(service['attr']).toBeDefined();
    });

    it('should create a valid path', () => {
        const PATH = service.createPath(ptArr);
        expect(PATH).toContain('<path');
    });

    it('the path must have the same starting point as the mouse', () => {
        const PATH = service.createPath(ptArr);
        expect(PATH).toContain(`M ${ptArr[0].x} ${ptArr[0].y} `);
    });

    it('the path must be pursued by the next point', () => {
        const PATH = service.createPath(ptArr);
        expect(PATH).toContain(`L ${ptArr[1].x} ${ptArr[1].y} `); // second and last point of our fake array
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

    it('should have the chosen emission per second', () => {
        const EMISSION = 100; // Fake emission used for this test's purpose
        const TIME = 0.1; // Time in seconds used for this test's purpose
        const MILLISECOND = 1000;
        const MS_WAIT = TIME * MILLISECOND;
        const EMISSION_EXPECTED = EMISSION * TIME;

        // Initialize jamsine clock for time ticking
        const CLOCK = jasmine.clock();
        CLOCK.install();

        // tslint:disable-next-line: no-string-literal
        service['attr'].emissionPerSecond = EMISSION;
        const POINTS = 5;
        service.down(new Point(POINTS, POINTS)); // Push the mouse down for simulating the aerosol
        const SPY_CREATE_PATH = spyOn(service, 'createPath');
        CLOCK.tick(MS_WAIT); // Wait

        // Expect createPath function to have been called the same number of time as the wanted emission
        expect(SPY_CREATE_PATH).toHaveBeenCalledTimes(EMISSION_EXPECTED);
        CLOCK.uninstall();
    });

    it('should only have points inside the diameter', () => {
        const EMISSION = 50; // Fake emission used for this test's purpose
        const DIAMETER = 10;
        const RADIUS = DIAMETER / 2;
        const TIME = 0.05; // Time in seconds used for this test's purpose
        const MILLISECOND = 1000;
        const MS_WAIT = TIME * MILLISECOND;
        const COORDINATE = 100;
        const POSITION = new Point(COORDINATE, COORDINATE);

        // Initialize jamsine clock for time ticking
        const CLOCK = jasmine.clock();
        CLOCK.install();
        // tslint:disable-next-line: no-string-literal
        service['attr'].emissionPerSecond = EMISSION;
        // tslint:disable-next-line: no-string-literal
        service['attr'].diameter = DIAMETER;
        service.down(POSITION); // Push the mouse down for simulating the aerosol
        CLOCK.tick(MS_WAIT); // Wait

        // Finish mock aerosol
        service.up(POSITION);

        // Look for each individual point if it's in the diameter area
        let pointsInsideDiameter = true;
        // tslint:disable-next-line: no-string-literal
        for (const POINT of service['points']) {
            if (
                POINT.x > COORDINATE + RADIUS ||
                POINT.y > COORDINATE + RADIUS ||
                POINT.x < COORDINATE - RADIUS ||
                POINT.y < COORDINATE - RADIUS
            ) {
                pointsInsideDiameter = false;
                break;
            }
        }
        expect(pointsInsideDiameter).toBeTruthy();
        CLOCK.uninstall();
    });

    it('should have a round linecap and linejoin', () => {
        // For lines to be mostly round (we want points)
        const PATH = service.createPath(ptArr);

        expect(PATH).toContain('stroke-linecap="round"');
        expect(PATH).toContain('stroke-linejoin="round"');
    });

    it('should be named aerosol', () => {
        const PATH = service.createPath(ptArr);
        const NAME = 'aerosol';
        expect(PATH).toContain(NAME);
    });

    it('should create a valid invisible path', () => {
        const PATH = service.createPath(ptArr);
        expect(PATH).toContain('invisiblePath');
    });

    it('should have nor stroke nor fill as attribute for the invisible path', () => {
        const STROKE = 'stroke="none"';
        const FILL = 'fill="none"';
        const PATH = service.createPath(ptArr);

        expect(PATH).toContain(STROKE);
        expect(PATH).toContain(FILL);
    });

    it('should stop if updating if it goes outside the canvas', () => {
        const OUTSIDE_COORD = 0;
        const OUTSIDE_POINT = new Point(OUTSIDE_COORD, OUTSIDE_COORD);
        const SPY = spyOn(service, 'up');   // Spy on up function to see if it stops the aerosol and unsubscribe
        service.down(ptA);  // start aerosol inside canvas and move outside
        service.goingOutsideCanvas(OUTSIDE_POINT);
        expect(SPY).toHaveBeenCalled();
    });

    it('should start a new path if it goes back inside the canvas after going outside while the mouse is clicked', () => {
        const EXPECTED_CALLED_TIMES = 3; // Once at start, once at the end of the path and once when it gets back inside canvas
        const OUTSIDE_COORD = 0;
        const POINT = new Point(OUTSIDE_COORD, OUTSIDE_COORD);
        const SPY = spyOn(service, 'createPath');   // Spy on up function to see if it stops the aerosol and unsubscribe
        service.down(ptA);  // start aerosol inside canvas and move outside
        const PATH_SIZE = service.currentPath.length;
        service.goingOutsideCanvas(POINT);
        service.goingInsideCanvas(POINT);
        expect(SPY).toHaveBeenCalledTimes(EXPECTED_CALLED_TIMES);
        expect(service.currentPath.length).toEqual(PATH_SIZE);
    });

    it('should not start a new path if it goes back inside the canvas after going outside with a mouse up', () => {
        const EXPECTED_CALLED_TIMES = 3; // Once at start, once at the end of the path and once when the mouse is clicked again
        const OUTSIDE_COORD = 0;    // random number for test
        const POINT = new Point(OUTSIDE_COORD, OUTSIDE_COORD);
        const SPY = spyOn(service, 'createPath');   // Spy on up function to see if it stops the aerosol and unsubscribe
        service.down(ptA);  // start aerosol inside canvas and move outside
        const PATH_SIZE = service.currentPath.length;
        service.goingOutsideCanvas(POINT);
        service.up(POINT);
        service.goingInsideCanvas(POINT);
        service.down(ptA);
        expect(SPY).toHaveBeenCalledTimes(EXPECTED_CALLED_TIMES);
        expect(service.currentPath.length).toEqual(PATH_SIZE);
    });

    it('should update path when the mouse is moved while being clicked inside the canvas', () => {
        service.down(ptA);  // start aerosol inside canvas and move outside
        let pathSize = service.currentPath.length;
        service.move(ptB);

        // It should have the points from the down button and from the move
        expect(++pathSize).toEqual(service.currentPath.length);
    });

    it('should not update path when the mouse is moved without being clicked inside the canvas', () => {
        service.down(ptA);  // start aerosol by mouse down
        const PATH_SIZE = service.currentPath.length;
        service.up(ptA);  // mouse up inside workspace
        service.move(ptB);  // Move while mouse up
        service.down(ptA);  // start aerosol again

        // it shouldn't have taken the path before the mouse down
        expect(PATH_SIZE).toEqual(service.currentPath.length);

    });

    it('should not update path when the mouse is moved without being clicked outside the canvas', () => {
        const OUTSIDE_COORD = 0;
        const POINT = new Point(OUTSIDE_COORD, OUTSIDE_COORD);
        service.down(ptA);  // start aerosol by mouse down
        service.goingOutsideCanvas(POINT);
        const PATH_SIZE = service.currentPath.length;

        service.move(new Point(OUTSIDE_COORD - 1, OUTSIDE_COORD - 1));

        // There shouldn't be more points since we moved OUTSIDE the canvas
        expect(PATH_SIZE).toEqual(service.currentPath.length);
    });

    it('should not make the mouse clicked when going outside the canvas', () => {
        const OUTSIDE_COORD = 0;
        const POINT = new Point(OUTSIDE_COORD, OUTSIDE_COORD);
        service.goingOutsideCanvas(POINT);

        // the mouse should be still up at this point
        expect(service.isDown).toBeFalsy();
    });

    it('should clear the svg path when cancelled', () => {
        const SPY = spyOn(service, 'updateDrawing');
        service.down(ptA);
        service.createPath(ptArr);
        service.cancel();
        service.up(ptA);

        expect(service.currentPath).toEqual([]);
        expect(SPY).not.toHaveBeenCalled();
    });

    it('should unsubscribe on tool change while the mouse is down', () => {
        service.down(ptA);
        // tslint:disable-next-line: no-string-literal
        const SPY = spyOn(service['sub'], 'unsubscribe');
        const EVENT = new Event('toolChange');
        window.dispatchEvent(EVENT);

        expect(SPY).toHaveBeenCalled();
    });
/*
    it('should subscribe to the interval when mouse is down and unsubscibe when up', () => {
        const SPY_SUB = spyOn(service, 'subscribe');
        service.down(ptA);
        // tslint:disable-next-line: no-string-literal
        const SPY_UNSUB = spyOn(service['sub'], 'unsubscribe');
        service.up(ptA);

        expect(SPY_SUB).toHaveBeenCalled();
        expect(SPY_UNSUB).toHaveBeenCalled();
    });
*/
});
