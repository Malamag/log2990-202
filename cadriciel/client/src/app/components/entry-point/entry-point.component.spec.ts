import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntryPointComponent } from './entry-point.component';
import { MatFormFieldModule, MatIconModule, MatSnackBarModule, MatButtonModule } from '@angular/material';
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
        MatButtonModule
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
});
