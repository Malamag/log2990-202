import { TestBed } from '@angular/core/testing';

import { DrawToolService } from './draw-tool.service';

describe('DrawPencilService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DrawToolService = TestBed.get(DrawToolService);
    expect(service).toBeTruthy();
  });
});
