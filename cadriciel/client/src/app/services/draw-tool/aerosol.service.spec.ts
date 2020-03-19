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
            (ptA = new Point(0, 0));
        ptB = new Point(1, 2);
        ptArr = [ptA, ptB];
        service = TestBed.get(AerosolService);
    });

    it('should be created', () => {
        const aerosolService: AerosolService = TestBed.get(AerosolService);
        expect(aerosolService).toBeTruthy();
    });

    it('should set the attributes in the subscription', () => {
        service.interaction.emitAerosolAttributes({ emissionPerSecond: 20, diameter: 20 }); // emit fake
        const spyInteraction = spyOn(service.interaction.$aerosolAttributes, 'subscribe');
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
        expect(path).toContain(`L ${ptArr[1].x} ${ptArr[1].y} `); // second and last point of our fake array
    });

    it('should have the primary color as attribute', () => {
        const prim = '#ffffff';
        const sec = '#000000';
        const back = '#ffffff';
        service.chosenColor = { primColor: prim, secColor: sec, backColor: back };

        const path = service.createPath(ptArr);

        expect(path).toContain(prim); // we want to see the primary color, but not the secondary!
        expect(path).not.toContain(sec);
    });

    it('should have the chosen emission per second', () => {
        const emission = 100; // Fake emission used for this test's purpose
        const time = 0.1; // Time in seconds used for this test's purpose
        const millisecond = 1000;
        const msWait = time * millisecond;
        const emissionExpected = emission * time;

        // Initialize jamsine clock for time ticking
        const clock = jasmine.clock();
        clock.install();

        service.attr.emissionPerSecond = emission;
        const POINTS = 5;
        service.down(new Point(POINTS, POINTS)); // Push the mouse down for simulating the aerosol
        const spyInteraction = spyOn(service, 'createPath');
        clock.tick(msWait); // Wait

        // Expect createPath function to have been called the same number of time as the wanted emission
        expect(spyInteraction).toHaveBeenCalledTimes(emissionExpected);
        clock.uninstall();
    });

    it('should only have points inside the diameter', () => {
        const emission = 50; // Fake emission used for this test's purpose
        const diameter = 10;
        const radius = diameter / 2;
        const time = 0.05; // Time in seconds used for this test's purpose
        const MILLISECOND = 1000;
        const msWait = time * MILLISECOND;
        const coordinate = 100;
        const position = new Point(coordinate, coordinate);

        // Initialize jamsine clock for time ticking
        const clock = jasmine.clock();
        clock.install();

        service.attr.emissionPerSecond = emission;
        service.attr.diameter = diameter;
        service.down(position); // Push the mouse down for simulating the aerosol
        clock.tick(msWait); // Wait

        // Finish mock aerosol
        service.up(position, true);

        // Look for each individual point if it's in the diameter area
        let pointsInsideDiameter = true;
        for (const point of service.points) {
            if (
                point.x > coordinate + radius ||
                point.y > coordinate + radius ||
                point.x < coordinate - radius ||
                point.y < coordinate - radius
            ) {
                pointsInsideDiameter = false;
                break;
            }
        }
        expect(pointsInsideDiameter).toBeTruthy();
        clock.uninstall();
    });

    it('should have a round linecap and linejoin', () => {
        // For lines to be mostly round (we want points)
        const path = service.createPath(ptArr);

        expect(path).toContain('stroke-linecap="round"');
        expect(path).toContain('stroke-linejoin="round"');
    });

    it('should be named aerosol', () => {
        const path = service.createPath(ptArr);
        const name = 'aerosol';
        expect(path).toContain(name);
    });

    it('should create a valid invisible path', () => {
        const path = service.createPath(ptArr);
        expect(path).toContain('invisiblePath');
    });

    it('should have nor stroke nor fill as attribute for the invisible path', () => {
        const stroke = 'stroke="none"';
        const fill = 'fill="none"';
        const path = service.createPath(ptArr);

        expect(path).toContain(stroke);
        expect(path).toContain(fill);
    });
});
