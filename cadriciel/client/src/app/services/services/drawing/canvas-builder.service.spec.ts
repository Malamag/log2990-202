import { TestBed } from '@angular/core/testing';

import { CanvasBuilderService } from './canvas-builder.service';

describe('CanvasBuilderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CanvasBuilderService = TestBed.get(CanvasBuilderService);
    expect(service).toBeTruthy();
  });
});
