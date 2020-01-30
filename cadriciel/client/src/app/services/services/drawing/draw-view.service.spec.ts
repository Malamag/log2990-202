import { TestBed } from '@angular/core/testing';

import { DrawViewService } from './draw-view.service';

describe('DrawViewService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DrawViewService = TestBed.get(DrawViewService);
    expect(service).toBeTruthy();
  });
});
