import { Component, OnInit } from '@angular/core';
import {colorData} from '../color-data';
import { ColorPickingService } from 'src/app/services/services/colorPicker/color-picking.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';



@Component({
  selector: 'app-color-form',
  templateUrl: './color-form.component.html',
  styleUrls: ['./color-form.component.scss']
})
export class ColorFormComponent implements OnInit {
  cData = colorData;
  colorForm: FormGroup

  constructor(private colorPicking: ColorPickingService,
              private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.initForm();
  }

  initForm(): void {
    this.colorForm = this.formBuilder.group({
      red: ['', [Validators.required, Validators.pattern(/^[a-fA-F0-9]{2}$/)]],
      green: ['', [Validators.required, Validators.pattern(/^[a-fA-F0-9]{2}$/)]],
      blue: ['', [Validators.required, Validators.pattern(/^[a-fA-F0-9]{2}$/)]]
    });

    this.colorForm.setValue({
      red: this.cData.RedSliderInput,
      green: this.cData.GreenSliderInput,
      blue: this.cData.BlueSliderInput
    });
  }
      // Red left input change
  onRGBSliderInput() : void { 
    this.colorPicking.onRGBSliderInput();
  }

  onSLSliderInput() : void { 
    this.colorPicking.onSLSliderInput();
  }

  sliderAlphaChange() : void {
    this.colorPicking.sliderAlphaChange();
  }

  onSubmit(): void {
    //hex values
    //update
  }

}
