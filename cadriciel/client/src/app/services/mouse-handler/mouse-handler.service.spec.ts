import { TestBed } from '@angular/core/testing';

import { MouseHandlerService } from './mouse-handler.service';

describe('MouseHandlerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MouseHandlerService = TestBed.get(MouseHandlerService);
    expect(service).toBeTruthy();
  });
});
