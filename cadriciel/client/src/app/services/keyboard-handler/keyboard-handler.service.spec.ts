import { TestBed, async } from '@angular/core/testing';


import { KeyboardHandlerService } from './keyboard-handler.service';

import { InputObserver } from '../draw-tool/input-observer';
//import { PencilService } from '../draw-tool/pencil.service';


describe('KeyboardHandlerService', () => {

  let keyboardService: KeyboardHandlerService
  beforeEach(() => TestBed.configureTestingModule({
    providers:[InputObserver, ]
  }));
  beforeEach(async(() =>{
    keyboardService = TestBed.get(KeyboardHandlerService);
    
  }));

  it('should be created', () => {
    expect(keyboardService).toBeTruthy();
  });

  it('on a keyboardEvent should read the keyboardEvent attributes', () => {
    
    const mockKeyDown = new KeyboardEvent("keydown",{
      key: "keydown",
      ctrlKey: false,
      shiftKey:true,
    })
    keyboardService.logkey(mockKeyDown);
    expect(keyboardService.ctrlDown).toBe(false);
    expect(keyboardService.keyString).toBe("keydown");
    expect(keyboardService.shiftDown).toBe(true);
  });

  it('on a keyboardEvent the observers must be updated',()=>{
    const spyObject= spyOn(keyboardService, 'updateObservers')
    const mockKeyDown = new KeyboardEvent("keydown",{
      key: "keydown",
      ctrlKey: false,
      shiftKey:true,
    })
    keyboardService.logkey(mockKeyDown);
    expect(spyObject).toHaveBeenCalled();
    
  })

  it('on reset call the attributes must be reseted even if the shift key is on', () => {
    
    const mockKeyDown = new KeyboardEvent("keydown",{
      key: "keydown",
      ctrlKey: false,
      shiftKey:true,
    })
    keyboardService.reset(mockKeyDown);
    expect(keyboardService.ctrlDown).toBe(false);
    expect(keyboardService.keyString).toBe("");
    expect(keyboardService.shiftDown).toBe(false);
  });

  it('on reset call the attributes must be reseted even if the control key is on', () => {
    
    const mockKeyDown = new KeyboardEvent("keydown",{
      key: "keydown",
      ctrlKey: true,
      shiftKey:false,
    })
    keyboardService.reset(mockKeyDown);
    expect(keyboardService.ctrlDown).toBe(false);
    expect(keyboardService.keyString).toBe("");
    expect(keyboardService.shiftDown).toBe(false);
  });

  it('on reset the observers must be updated',()=>{
    const spyObject= spyOn(keyboardService, 'updateObservers')
    const mockKeyDown = new KeyboardEvent("keydown",{
      key: "keydown",
      ctrlKey: false,
      shiftKey:true,
    })
    keyboardService.logkey(mockKeyDown);
    expect(spyObject).toHaveBeenCalled();
    
  });
  // this test is for the update function 

 /* it('on update the update method of the observers must be called',()=>{
    let svg:HTMLElement = new HTMLElement;
    let workingSpace: HTMLElement = new HTMLElement;
    let color= "blue";
    let obs1:InputObserver = new PencilService(svg, workingSpace, true, 10, color);
    let obs2: InputObserver= new PencilService(svg, workingSpace, false, 10, color);
    keyboardService.observers.push(obs1);
    keyboardService.observers.push(obs2);
    let inputObserver: InputObserver[] = keyboardService.observers
    const spyObject= spyOn(inputObserver, "update")
    expect(spyObject).toHaveBeenCalledTimes(2);

  });*/
  // there is another test 
});
