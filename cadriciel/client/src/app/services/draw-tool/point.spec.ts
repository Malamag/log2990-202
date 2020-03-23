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
        const P2 = new Point(10, 10);
        const SQRT_SPY = spyOn(Math, 'sqrt');
        const expectedResult = Math.sqrt(200);
        const RESULT = Point.distance(P1, P2);
        expect(RESULT).toEqual(expectedResult);
        expect(SQRT_SPY).toHaveBeenCalled();
    });

    it('should return a new point with the expected values', () => {
        const P1 = new Point(0, 0);
        const P2 = new Point(10, 10);
        const EXPECTED_RESULT = new Point(10, 10);
        const RESULT = Point.createVector(P1, P2);
        expect(RESULT).toEqual(EXPECTED_RESULT);
    });

    it(' should not over lap', () => {
        const TL1 = new Point(0, 0);
        const BR2 = new Point(10, 10);
        const BR1 = new Point(10, 0);
        const TL2 = new Point(100, 0);
        const RESULT = Point.rectOverlap(TL1, BR1, TL2, BR2);
        expect(RESULT).toBeFalsy();
    });

    it(' should be inside the rectangle', () => {
        const TL = new Point(0, 0);
        const P = new Point(10, 10);
        const BR = new Point(20, 20);
        const RESULT = Point.insideRectangle(P, TL, BR);
        expect(RESULT).toBeTruthy();
    });
});
