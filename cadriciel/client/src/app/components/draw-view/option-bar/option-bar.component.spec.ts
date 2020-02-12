import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MatButtonModule,
  MatDialog,
  MatIconModule,
  MatToolbarModule,
  MatTooltipModule} from '@angular/material';

import { KeyboardHandlerService } from 'src/app/services/keyboard-handler/keyboard-handler.service';
import { InteractionService } from 'src/app/services/service-interaction/interaction.service';
import { ModalWindowService } from 'src/app/services/window-handler/modal-window.service';
import { NewDrawComponent } from '../../new-draw/new-draw.component';
import { OptionBarComponent } from './option-bar.component';

describe('OptionBarComponent', () => {
  let component: OptionBarComponent;
  let fixture: ComponentFixture<OptionBarComponent>;
  let winServiceStub: any;
  let kbService: KeyboardHandlerService;
  let fakeKbEvent: any;

  beforeEach(async(() => {
    winServiceStub = {
      openWindow: () => 0

    }

     // that way, we will make sure the event corresponds to the handler's expectations
    fakeKbEvent = {
      ctrlKey: true,
      keyCode: 79,
      key: 'o',
      preventDefault: () => 0
    }

    TestBed.configureTestingModule({
      declarations: [ OptionBarComponent ],
      imports: [MatButtonModule, MatToolbarModule, MatIconModule, MatTooltipModule],
      providers: [{provide: MatDialog},
                  {provide: ModalWindowService, useValue: winServiceStub },
                  {provide: kbService, useValue: KeyboardHandlerService},
                  {provide: KeyboardEvent, useValue: fakeKbEvent}]
    })
    .compileComponents();

    window.confirm = () => true; // skips the confirmation box for the test
    kbService = TestBed.get(KeyboardHandlerService);

  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OptionBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add observers on construction', () => {
    const spy = spyOn(window, 'addEventListener');
    new OptionBarComponent(winServiceStub, new InteractionService()); // testing in the constructor
    expect(spy).toHaveBeenCalled();
  });

  it('should open the new form modal window on ctrl+o', () => {
    const spyObj: jasmine.SpyObj<OptionBarComponent> = jasmine.createSpyObj('OptionBarComponent', ['setShortcutEvent']);
    spyObj.setShortcutEvent.and.callFake(() => {
      component.winService.openWindow(NewDrawComponent);
    });
    const spy = spyOn(component.winService, 'openWindow');
    component.openNewDrawForm();
    expect(spy).toHaveBeenCalled();
  });

  it ('should open a modal window for the user guide', () => {
    component.winService.openWindow = () => 0; // fake window opener
    const spy = spyOn(component.winService, 'openWindow');
    component.openUserGuide();
    expect(spy).toHaveBeenCalled();
  })

  it('should emit a boolean using the observer', () => {
    const spy = spyOn(component.interaction, 'emitCancel')
    component.sendSigKill()
    expect(spy).toHaveBeenCalled()
  })

  it ('should open a modal for the new draw form window', () => {
    const spyObj: jasmine.SpyObj<OptionBarComponent> = jasmine.createSpyObj('OptionBarComponent', ['openNewDrawForm']);
    spyObj.openNewDrawForm.and.callFake(() => {
      component.winService.openWindow(NewDrawComponent); //  to skip the confirm window
    });
    const spy = spyOn(component.winService, 'openWindow');
    component.openNewDrawForm();
    expect(spy).toHaveBeenCalled();
  });

  it('should call a new draw form on shortcut', () => {
    const spy = spyOn(component, 'openNewDrawForm');
    component.setShortcutEvent(fakeKbEvent);
    expect(spy).toHaveBeenCalled();
  });

  it('shortcut verif should be called on new ev listener', () => {
    const spy = spyOn(component, 'setShortcutEvent');
    const ev = new KeyboardEvent('keydown');
    window.dispatchEvent(ev);
    expect(spy).toHaveBeenCalledWith(ev);
  });
});
