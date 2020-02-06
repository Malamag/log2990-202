import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolAttributesComponent } from './tool-attributes.component';
import {ColorPickerComponent} from '../../../color-picker/color-picker.component';
import { MatSliderModule } from '@angular/material';
import { FormsModule } from '@angular/forms';

describe('ToolAttributesComponent', () => {
  let component: ToolAttributesComponent;
  let fixture: ComponentFixture<ToolAttributesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ToolAttributesComponent, ColorPickerComponent ],
      imports: [MatSliderModule, FormsModule]
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
