import { TestBed } from '@angular/core/testing';

import { ColorPickingService } from './color-picking.service';

describe('ColorPickingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ColorPickingService = TestBed.get(ColorPickingService);
    expect(service).toBeTruthy();
  });
});
