import { TestBed } from '@angular/core/testing';

import { PencilService } from './pencil.service';
import { InteractionService } from '../service-interaction/interaction.service';
import { Point } from './point';

export class fakeInteractionService extends InteractionService{}
export class MouseHandlerMock{

}
describe('PencilService', () => {
  let service: PencilService
  let HTML: HTMLElement;
  beforeEach(() => {
    
    TestBed.configureTestingModule({
    providers:[
      service,
      {provide: Boolean, useValue: true},
      {provide: String, useValue: ""},
      {provide: Number, useValue: 0},
      {provide: HTMLElement},
      {provide: InteractionService, useClass: fakeInteractionService}]
      
  });
  service = TestBed.get(PencilService);
  HTML = new HTMLElement();
});

  it('should be created', () => {
    const service: PencilService = TestBed.get(PencilService);
    expect(service).toBeTruthy();
  });

  it('should update progress on mouse down', () => {
    const position: Point = new Point(0,0);
    const spy = spyOn(service, "updateProgress");
    service.down(position);
    expect(spy).toHaveBeenCalled();
  });

  it('should create a path on click', () => {
    let ptArray = [new Point(0,0), new Point(1,1)];
    HTML.innerHTML = service.createPath(ptArray);
    expect(HTML.tagName[0]).toContain('pencil-stroke');
  });
  
});
