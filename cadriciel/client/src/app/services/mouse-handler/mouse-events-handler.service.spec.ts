import { TestBed } from '@angular/core/testing';

import { MouseEventsHandlerService } from './mouse-events-handler.service';

describe('MouseEventsHandlaerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MouseEventsHandlerService = TestBed.get(MouseEventsHandlerService);
    expect(service).toBeTruthy();
  });
});
