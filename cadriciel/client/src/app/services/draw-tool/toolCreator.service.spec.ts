import { TestBed } from '@angular/core/testing';

import { ToolCreator } from './toolCreator';

describe('DrawPencilService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ToolCreator = TestBed.get(ToolCreator);
    expect(service).toBeTruthy();
  });
});
