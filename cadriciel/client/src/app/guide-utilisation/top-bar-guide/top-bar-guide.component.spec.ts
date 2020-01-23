import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopBarGuideComponent } from './top-bar-guide.component';

describe('TopBarGuideComponent', () => {
  let component: TopBarGuideComponent;
  let fixture: ComponentFixture<TopBarGuideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopBarGuideComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopBarGuideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
