import { TestBed } from '@angular/core/testing';

import { BrushService } from './brush.service';
import { PencilService } from './pencil.service';
import { Point } from './point';


describe('BrushService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [PencilService, {provide: HTMLElement}, {provide: Point}],
    
  }));

  it('should be created', () => {
    const service: BrushService = TestBed.get(BrushService);
    expect(service).toBeTruthy();
  });
});
