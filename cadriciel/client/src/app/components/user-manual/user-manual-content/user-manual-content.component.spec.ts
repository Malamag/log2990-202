import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserManualContentComponent } from './user-manual-content.component';
import { MatIconModule} from '@angular/material';

describe('UserManualContentComponent', () => {
  let component: UserManualContentComponent;
  let fixture: ComponentFixture<UserManualContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserManualContentComponent ],
      imports: [ MatIconModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserManualContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
