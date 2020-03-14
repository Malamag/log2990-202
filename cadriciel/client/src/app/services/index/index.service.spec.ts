import { TestBed } from '@angular/core/testing';

import { IndexService } from './index.service';

describe('IndexService', () => {
    let service: IndexService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [],
        });
        service = TestBed.get(IndexService);
    });

    it('should be created', () => {
        const testService: IndexService = TestBed.get(IndexService);
        expect(testService).toBeTruthy();
        expect(service).toBeTruthy();
    });
});
