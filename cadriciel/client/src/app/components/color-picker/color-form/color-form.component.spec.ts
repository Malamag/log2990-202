import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorFormComponent } from './color-form.component';
import { FormsModule, FormBuilder } from '@angular/forms';
import { 
  MatFormFieldModule,
  MatInputModule,
  MatSliderModule} from '@angular/material'

describe('ColorFormComponent', () => {
  let component: ColorFormComponent;
  let fixture: ComponentFixture<ColorFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColorFormComponent ],
      imports: [FormsModule, MatFormFieldModule, MatInputModule, MatSliderModule],
      providers: [{provide:FormBuilder}]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColorFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
