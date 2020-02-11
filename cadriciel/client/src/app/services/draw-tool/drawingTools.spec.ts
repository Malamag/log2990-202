import { TestBed } from '@angular/core/testing';


import { InteractionService } from '../service-interaction/interaction.service';
import { ColorPickingService } from '../colorPicker/color-picking.service';
import {DrawingTool} from './drawingTool'
import { ChoosenColors } from 'src/app/models/ChoosenColors.model';
import { Point } from './point';


export class fakeCpService extends ColorPickingService {}
export class fakeItService extends InteractionService {}


describe('drawingTools', () => {

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

  it('should call a subscription to the choosen colors and emit it', ()=>{
    const spy = spyOn(service.colorPick.colorSubject, "subscribe");
    const emitSpy = spyOn(service.colorPick, "emitColors");
    const PRIM = '#ffffff';
    const SEC = '#000000';
    service.colorPick.colors = new ChoosenColors(PRIM, SEC);

    service.updateColors();
    expect(spy).toHaveBeenCalled();
    expect(emitSpy).toHaveBeenCalled();
    
  });

  it('should set the colors properly after subscription', ()=>{
    
    const PRIM = '#ffff00';
    const SEC = '#0000ff';
    service.colorPick.colors = new ChoosenColors(PRIM, SEC); // color init in service

    service.updateColors();
    expect(service.chosenColor).toEqual(service.colorPick.colors); // checking the assignation
    
  });

  it('should set the colors as default if undefined', ()=>{
    const DEF_PRIM = '#000000ff';
    const DEF_SEC = '#ff0000ff';

    service.updateColors();
    expect(service.chosenColor.primColor).toEqual(DEF_PRIM); // checking the assignation
    expect(service.chosenColor.secColor).toEqual(DEF_SEC);
   });

   it('should empty the progress innerhtml on cancel', ()=>{
        service.inProgress.innerHTML = "test";
        service.cancel();
        expect(service.inProgress.innerHTML).toEqual(""); // no svg elements
   });

   it('should assing the newly created form/path in the html', ()=>{
        service.currentPath = [new Point(0,0), new Point(1,1)]; // adding points to avoid having an empty array of progress
        service.createPath = ()=> "test"; // stub fn
        service.updateProgress();
        const EMPTY = "";
        const inner:string = service.inProgress.innerHTML;
        expect(inner).not.toBe(EMPTY);

   });

   it('should add the progress to the main drawing and refresh the current progress', ()=>{
        service.currentPath = [new Point(0,0), new Point(1,1)]; // adding points to avoid having an empty array of progress
        service.createPath = ()=>"test"; // stub function
        service.updateDrawing();
        
        const EMPTY = "";
   
        expect(service.drawing).toBeDefined(); // we dont want to have an empty innerhtml
        
        expect(service.inProgress.innerHTML).toEqual(EMPTY);
        expect(service.currentPath.length).toEqual(0); // progress refresh check

    });

    it('should update the drawing if the mouse is going outside canvas', ()=>{
        service.isDown = true;
        service.createPath = ()=> "test";
        const spy = spyOn(service, "updateDrawing");
        service.goingOutsideCanvas(new Point(0,0)); //random point
        expect(spy).toHaveBeenCalled()
    });

    it('should continue drawing when mouse goes back in canvas', ()=>{
        service.isDown = true; //tool selected and in use
        service.down = ()=>0; // defining a function for test purpose
        service.createPath = () => "test";
        const spy = spyOn(service, "down");
        const PT = new Point(0,0); //a point in our canvas, arbitrary
        service.goingInsideCanvas(PT);
        expect(spy).toHaveBeenCalledWith(PT);

    });

  
});
