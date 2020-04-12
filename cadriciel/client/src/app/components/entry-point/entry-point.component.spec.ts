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
  it('should call the statements on continuing a doodle', () => {
    const SPY = spyOn(component, 'continue');
    const NAME = 'Continuer';
    component.execute(NAME);
    expect(SPY).toHaveBeenCalled();
  });
  it('should call continue auto save of continue drawing', () => {
    // tslint:disable-next-line: no-string-literal
    const SPY = spyOn(component['drawing'], 'continueAutoSavedFromEntryPoint');
    component.continue();
    expect(SPY).toHaveBeenCalled();
  });
  it('should set the drawing exist attribute to false', () => {
    localStorage.clear();
    component.getDrawingExist();
    expect(component.drawingExist).toBeFalsy();
  });
  it('should set the drawing exist attribute to true because all the elements exist', () => {
    const MAX = 6;
    localStorage.clear();
    localStorage.setItem('height', '780');
    localStorage.setItem('width', '1500');
    localStorage.setItem('color', 'ff00ff');
    for (let i = 0; i < MAX; ++i) {
      localStorage.setItem('htmElem' + i.toString(), 'hello');
    }
    component.getDrawingExist();
    expect(component.drawingExist).toBeTruthy();
    localStorage.clear();
  });
  it('should return true because the elemets in the local storage are the init values', () => {
    const MAX = 6;
    localStorage.clear();
    localStorage.setItem('height', '775');
    localStorage.setItem('width', '1438');
    localStorage.setItem('color', 'ffffff');
    for (let i = 0; i < MAX; ++i) {
      localStorage.setItem('htmlElem' + i.toString(), '');
    }
    expect(component.checkInitValues()).toBeTruthy();
    localStorage.clear();
  });
  it('should return false because the drawing is not empty', () => {
    localStorage.clear();
    localStorage.setItem('height', '775');
    localStorage.setItem('width', '1438');
    localStorage.setItem('color', 'ffffff');
    localStorage.setItem('htmlElem3', 'hello');
    expect(component.checkInitValues()).toBeFalsy();
    localStorage.clear();
  });
  it('should return false because the local storage is empty', () => {
    localStorage.clear();
    expect(component.checkInitValues()).toBeFalsy();
  });
});
