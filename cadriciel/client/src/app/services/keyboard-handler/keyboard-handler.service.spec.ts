import { TestBed } from '@angular/core/testing';
import { KeyboardHandlerService } from './keyboard-handler.service';
import { InputObserver } from '../draw-tool/input-observer';



describe('KeyboardHandlerService', () => {
  let service: KeyboardHandlerService;
  let observerStub: any;
  beforeEach(() => {

    observerStub = {
      shortcut: 0,
      selected: true,

      update: () => 0,
      cancel: () => 0
    }

    TestBed.configureTestingModule({
      providers: [{provide: InputObserver, useValue: observerStub}]
    });

    service = new KeyboardHandlerService();
  });

  it('should be created', () => {
    const service: KeyboardHandlerService = TestBed.get(KeyboardHandlerService);
    expect(service).toBeTruthy();
  });


  it('should properly add tool observers', () => {
    
    const obs = observerStub;
    service.addToolObserver(obs);
    expect(service.toolObservers.length).toBe(1); // adding only 1 tool observer to the arrays
    expect(service.toolshortcuts.length).toBe(1);
  });

  it('should call an update function on all tool observers',() => {
    const LEN = 10; 
    for(let i = 0; i < LEN; ++i){ // declares an array of 10 elements
      service.toolObservers.push(observerStub);
    }

    const spy = spyOn(observerStub, "update");
    service.updateToolObservers();
    expect(spy).toHaveBeenCalledTimes(LEN);

  });

  it('should refresh tool selection after valid shortcut selection', () => {
    const LEN = 10; 
    for(let i = 0; i < LEN; ++i){ // declares an array of 10 elements
      service.toolObservers.push(observerStub);
    }
    const goodShortcut = 0;
    service.keyCode = goodShortcut;
    service.toolshortcuts.push(goodShortcut);
    const spy = spyOn(observerStub, "cancel");
    service.checkForToolChange();

    expect(spy).toHaveBeenCalledTimes(LEN);
   
  });

  it('should select the right tool on valid shortcut', () => {
    const LEN = 10; 
    for(let i = 0; i < LEN; ++i){ // declares an array of 10 elements
      service.toolObservers.push(observerStub);
    }
    const goodShortcut = 0;
    service.keyCode = goodShortcut;
    service.checkForToolChange();

    expect(service.toolObservers[0].selected).toBeTruthy();
  });

  it('should not update tool selection on invalid keycode', () => {
    const badKey = -1;
    service.keyCode = badKey;

    const LEN = 10; 
    for(let i = 0; i < LEN; ++i){ // declares an array of 10 elements
      service.toolObservers.push(observerStub);
    }

    service.checkForToolChange();

    const spy = spyOn(service.toolshortcuts, "indexOf");

    expect(spy).not.toHaveBeenCalled(); //array not accessed -> no update

  });

  

  it("should get the key information and the observers must be updated and the change check is done", ()=>{
      
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
    
    expect(spyUpdate).toHaveBeenCalled();
  });

  /*it('on reset the keyboard attributes are reseted and the tools have been updated',()=>{
    
    const spyUpdate = spyOn(service, 'updateToolObservers');
    //let initMethod = typeof keyboardEvent.initKeyboardEvent !== 'undefined' ? "initKeyboardEvent" : "initKeyEvent";
    let mockKey : KeyboardEvent = new KeyboardEvent("keyup",{
      key: "Shift",
      ctrlKey: false,
      shiftKey: true,
      //keyCode: 17,
    })
    service.logkey(mockKey);
    service.reset(mockKey);
    expect(service.keyString).toBe('');
    expect(service.keyCode).toBe(-1);
    //expect(service.ctrlDown).toBeFalsy();
    expect(service.shiftDown).toBeFalsy();
    expect(spyUpdate).toHaveBeenCalled();
  });*/

 /* it('on update call the update fuction of the observers is called', ()=>{
    let prog = new HTMLElement();
    prog.innerHTML = "";
    let draw = new HTMLElement();
    draw.innerHTML = "";
    const service: KeyboardHandlerService= new KeyboardHandlerService();
    const observer: InputObserver = new PencilService(prog, draw, true,1,"blue", 2, new InteractionService(), new ColorPickingService(new ColorConvertingService()));
    // to add the observer initialised to the KeyboardHandler object created
    service.addToolObserver(observer);
    //const observers = service.toolObservers;
    const spyObj = spyOn(observer,'update')
    service.updateToolObservers();
    expect(spyObj).toHaveBeenCalled();
  })*/
  
  // one last test todo 
  /*it('on checkForToolChange the attribute selected for the corresponding tool is true',()=>{

  })
  */
});
