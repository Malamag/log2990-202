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
    const formSpy = jasmine.createSpy('NewDrawComponent');
    const guideSpy = jasmine.createSpy('UserManualComponent');
    TestBed.configureTestingModule({
      imports: [MatDialogModule],
      providers: [
        {provide: MatDialog, useClass: MatDialog},
        {provide: NewDrawComponent, useValue: formSpy},
        {provide: UserManualComponent, useValue: guideSpy}
      ]
    });
    dialog = TestBed.get(MatDialog);
    service = TestBed.get(ModalWindowService);

    formComponentSpy = TestBed.get(NewDrawComponent);
    guideComponentSpy = TestBed.get(UserManualComponent);
  });

  it('should be created', () => {
    const testService: ModalWindowService = TestBed.get(ModalWindowService);
    expect(testService).toBeTruthy();
  });

  it('should be able to open a new draw form modal window', () => {
    const spy = spyOn(dialog, 'open');
    service.openWindow(NewDrawComponent);
    expect(spy).toHaveBeenCalled();

    expect(formComponentSpy).toBeDefined();

  });

  it('should be able to open a user manual modal window', () => {
    const spy = spyOn(dialog, 'open');
    service.openWindow(UserManualComponent);
    expect(spy).toHaveBeenCalled();

    expect(guideComponentSpy).toBeDefined();

  });

  it('should be able to close a modal window', () => {
    const spy = spyOn(dialog, 'closeAll');
    service.closeWindow();
    expect(spy).toHaveBeenCalled();
  });

  it('should never have an undefined MatDialogConfig', () => {
    expect(service.dialogConfig).toBeDefined();
  });
});
