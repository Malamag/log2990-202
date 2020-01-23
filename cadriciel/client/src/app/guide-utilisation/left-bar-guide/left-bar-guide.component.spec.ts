import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeftBarGuideComponent } from './left-bar-guide.component';

describe('LeftBarGuideComponent', () => {
  let component: LeftBarGuideComponent;
  let fixture: ComponentFixture<LeftBarGuideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeftBarGuideComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeftBarGuideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
