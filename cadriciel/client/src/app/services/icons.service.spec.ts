import { TestBed } from '@angular/core/testing';

import { IconsService } from './icons.service';

describe('IconsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const SERVICE: IconsService = TestBed.get(IconsService);
    expect(SERVICE).toBeTruthy();
  });
});
