import { TestBed } from '@angular/core/testing';

import { MoveWithArrows } from './move-with-arrows.service';

describe('MoveWithArrowsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const SERVICE: MoveWithArrows = TestBed.get(MoveWithArrows);
    expect(SERVICE).toBeTruthy();
  });
});
