import { Component, OnInit } from '@angular/core';
import {colorData} from '../color-data';
import { ColorPickingService } from 'src/app/services/services/colorPicker/color-picking.service';

@Component({
  selector: 'app-color-form',
  templateUrl: './color-form.component.html',
  styleUrls: ['./color-form.component.scss']
})
export class ColorFormComponent implements OnInit {
  cData = colorData;
  constructor(private colorPicking: ColorPickingService) { }

  ngOnInit() {
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

}
