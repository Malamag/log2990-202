import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ColorConvertingService } from 'src/app/services/colorPicker/color-converting.service';
import { ModalWindowService } from 'src/app/services/window-handler/modal-window.service';
import { CanvasBuilderService } from '../../services/new-doodle/canvas-builder.service';
import { colorData } from '../color-picker/color-data';

@Component({
  selector: 'app-new-draw',
  templateUrl: './new-draw.component.html',
  styleUrls: ['./new-draw.component.scss'],
})
export class NewDrawComponent implements OnInit {
  paletteArray = this.canvasBuilder.getPalleteAttributes();

  newDrawForm: FormGroup;
  width: number;
  height: number;
  color: string;
  cData = colorData;
  offsetY = 10;
  offsetX = 25;
  svMaxValue = 100;
  hueCursorWidth = 6;
  hue = 0;
  saturation = 0;
  value = 100;
  svCursorPos = { x: this.saturation, y: this.svMaxValue - this.value };
  isHueSelecting = false;
  isSVSelecting = false;
  inputEntered: boolean;

  constructor(private formBuilder: FormBuilder,
    private canvasBuilder: CanvasBuilderService,
    private winService: ModalWindowService,
    private router: Router,
    private colorConvert: ColorConvertingService) {

  }

  ngOnInit() {
    this.initForm();
    this.resizeCanvas();
    this.color = this.canvasBuilder.getDefColor();
    this.inputEntered = true;
    window.addEventListener('resize', () => {
      if (this.inputEntered) {
        this.resizeCanvas();
      }
    });
  }

  blockEvent(ev: KeyboardEvent) {
    ev.stopPropagation();

    this.inputEntered = false;
  }

  resizeCanvas() {
    this.width = this.canvasBuilder.getDefWidth();
    this.height = this.canvasBuilder.getDefHeight();
  }

  initForm() {
    this.newDrawForm = this.formBuilder.group({
      canvWidth: ['', [Validators.pattern(/^\d+$/), Validators.min(1)]], // accepts only positive integers
      canvHeight: ['', [Validators.pattern(/^\d+$/), Validators.min(1)]],
      canvColor: ['', Validators.pattern(/^[a-fA-F0-9]{6}$/)], // only accepts 6-chars strings made of hex characters
    });

    this.newDrawForm.setValue({
      canvWidth: this.canvasBuilder.getDefWidth(),
      canvHeight: this.canvasBuilder.getDefHeight(),
      canvColor: this.canvasBuilder.getDefColor()
    });
  }

  onSubmit() {
    const values = this.newDrawForm.value;
    this.canvasBuilder.setCanvasFromForm(+values.canvWidth, +values.canvHeight, values.canvColor);
    this.canvasBuilder.emitCanvas();
    this.closeModalForm();
    this.router.navigate(['/vue']);

    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 15); // waits for the canvas to be created
  }

  closeModalForm() {
    this.winService.closeWindow();
  }

  get canvHeight() { // basic accessors to get individual input validity in html
    return this.newDrawForm.get('canvHeight');
  }

  get canvWidth() {
    return this.newDrawForm.get('canvWidth');
  }

  get canvColor() {
    return this.newDrawForm.get('canvColor');
  }

  updateColor() {
    this.color = this.hsvToHex(this.hue, this.saturation / this.svMaxValue, this.value / this.svMaxValue).slice(1); // removes the '#'
    this.newDrawForm.patchValue({ canvColor: this.color }); // updates value for form
  }

  onMouseDownHue(event: MouseEvent) {
    this.isHueSelecting = true;
    this.hueSelect(event);
  }
  onMouseDownSV(event: MouseEvent) {
    this.isSVSelecting = true;
    this.svSelect(event);
  }
  onMouseUp() {
    this.isHueSelecting = false;
    this.isSVSelecting = false;
  }
  hueSelect(event: MouseEvent) {
    if (this.isHueSelecting) {
      this.hue = Math.round((event.offsetY - this.offsetY) * (this.cData.MAX_HUE_VALUE / this.svMaxValue));
      this.updateColor();
    }
  }
  svSelect(event: MouseEvent) {
    if (this.isSVSelecting) {
      this.saturation = event.offsetX - this.offsetX;
      this.value = this.svMaxValue - (event.offsetY - this.offsetY);
      this.updateColor();
    }
  }
  hsvToHex(H: number, S: number, V: number): string {
    let hex = '';
    const rgb: number[] = [-1, -1, -1];

    const C: number = S * V;
    const X: number = C * (1 - Math.abs(((H / (this.cData.MAX_HUE_VALUE / 6)) % 2) - 1));
    const m: number = V - C;

    let R: number = this.cData.MIN_RGB_VALUE;
    let G: number = this.cData.MIN_RGB_VALUE;
    let B: number = this.cData.MIN_RGB_VALUE;

    // Math formula for conversion
    if (this.cData.MIN_HUE_VALUE <= H && H < this.cData.MAX_HUE_VALUE / 6) {
      R = C;
      G = X;
      B = this.cData.MIN_RGB_VALUE;
    } else if (this.cData.MAX_HUE_VALUE / 6 <= H && H < this.cData.MAX_HUE_VALUE / 3) {
      R = X;
      G = C;
      B = this.cData.MIN_RGB_VALUE;
    } else if (this.cData.MAX_HUE_VALUE / 3 <= H && H < this.cData.MAX_HUE_VALUE / 2) {
      R = this.cData.MIN_RGB_VALUE;
      G = C;
      B = X;
    } else if (this.cData.MAX_HUE_VALUE / 2 <= H && H < (2 * this.cData.MAX_HUE_VALUE) / 3) {
      R = this.cData.MIN_RGB_VALUE;
      G = X;
      B = C;
    } else if ((2 * this.cData.MAX_HUE_VALUE) / 3 <= H && H < (5 * this.cData.MAX_HUE_VALUE) / 6) {
      R = X;
      G = this.cData.MIN_RGB_VALUE;
      B = C;
    } else if ((5 * this.cData.MAX_HUE_VALUE) / 6 <= H && H < this.cData.MAX_HUE_VALUE) {
      R = C;
      G = this.cData.MIN_RGB_VALUE;
      B = X;
    }
    rgb[0] = Math.round((R + m) * this.cData.MAX_RGB_VALUE);
    rgb[1] = Math.round((G + m) * this.cData.MAX_RGB_VALUE);
    rgb[2] = Math.round((B + m) * this.cData.MAX_RGB_VALUE);

    hex = '#' + this.colorConvert.rgbToHex(rgb[0]) + this.colorConvert.rgbToHex(rgb[1]) + this.colorConvert.rgbToHex(rgb[2]);
    return hex;
  }
  get hueCursorStyles(): any {
    return { transform: 'translateY(' + ((Math.round(this.hue * (this.svMaxValue / this.cData.MAX_HUE_VALUE))) + (this.offsetY - this.hueCursorWidth / 2)) + 'px)' };
  }

  get svCursorStyles(): any {
    return { transform: 'translate(' + this.saturation + 'px,' + (this.svMaxValue - this.value) + 'px)' };
  }
}
