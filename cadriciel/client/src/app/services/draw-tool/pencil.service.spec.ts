import { TestBed } from '@angular/core/testing';

import { PencilService } from './pencil.service';


describe('PencilService', () => {
  beforeEach(() => {

    TestBed.configureTestingModule({
    providers:[PencilService]
    
  });
});

  it('should be created', () => {
    const service: PencilService = TestBed.get(PencilService);
    expect(service).toBeTruthy();
  });
});
