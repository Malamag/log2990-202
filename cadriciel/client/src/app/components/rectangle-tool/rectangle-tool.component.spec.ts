import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RectangleToolComponent } from './rectangle-tool.component';

describe('RectangleToolComponent', () => {
  let component: RectangleToolComponent;
  let fixture: ComponentFixture<RectangleToolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RectangleToolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RectangleToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
