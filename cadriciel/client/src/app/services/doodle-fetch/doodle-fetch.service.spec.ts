import { TestBed } from '@angular/core/testing';

import { DoodleFetchService } from './doodle-fetch.service';

describe('DoodleFetchService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DoodleFetchService = TestBed.get(DoodleFetchService);
    expect(service).toBeTruthy();
  });
});
