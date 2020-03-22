import { TestBed } from '@angular/core/testing';

import { ElementInfoService } from './element-info.service';

describe('ElementInfoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ElementInfoService = TestBed.get(ElementInfoService);
    expect(service).toBeTruthy();
  });
});
