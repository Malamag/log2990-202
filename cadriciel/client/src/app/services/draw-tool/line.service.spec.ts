import { TestBed } from '@angular/core/testing';

import { LineService } from './line.service';
import { InteractionService } from '../service-interaction/interaction.service';

export class fakeInteractionService extends InteractionService{} 

describe('LineService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LineService,
        {provide: String, useValue: ""},
        {provide: Boolean, useValue: true},
        {provide: Number, useValue: 0},
        {provide: HTMLElement},
        {provide: InteractionService, useValue: fakeInteractionService}]
    });

  });
  

  it('should be created', () => {
    const service: LineService = TestBed.get(LineService);
    expect(service).toBeTruthy();
  });
});
