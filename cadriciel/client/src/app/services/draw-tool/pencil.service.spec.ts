import { TestBed } from '@angular/core/testing';

import { PencilService } from './pencil.service';
import { InteractionService } from '../service-interaction/interaction.service';
//import { Point } from './point';
import { ColorConvertingService } from '../colorPicker/color-converting.service';
import { ColorPickingService } from '../colorPicker/color-picking.service';

export class fakeInteractionService extends InteractionService{}
export class fakeColorPickingService extends ColorPickingService {}
export class fakeColorConvertingService extends ColorConvertingService {}
export class MouseHandlerMock{

}
describe('PencilService', () => {
  //let service: PencilService
  
  beforeEach(() => {
    
    TestBed.configureTestingModule({
    providers:[
      {provide: HTMLElement, useValue: {}},
      {provide: Boolean, useValue: false},
      {provide: Number, useValue: 0},
      {provide: String, useValue: ""}]
      
  });
  //service = TestBed.get(PencilService);
  
});

  it('should be created', () => {
    const service: PencilService = TestBed.get(PencilService);
    expect(service).toBeTruthy();
  });

  /*it('should update progress on mouse down', () => {
    const position: Point = new Point(0,0);
    const spy = spyOn(service, "updateProgress");
    service.down(position);
    expect(spy).toHaveBeenCalled();
  });*/

  
  
});
