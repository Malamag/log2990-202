import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntryPointComponent } from './entry-point.component';
import { MatFormFieldModule, MatIconModule, MatSnackBarModule, MatButtonModule, MatDialogModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NewDrawComponent } from '../new-draw/new-draw.component';
import { UserManualComponent } from '../user-manual/user-manual.component';


describe('EntryPointComponent', () => {
  let component: EntryPointComponent;
  let fixture: ComponentFixture<EntryPointComponent>;
 

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EntryPointComponent ],
      imports: 
      [ MatFormFieldModule, 
        MatIconModule, 
        MatSnackBarModule, 
        BrowserAnimationsModule, 
        MatButtonModule,
        MatDialogModule
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
    const NAME = "Créer";
    const openForm = spyOn(component, "openCreateNew");
    component.execute(NAME);
    expect(openForm).toHaveBeenCalled();
  });


  it('should open the user guide on click', () => {
    const NAME = "Guide";
    const openGuide = spyOn(component, "openUserManual");
    component.execute(NAME);
    expect(openGuide).toHaveBeenCalled();
  });

  it('should open a snack bar on initialisation', () => {
    const open = spyOn(component, "onOpen");
    component.ngOnInit(); // initialisation of entry point
    expect(open).toHaveBeenCalled();
  });

  it('should use the window handler service to open the new draw form', () => {
    const winService = component.winService;
    const spy = spyOn(winService, "openWindow");
    component.openCreateNew();
    expect(spy).toHaveBeenCalledWith(NewDrawComponent);
  });

  it('should use the window handler service to open the new draw form', () => {
    const winService = component.winService;
    const spy = spyOn(winService, "openWindow");
    component.openUserManual();
    expect(spy).toHaveBeenCalledWith(UserManualComponent);
  });

  it('should not open any window on invalid input', () => {
    const INVALID:string = "";
    component.execute(INVALID);
    const formSpy = spyOn(component, "openCreateNew");
    const guideSpy = spyOn(component, "openUserManual");
    expect(formSpy).not.toHaveBeenCalled();
    expect(guideSpy).not.toHaveBeenCalled();
  });



});
