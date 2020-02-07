import { TestBed } from '@angular/core/testing';

import { BrushService } from './brush.service';

import { InteractionService } from '../service-interaction/interaction.service';

export class fakeInteractionService extends InteractionService { } 

describe('BrushService', () => {

  

  beforeEach(() => {

    TestBed.configureTestingModule({
      providers: 
      [{provide: HTMLElement, useValue: {}},
        {provide: Boolean, useValue: false},
        {provide: Number, useValue: 0},
        {provide: String, useValue: ""}]
        
    });

  });

  it('should be created', () => {
    const service: BrushService = TestBed.get(BrushService);
    expect(service).toBeTruthy();
  });
});
