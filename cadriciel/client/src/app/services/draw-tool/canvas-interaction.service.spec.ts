import { TestBed } from '@angular/core/testing';

import { CanvasInteraction } from './canvas-interaction.service';

describe('CanvasInteractionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const SERVICE: CanvasInteraction = TestBed.get(CanvasInteraction);
    expect(SERVICE).toBeTruthy();
  });
});
