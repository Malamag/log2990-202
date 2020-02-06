import { TestBed } from '@angular/core/testing';

import { BrushService } from './brush.service';
import { PencilService } from './pencil.service';
import { InteractionService } from '../service-interaction/interaction.service';

class InteractionServiceStub { } 

describe('BrushService', () => {
  let bService: BrushService;
  let pServiceSpy: jasmine.SpyObj<PencilService>;
  
  let elem: HTMLElement;

  beforeEach(() => {
    
    const spy = jasmine.createSpyObj("PencilService", ["getValue"]);
    elem = new HTMLElement();
    TestBed.configureTestingModule({
      providers: [
        bService,
        {provide: PencilService, useValue: spy},
        {provide: Boolean, useValue: true},
        {provide: InteractionService, useValue: InteractionServiceStub},
        {provide: Number, useValue: 0},
        {provide: HTMLElement, useValue: elem}],
        
    });
    bService = TestBed.get(BrushService);
    pServiceSpy = TestBed.get(pServiceSpy);
  });

  it('should be created', () => {
    const service: BrushService = TestBed.get(BrushService);
    expect(service).toBeTruthy();
  });
});
