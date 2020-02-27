import { TestBed } from '@angular/core/testing';

import { GridRenderService } from './grid-render.service';

describe('GridRenderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GridRenderService = TestBed.get(GridRenderService);
    expect(service).toBeTruthy();
  });
});
