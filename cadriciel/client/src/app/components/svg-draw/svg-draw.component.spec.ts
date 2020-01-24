import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgDrawComponent } from './svg-draw.component';

describe('SvgDrawComponent', () => {
  let component: SvgDrawComponent;
  let fixture: ComponentFixture<SvgDrawComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SvgDrawComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SvgDrawComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
