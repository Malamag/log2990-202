import { TestBed } from '@angular/core/testing';

import { RectangleService } from './rectangle.service';
import { Point } from './point';
import { InteractionService } from '../service-interaction/interaction.service';

export class fakeInteractionService extends InteractionService{}

describe('RectangleService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers:[
      RectangleService,
      {provide:Point}, 
      {provide: HTMLElement},
      {provide: Number, useValue: 0},
      {provide: String, useValue: ""},
      {provide: Boolean, useValue: true},
      {provide: InteractionService, useClass: fakeInteractionService}]
  }));

  it('should be created', () => {
    const service: RectangleService = TestBed.get(RectangleService);
    expect(service).toBeTruthy();
  });
});
