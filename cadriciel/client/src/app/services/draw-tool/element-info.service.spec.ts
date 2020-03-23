import { TestBed } from '@angular/core/testing';

import { ElementInfo } from './element-info.service';

describe('ElementInfoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const SERVICE: ElementInfo = TestBed.get(ElementInfo);
    expect(SERVICE).toBeTruthy();
  });
});
