import { TestBed } from '@angular/core/testing';

import { DoodleLoaderService } from './doodle-loader.service';

describe('DoodleLoaderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DoodleLoaderService = TestBed.get(DoodleLoaderService);
    expect(service).toBeTruthy();
  });
});
