import { TestBed } from '@angular/core/testing';


import { InteractionService } from '../service-interaction/interaction.service';
import { ColorPickingService } from '../colorPicker/color-picking.service';
import {DrawingTool} from './drawingTool'


export class fakeCpService extends ColorPickingService {}
export class fakeItService extends InteractionService {}


describe('drawingTools', () => {
  //let elem: HTMLElement;



  let service: DrawingTool;

  beforeEach(() => {
    
   
    TestBed.configureTestingModule({
      providers: [
        {provide: HTMLElement, useValue: {}},
        {provide: Boolean, useValue: false},
        {provide: Number, useValue: 0},
        {provide: String, useValue: ""},
        {provide: InteractionService, useValue:{}}]   
    });

    service = TestBed.get(DrawingTool);
  });
    

  it('should be created', () => {
    const service: DrawingTool = TestBed.get(DrawingTool);
    expect(service).toBeTruthy();
  });

  it('should', ()=>{
      expect(service).toBeTruthy();
  })

   

  
});
