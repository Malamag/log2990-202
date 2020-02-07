import { TestBed } from '@angular/core/testing';
import { KeyboardHandlerService } from './keyboard-handler.service';
import { InputObserver } from '../draw-tool/input-observer';
import { PencilService } from '../draw-tool/pencil.service';
import { InteractionService } from '../service-interaction/interaction.service';


describe('KeyboardHandlerService', () => {
  let service = new KeyboardHandlerService();
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      
    });
  });

  it('should be created', () => {
    const service: KeyboardHandlerService = TestBed.get(KeyboardHandlerService);
    expect(service).toBeTruthy();
  });

  it("should add the observer", ()=>{
    let prog = new HTMLElement();
    prog.innerHTML = "";
    let draw = new HTMLElement();
    draw.innerHTML = "";

    const observer: InputObserver = new PencilService(prog, draw, true,1,"blue", 2, new InteractionService());
    service.addToolObserver(observer);
    expect(service.toolObservers.length).toBe(1);
    expect(service.toolshortcuts.length).toBe(1);
  })

  it("should get the key information and the observers must be updated and the change check is done", ()=>{
    
    const spyToolChange = spyOn(service, 'checkForToolChange');
    const spyUpdate = spyOn(service, 'updateToolObservers');
    let mockKey : KeyboardEvent = new KeyboardEvent("keydown",{
      key: "Shift",
      ctrlKey: false,
      shiftKey: true,
    })
    service.logkey(mockKey);
    expect(service.keyString).toBe('Shift');
    // the reason why the keycode isnt tested is because the keyCode of the mockKey cant be initialised
    expect(service.ctrlDown).toBeFalsy();
    expect(service.shiftDown).toBeTruthy();
    expect(spyToolChange).toHaveBeenCalled();
    expect(spyUpdate).toHaveBeenCalled();
  });

  it('on reset the keyboard attributes are reseted and the tools have been updated',()=>{
    
    const spyUpdate = spyOn(service, 'updateToolObservers');
    let mockKey : KeyboardEvent = new KeyboardEvent("keyup",{
      key: "Shift",
      ctrlKey: false,
      shiftKey: true,
    })
    service.logkey(mockKey);
    service.reset(mockKey);
    expect(service.keyString).toBe('');
    expect(service.keyCode).toBe(-1);
    //expect(service.ctrlDown).toBeFalsy();
    //expect(service.shiftDown).toBeFalsy();
    expect(spyUpdate).toHaveBeenCalled();
  });

  /*it('on update call the update fuction of the observers is called', ()=>{
    const service: KeyboardHandlerService= new KeyboardHandlerService();
    const observer: InputObserver = new PencilService(true,1,"blue", 2);
    service.addToolObserver(observer);
    const observers = service.toolObservers;
    const spyObj = spyOn(observers, 'update');
    service.updateToolObservers();
    expect(spyObj).toHaveBeenCalled();
  });
  */
  // one last test todo 
  /*it('on checkForToolChange the attribute selected for the corresponding tool is true',()=>{

  })*/
  
});
