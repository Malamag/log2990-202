import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorFormComponent } from './color-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { 
  MatFormFieldModule,
  MatInputModule,
  MatSliderModule} from '@angular/material'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('ColorFormComponent', () => {
  let component: ColorFormComponent;
  let fixture: ComponentFixture<ColorFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColorFormComponent ],
      imports: [
        FormsModule, 
        MatFormFieldModule, 
        MatInputModule, 
        MatSliderModule, 
        ReactiveFormsModule,
        BrowserAnimationsModule]
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
