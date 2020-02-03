import { TestBed } from '@angular/core/testing';

import { ColorConvertingService } from './color-converting.service';

describe('ColorConvertingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ColorConvertingService = TestBed.get(ColorConvertingService);
    expect(service).toBeTruthy();
  });
});
