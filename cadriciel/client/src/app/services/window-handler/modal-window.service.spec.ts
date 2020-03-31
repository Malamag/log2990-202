import { TestBed } from '@angular/core/testing';

import { MatDialog, MatDialogModule } from '@angular/material';
import { NewDrawComponent } from 'src/app/components/new-draw/new-draw.component';
import { UserManualComponent } from 'src/app/components/user-manual/user-manual.component';
import { ModalWindowService } from './modal-window.service';

describe('ModalWindowService', () => {
  let service: ModalWindowService;
  let dialog: MatDialog;

  let formComponentSpy: jasmine.SpyObj<NewDrawComponent>;
  let guideComponentSpy: jasmine.SpyObj<UserManualComponent>;

  beforeEach(() => {
    const FORM_SPY = jasmine.createSpy('NewDrawComponent');
    const GUIDE_SPY = jasmine.createSpy('UserManualComponent');
    TestBed.configureTestingModule({
      imports: [MatDialogModule],
      providers: [
        {provide: MatDialog, useClass: MatDialog},
        {provide: NewDrawComponent, useValue: FORM_SPY},
        {provide: UserManualComponent, useValue: GUIDE_SPY}
      ]
    });
    dialog = TestBed.get(MatDialog);
    service = TestBed.get(ModalWindowService);

    formComponentSpy = TestBed.get(NewDrawComponent);
    guideComponentSpy = TestBed.get(UserManualComponent);
  });

  it('should be created', () => {
    const TEST_SERVICE: ModalWindowService = TestBed.get(ModalWindowService);
    expect(TEST_SERVICE).toBeTruthy();
  });

  it('should be able to open a new draw form modal window', () => {
    const SPY = spyOn(dialog, 'open');
    service.openWindow(NewDrawComponent);
    expect(SPY).toHaveBeenCalled();

    expect(formComponentSpy).toBeDefined();

  });

  it('should be able to open a user manual modal window', () => {
    const SPY = spyOn(dialog, 'open');
    service.openWindow(UserManualComponent);
    expect(SPY).toHaveBeenCalled();

    expect(guideComponentSpy).toBeDefined();

  });

  it('should be able to close a modal window', () => {
    const SPY = spyOn(dialog, 'closeAll');
    service.closeWindow();
    expect(SPY).toHaveBeenCalled();
  });

  it('should never have an undefined MatDialogConfig', () => {
    expect(service.dialogConfig).toBeDefined();
  });
});
