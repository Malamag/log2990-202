import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntryPointComponent } from './entry-point.component';
import { MatFormFieldModule, MatIconModule, MatSnackBarModule, MatButtonModule, MatDialogModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


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
      ]
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


});
