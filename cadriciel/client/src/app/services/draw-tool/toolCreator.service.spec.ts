import { TestBed } from '@angular/core/testing';

import { ToolCreator } from './toolCreator';
import { RectangleService } from './rectangle.service';
import { PencilService } from './pencil.service';
import { LineService } from './line.service';
import { BrushService } from './brush.service';
describe('DrawPencilService', () => {
  let elem: HTMLElement;
  let service: ToolCreator;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        service,
        {provide: HTMLElement, useValue: elem},
        {provide:
        RectangleService,
        PencilService,
        LineService,
        BrushService},
        ]
        
    });
    
  });

  it('should be created', () => {
    const service: ToolCreator = TestBed.get(ToolCreator);
    expect(service).toBeTruthy();
  });
});
