import { TestBed } from '@angular/core/testing';

import { BucketToolService } from './bucket-tool.service';

describe('BucketToolService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BucketToolService = TestBed.get(BucketToolService);
    expect(service).toBeTruthy();
  });
});
