import { TestBed } from '@angular/core/testing';
import { Point } from './point';

describe('Point', () => {
    let point : Point
    beforeEach(() => {
        TestBed.configureTestingModule({});
        point = new Point( 1 , 2)
    });

    it('should be created', () => {
        expect(point).toBeTruthy()
    });

    it('should return the expected distance', () => {
        const p1 = new Point(0 , 0);
        const p2 = new Point(10 , 10);
        const sqrtSpy = spyOn(Math, 'sqrt')
        const expectedResult = Math.sqrt(200);
        const result = Point.distance(p1, p2);
        expect(result).toEqual(expectedResult);
        expect(sqrtSpy).toHaveBeenCalled()
    })

    it('should return a new point with the expected values', ()=> {
        const p1 = new Point(0 , 0);
        const p2 = new Point(10 , 10);
        const expectedResult = new Point(10 , 10);
        const result = Point.createVector(p1, p2);
        expect(result).toEqual(expectedResult);
    })

    it(' should not over lap', ()=> {
        const tl1 = new Point(0, 0);
        const br2 = new Point(10 , 10);
        const br1 = new Point(10 , 0);
        const tl2 = new Point(100, 0);
        const result = Point.rectOverlap(tl1, br1, tl2, br2)
        expect(result).toBeFalsy()
    })

    it(' should be inside the rectangle' , () => {
        const tl = new Point(0 , 0)
        const p = new Point(10 , 10)
        const br = new Point(20 , 20)
        const result = Point.insideRectangle(p, tl , br)
        expect(result).toBeTruthy()
    })
});