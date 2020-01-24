import { TestBed } from '@angular/core/testing';

import { ModalWindowService } from './modal-window.service';

describe('ModalWindowService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ModalWindowService = TestBed.get(ModalWindowService);
    expect(service).toBeTruthy();
  });
});
