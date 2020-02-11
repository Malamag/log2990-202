import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MatButtonModule, 
  MatToolbarModule, 
  MatIconModule, 
  MatTooltipModule,
  MatDialog} from '@angular/material';

import { OptionBarComponent } from './option-bar.component';
import { ModalWindowService } from 'src/app/services/window-handler/modal-window.service';
import { InteractionService } from 'src/app/services/service-interaction/interaction.service';
import { KeyboardHandlerService } from 'src/app/services/keyboard-handler/keyboard-handler.service';

describe('OptionBarComponent', () => {
  let component: OptionBarComponent;
  let fixture: ComponentFixture<OptionBarComponent>;
  let winServiceStub:any;
  let kbHandlerStub:any;
  let fakeKbEvent:any;
  

  beforeEach(async(() => {
    winServiceStub = {
      openWindow:()=>0

    }

    kbHandlerStub = { // testing for ctrl+o shortcut
      ctrlDown: true,
      keyCode: 79, // letter o
      key: 'o'
    }

    fakeKbEvent = kbHandlerStub; // that way, we will make sure the event corresponds to the handler's expectations


    TestBed.configureTestingModule({
      declarations: [ OptionBarComponent ],
      imports: [MatButtonModule, MatToolbarModule, MatIconModule, MatTooltipModule],
      providers: [{provide: MatDialog},
                  {provide: ModalWindowService, useValue: winServiceStub },
                  {provide: KeyboardHandlerService, useValue: kbHandlerStub},
                  {provide: KeyboardEvent, useValue: fakeKbEvent}]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OptionBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add observers on construction', ()=>{
    const spy = spyOn(window, "addEventListener");
    new OptionBarComponent(winServiceStub, new InteractionService()); // testing in the constructor
    expect(spy).toHaveBeenCalled();
  });

  it('should open the new form modal window on ctrl+o', ()=>{
    component.winService.openWindow = ()=>0; // fake window opener
    const spy = spyOn(component.winService, "openWindow");
    window.confirm=()=>true; // fake response
    component.setShorctutEvent(fakeKbEvent);
    expect(spy).toHaveBeenCalled();
  });

  it ('should open a modal window for the user guide',()=>{
    component.winService.openWindow = ()=>0; // fake window opener
    const spy = spyOn(component.winService,'openWindow');
    component.openUserGuide();
    expect(spy).toHaveBeenCalled();
  })

  it('should emit a boolean using the observer',()=>{
    const spy = spyOn(component.interaction,'emitCancel')
    component.sendSigKill()
    expect(spy).toHaveBeenCalled()
  })

  it ('should open a modal for the new draw form window',()=>{
    component.winService.openWindow = ()=>0; // fake window opener
    const spy = spyOn(component.winService,'openWindow');
    window.confirm=()=>true; // we will always say yes! 
    component.openNewDrawForm();
    expect(spy).toHaveBeenCalled();
  });
});
