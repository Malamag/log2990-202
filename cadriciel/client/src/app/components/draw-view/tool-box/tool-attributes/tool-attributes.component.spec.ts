import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolAttributesComponent } from './tool-attributes.component';
import {ColorPickerComponent} from '../../../color-picker/color-picker.component';
import {  
  MatFormFieldModule,
  MatIconModule, 
  MatToolbarModule,
  MatSliderModule,
  MatRadioModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ColorFormComponent } from 'src/app/components/color-picker/color-form/color-form.component';


describe('ToolAttributesComponent', () => {
  let component: ToolAttributesComponent;
  let fixture: ComponentFixture<ToolAttributesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ToolAttributesComponent, ColorPickerComponent , ColorFormComponent],
      imports: [
        MatSliderModule, 
        FormsModule,
        MatIconModule, 
        MatToolbarModule,
        MatSliderModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatRadioModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolAttributesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
