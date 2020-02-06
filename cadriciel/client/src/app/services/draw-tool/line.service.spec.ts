import { TestBed } from '@angular/core/testing';

import { LineService } from './line.service';
import { InteractionService } from '../service-interaction/interaction.service';


describe('LineService', () => {
  let elem: HTMLElement;
  let lineService: LineService;

  beforeEach(() => {
    elem = new HTMLElement();
    const iSpy = jasmine.createSpyObj("InteractionService", ["getValue"]);
    TestBed.configureTestingModule({
      providers: [
        lineService,
        {provide: String, useValue: ""},
        {provide: Boolean, useValue: true},
        {provide: Number, useValue: 0},
        {provide: HTMLElement, useValue: elem},
        {provide: InteractionService, useValue: iSpy}]
    });
    lineService = TestBed.get(LineService);
  });
  

  it('should be created', () => {
    const service: LineService = TestBed.get(LineService);
    expect(service).toBeTruthy();
  });
});
