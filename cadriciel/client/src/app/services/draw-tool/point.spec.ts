import { TestBed } from '@angular/core/testing';
import { Point } from './point';

fdescribe('Point', () => {
    let point : Point
    beforeEach(() => {
        TestBed.configureTestingModule({});
        point = new Point( 1 , 2)
    });

    it('should be created', () => {
        expect(point).toBeTruthy()
    });

    
});