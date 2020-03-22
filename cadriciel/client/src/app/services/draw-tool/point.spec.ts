import { TestBed } from '@angular/core/testing';
import { Point } from './point';

describe('Point', () => {
    let point: Point;
    beforeEach(() => {
        TestBed.configureTestingModule({});
        point = new Point( 1 , 2);
    });
    it('should be created', () => {
        expect(point).toBeTruthy();
    });
    it('should return the expected distance', () => {
        const P1 = new Point(0 , 0);
        const COORD = 10;
        const P2 = new Point(COORD , COORD);
        const SQRT_SPY = spyOn(Math, 'sqrt');
        const EXPECTED_RESULT_SQUARE = 200;
        const EXPECTED_RESULT = Math.sqrt(EXPECTED_RESULT_SQUARE);
        const RESULT = Point.distance(P1, P2);
        expect(RESULT).toEqual(EXPECTED_RESULT);
        expect(SQRT_SPY).toHaveBeenCalled();
    });
    it('should return a new point with the expected values', () => {
        const P1 = new Point(0 , 0);
        const COORD = 10;
        const P2 = new Point(COORD , COORD);
        const EXPECTED_RESULT = new Point(COORD , COORD);
        const RESULT = Point.createVector(P1, P2);
        expect(RESULT).toEqual(EXPECTED_RESULT);
    });
    it(' should not over lap', () => {
        const TL1 = new Point(0, 0);
        const SMALL_COORD = 10;
        const BR2 = new Point(SMALL_COORD , SMALL_COORD);
        const BR1 = new Point(SMALL_COORD , 0);
        const BIG_COORD = 100;
        const TL2 = new Point(BIG_COORD, 0);
        const RESULT = Point.rectOverlap(TL1, BR1, TL2, BR2);
        expect(RESULT).toBeFalsy();
    });
    it(' should be inside the rectangle' , () => {
        const SMALL_COORD = 10;
        const BIG_COORD = 20;
        const TL = new Point(0 , 0);
        const P = new Point(SMALL_COORD , SMALL_COORD);
        const BR = new Point(BIG_COORD , BIG_COORD);
        const RESULT = Point.insideRectangle(P, TL , BR);
        expect(RESULT).toBeTruthy();
    });
});
