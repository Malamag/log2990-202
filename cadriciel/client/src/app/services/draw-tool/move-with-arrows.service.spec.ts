import { TestBed } from '@angular/core/testing';

import { MoveWithArrows } from './move-with-arrows.service';

describe('MoveWithArrowsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MoveWithArrows = TestBed.get(MoveWithArrows);
    expect(service).toBeTruthy();
  });
});
