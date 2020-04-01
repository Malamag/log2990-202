import { TestBed } from '@angular/core/testing';

import { FloodFillService } from './flood-fill.service';

describe('FloodFillService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FloodFillService = TestBed.get(FloodFillService);
    expect(service).toBeTruthy();
  });
});
