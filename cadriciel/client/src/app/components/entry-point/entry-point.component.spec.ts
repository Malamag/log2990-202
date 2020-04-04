import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule, MatDialogModule, MatFormFieldModule, MatIconModule, MatSnackBarModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { GalleryComponent } from '../gallery/gallery.component';
import { NewDrawComponent } from '../new-draw/new-draw.component';
import { UserManualComponent } from '../user-manual/user-manual.component';
import { EntryPointComponent } from './entry-point.component';

describe('EntryPointComponent', () => {
  let component: EntryPointComponent;
  let fixture: ComponentFixture<EntryPointComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EntryPointComponent],
      imports:
        [MatFormFieldModule,
          MatIconModule,
          MatSnackBarModule,
          BrowserAnimationsModule,
          MatButtonModule,
          MatDialogModule,
          RouterTestingModule,
        ],

    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntryPointComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call the new draw form on click', () => {
    const NAME = 'Créer';
    const openForm = spyOn(component, 'openCreateNew');
    component.execute(NAME);
    expect(openForm).toHaveBeenCalled();
  });

  it('should open the user guide on click', () => {
    const NAME = 'Guide';
    const OPEN_GUIDE = spyOn(component, 'openUserManual');
    component.execute(NAME);
    expect(OPEN_GUIDE).toHaveBeenCalled();
  });

  it('should open a snack bar on initialisation', () => {
    const OPEN = spyOn(component, 'onOpen');
    component.ngOnInit(); // initialisation of entry point
    expect(OPEN).toHaveBeenCalled();
  });

  it('should use the window handler service to open the new draw form', () => {
    const WIN_SERVICE = component.winService;
    const SPY = spyOn(WIN_SERVICE, 'openWindow');
    component.openCreateNew();
    expect(SPY).toHaveBeenCalledWith(NewDrawComponent);
  });

  it('should use the window handler service to open the new draw form', () => {
    const WIN_SERVICE = component.winService;
    const SPY = spyOn(WIN_SERVICE, 'openWindow');
    component.openUserManual();
    expect(SPY).toHaveBeenCalledWith(UserManualComponent);
  });

  it('should not open any window on invalid input', () => {
    const INVALID = '';
    component.execute(INVALID);
    const FORM_SPY = spyOn(component, 'openCreateNew');
    const GUIDE_SPY = spyOn(component, 'openUserManual');
    expect(FORM_SPY).not.toHaveBeenCalled();
    expect(GUIDE_SPY).not.toHaveBeenCalled();
  });

  it('should open the gallery on proper shortcut name', () => {
    const NAME = 'Ouvrir';
    const SPY = spyOn(component, 'openGallery');
    component.execute(NAME);
    expect(SPY).toHaveBeenCalled();
  });

  it('should call the window service method to open the gallery', () => {
    const SPY = spyOn(component.winService, 'openWindow');
    component.openGallery();
    expect(SPY).toHaveBeenCalledWith(GalleryComponent);
  });

  /* This test is only a placeholder for further methods implemented in the execute func */
  it('should call the statements on continuing a doodle', () => {
    const SPY = spyOn(console, 'log');
    const NAME = 'Continuer';
    component.execute(NAME);
    expect(SPY).toHaveBeenCalledWith(NAME);
  });

});
