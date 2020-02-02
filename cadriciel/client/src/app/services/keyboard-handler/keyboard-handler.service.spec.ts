import { TestBed } from '@angular/core/testing';
import { InputObserver } from '../draw-tool/input-observer';

import { KeyboardHandlerService } from './keyboard-handler.service';

describe('KeyboardHandlerService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers:[InputObserver]
  }));
  /*beforeEach(async(()=>{
    const service = TestBed.get(KeyboardHandlerService);
  }));*/

  it('should be created', () => {
    const service: KeyboardHandlerService = TestBed.get(KeyboardHandlerService);
    expect(service).toBeTruthy();
  });

});
