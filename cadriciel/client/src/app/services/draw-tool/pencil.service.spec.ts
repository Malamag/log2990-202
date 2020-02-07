import { TestBed } from '@angular/core/testing';

import { PencilService } from './pencil.service';
import { InteractionService } from '../service-interaction/interaction.service';

export class fakeInteractionService extends InteractionService{}
describe('PencilService', () => {
  beforeEach(() => {

    TestBed.configureTestingModule({
    providers:[
      PencilService,
      {provide: Boolean, useValue: true},
      {provide: String, useValue: ""},
      {provide: Number, useValue: 0},
      {provide: HTMLElement},
      {provide: InteractionService, useClass: fakeInteractionService}]
    
  });
});

  it('should be created', () => {
    const service: PencilService = TestBed.get(PencilService);
    expect(service).toBeTruthy();
  });
});
