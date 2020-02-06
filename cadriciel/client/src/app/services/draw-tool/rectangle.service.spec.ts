import { TestBed } from '@angular/core/testing';

import { RectangleService } from './rectangle.service';
import { Point } from './point';

describe('RectangleService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers:[{provide:Point}, {provide: HTMLElement}]
  }));

  it('should be created', () => {
    const service: RectangleService = TestBed.get(RectangleService);
    expect(service).toBeTruthy();
  });
});
