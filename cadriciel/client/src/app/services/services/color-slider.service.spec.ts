import { TestBed } from '@angular/core/testing';

import { ColorSliderService } from './color-slider.service';

describe('ColorSliderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ColorSliderService = TestBed.get(ColorSliderService);
    expect(service).toBeTruthy();
  });
});
