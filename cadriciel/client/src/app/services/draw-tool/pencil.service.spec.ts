import { TestBed } from '@angular/core/testing';

import { PencilService } from './pencil.service';
import { Point } from './point';

describe('PencilService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [{provide: HTMLElement},, {provide: Point}],
    
  }));

  it('should be created', () => {
    const service: PencilService = TestBed.get(PencilService);
    expect(service).toBeTruthy();
  });
});
