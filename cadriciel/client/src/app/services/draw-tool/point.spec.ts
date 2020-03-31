import { TestBed } from '@angular/core/testing';
import { Point } from './point';

describe('Point', () => {
    let point: Point;
    beforeEach(() => {
        TestBed.configureTestingModule({});
        point = new Point(1, 2);
    });

    it('should be created', () => {
        expect(point).toBeTruthy();
    });

    it('should return the expected distance', () => {
        const P1 = new Point(0, 0);
        const COORD = 10;
        const SQRT = 200;
        const P2 = new Point(COORD, COORD);
        const SQRT_SPY = spyOn(Math, 'sqrt');
        const expectedResult = Math.sqrt(SQRT);
        const RESULT = Point.distance(P1, P2);
        expect(RESULT).toEqual(expectedResult);
        expect(SQRT_SPY).toHaveBeenCalled();
    });

    it('should return a new point with the expected values', () => {
        const COORD = 10;
        const P1 = new Point(0, 0);
        const P2 = new Point(COORD, COORD);
        const EXPECTED_RESULT = new Point(COORD, COORD);
        const RESULT = Point.createVector(P1, P2);
        expect(RESULT).toEqual(EXPECTED_RESULT);
    });

    it(' should not over lap', () => {
        const COORD = 10;
        const HUND = 100;
        const TL1 = new Point(0, 0);
        const BR2 = new Point(COORD, COORD);
        const BR1 = new Point(COORD, 0);
        const TL2 = new Point(HUND, 0);
        const RESULT = Point.rectOverlap(TL1, BR1, TL2, BR2);
        expect(RESULT).toBe(false);
    });

    it(' should be inside the rectangle', () => {
        const TL = new Point(0, 0);
        const COORD = 10;
        const TW = 20;
        const P = new Point(COORD, COORD);
        const BR = new Point(TW, TW);
        const RESULT = Point.insideRectangle(P, TL, BR);
        expect(RESULT).toBeTruthy();
    });

    it(' should overlap', () => {
        const COORD = 10;
        const TL1 = new Point(0, 0);
        const BR2 = new Point(COORD, 0);
        const BR1 = new Point(COORD, 0);
        const TL2 = new Point(0, 0);
        const RESULT = Point.rectOverlap(TL1, BR1, TL2, BR2);
        expect(RESULT).toBe(true);
    });
});
