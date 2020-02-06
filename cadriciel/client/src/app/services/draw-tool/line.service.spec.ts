import { TestBed } from '@angular/core/testing';

import { LineService } from './line.service';
import { Point } from './point';

describe('LineService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      {provide: HTMLElement},
      {provide: Point}
    ],
    
  }));

  it('should be created', () => {
    const service: LineService = TestBed.get(LineService);
    expect(service).toBeTruthy();
  });
});
