import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserManualComponent } from './user-manual.component';
import { MatDialogModule, MatButtonModule, MatIconModule, MatDialogRef } from '@angular/material';
import { UserManualContentComponent } from './user-manual-content/user-manual-content.component';

describe('UserManualComponent', () => {
  let component: UserManualComponent;
  let fixture: ComponentFixture<UserManualComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserManualComponent, UserManualContentComponent ],
      imports: [ MatDialogModule, MatButtonModule, MatIconModule ],
      providers: [{provide: MatDialogRef}]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserManualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
