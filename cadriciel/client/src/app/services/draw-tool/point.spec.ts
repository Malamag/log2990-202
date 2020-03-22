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
        const p1 = new Point(0 , 0);
        const coord = 10;
        const p2 = new Point(coord , coord);
        const sqrtSpy = spyOn(Math, 'sqrt');
        const expectedResultSquare = 200;
        const expectedResult = Math.sqrt(expectedResultSquare);
        const result = Point.distance(p1, p2);
        expect(result).toEqual(expectedResult);
        expect(sqrtSpy).toHaveBeenCalled();
    });
    it('should return a new point with the expected values', () => {
        const p1 = new Point(0 , 0);
        const coord = 10;
        const p2 = new Point(coord , coord);
        const expectedResult = new Point(coord , coord);
        const result = Point.createVector(p1, p2);
        expect(result).toEqual(expectedResult);
    });
    it(' should not over lap', () => {
        const tl1 = new Point(0, 0);
        const smallCoord = 10;
        const br2 = new Point(smallCoord , smallCoord);
        const br1 = new Point(smallCoord , 0);
        const bigCoord = 100;
        const tl2 = new Point(bigCoord, 0);
        const result = Point.rectOverlap(tl1, br1, tl2, br2);
        expect(result).toBeFalsy();
    });
    it(' should be inside the rectangle' , () => {
        const smallCoord = 10;
        const bigCoord = 20;
        const tl = new Point(0 , 0);
        const p = new Point(smallCoord , smallCoord);
        const br = new Point(bigCoord , bigCoord);
        const result = Point.insideRectangle(p, tl , br);
        expect(result).toBeTruthy();
    });
});
