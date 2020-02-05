import { TestBed } from '@angular/core/testing';

import { ModalWindowService } from './modal-window.service';
import { MatDialogModule } from '@angular/material';

describe('ModalWindowService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [MatDialogModule]
  }));

  it('should be created', () => {
    const service: ModalWindowService = TestBed.get(ModalWindowService);
    expect(service).toBeTruthy();
  });
});