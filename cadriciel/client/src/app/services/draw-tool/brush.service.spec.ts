import { TestBed } from '@angular/core/testing';

import { BrushService } from './brush.service';
import { PencilService } from './pencil.service';
import { InteractionService } from '../service-interaction/interaction.service';

export class fakeInteractionService extends InteractionService { } 

describe('BrushService', () => {
  let bService: BrushService;
  let pServiceSpy: jasmine.SpyObj<PencilService>;
  

  beforeEach(() => {
    
    const spy = jasmine.createSpyObj("PencilService", ["getValue"]);
    TestBed.configureTestingModule({
      providers: 
      [bService, PencilService,
      {provide: PencilService, useValue: spy},
      {provide: Boolean, useValue: true},
      {provide: String, useValue: ""},
      {provide: Number, useValue: 0},
      {provide: HTMLElement},
      {provide: InteractionService, useClass: fakeInteractionService}]
        
    });
    bService = TestBed.get(BrushService);
    pServiceSpy = TestBed.get(pServiceSpy);
  });

  it('should be created', () => {
    const service: BrushService = TestBed.get(BrushService);
    expect(service).toBeTruthy();
  });
});
