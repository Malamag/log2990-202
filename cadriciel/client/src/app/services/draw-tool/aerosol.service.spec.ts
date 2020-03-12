import { TestBed } from '@angular/core/testing';

import { AerosolService } from './aerosol.service';

describe('AerosolService', () => {
    beforeEach(() =>
        TestBed.configureTestingModule({
            providers: [
                { provide: HTMLElement, useValue: {} },
                { provide: Boolean, useValue: false },
                { provide: Number, useValue: 0 },
                { provide: String, useValue: '' },
            ],
        }),
    );

    it('should be created', () => {
        const service: AerosolService = TestBed.get(AerosolService);
        expect(service).toBeTruthy();
    });
});
