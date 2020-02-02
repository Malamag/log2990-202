import { TestBed } from '@angular/core/testing';


import { KeyboardHandlerService } from './keyboard-handler.service';

import { InputObserver } from '../draw-tool/input-observer';


describe('KeyboardHandlerService', () => {

  let keyboardService: KeyboardHandlerService
  beforeEach(() => TestBed.configureTestingModule({
    providers:[InputObserver, ]
  }));
  beforeEach(()=>{
    keyboardService = TestBed.get(KeyboardHandlerService);
  });

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
    const spyObject= jasmine.createSpyObj('keybaordService', ['updateObservers']);
    const mockKeyDown = new KeyboardEvent("keydown",{
      key: "keydown",
      ctrlKey: false,
      shiftKey:true,
    })
    keyboardService.logkey(mockKeyDown);
    expect(spyObject.updateObservers().calls.count()).toBe(1);
    
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
    const spyObject= jasmine.createSpyObj('keybaordService', ['updateObservers']);
    const mockKeyDown = new KeyboardEvent("keydown",{
      key: "keydown",
      ctrlKey: false,
      shiftKey:true,
    })
    keyboardService.logkey(mockKeyDown);
    expect(spyObject.updateObservers().calls.count()).toBe(1);
    
  });

  it('on update the update methods of the observers is called',()=>{
    const spyObject= jasmine.createSpyObj('keybaordService', ['']); 

  });

});
