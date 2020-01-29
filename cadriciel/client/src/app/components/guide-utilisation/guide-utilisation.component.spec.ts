import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GuideUtilisationComponent } from './guide-utilisation.component';
import { MatDialogModule } from '@angular/material';

describe('GuideUtilisationComponent', () => {
  let component: GuideUtilisationComponent;
  let fixture: ComponentFixture<GuideUtilisationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GuideUtilisationComponent ],
      imports: [ MatDialogModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuideUtilisationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
