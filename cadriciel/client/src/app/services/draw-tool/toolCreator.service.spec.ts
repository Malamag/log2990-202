import { TestBed } from '@angular/core/testing';

import { ToolCreator } from './toolCreator';
import { RectangleService } from './rectangle.service';
import { PencilService } from './pencil.service';
import { LineService } from './line.service';
import { BrushService } from './brush.service';
describe('DrawPencilService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      {provide: HTMLElement,
      RectangleService,
      PencilService,
      LineService,
      BrushService}]
  }));

  it('should be created', () => {
    const service: ToolCreator = TestBed.get(ToolCreator);
    expect(service).toBeTruthy();
  });
});
