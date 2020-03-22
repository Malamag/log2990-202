import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ColorConvertingService } from 'src/app/services/colorPicker/color-converting.service';
import { ModalWindowService } from 'src/app/services/window-handler/modal-window.service';
import { CanvasBuilderService } from '../../services/new-doodle/canvas-builder.service';
import { colorData } from '../color-picker/color-data';

const OFFSET_Y = 10;
const OFFSET_X = 25;
const SV_MAX_VALUE = 100;
const CURSOR_WIDTH = 6;
const DEFAULT_VALUE = 100;
@Component({
  selector: 'app-new-draw',
  templateUrl: './new-draw.component.html',
  styleUrls: ['./new-draw.component.scss'],
})

export class NewDrawComponent implements OnInit {
  // tslint:disable-next-line: typedef
  cData = colorData;
  newDrawForm: FormGroup;
  width: number;
  height: number;
  color: string;
  offsetY: number;
  offsetX: number;
  svMaxValue: number;
  hueCursorWidth: number;
  hue: number;
  saturation: number;
  value: number;
  svCursorPos: {};
  isHueSelecting: boolean;
  isSVSelecting: boolean;
  inputEntered: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private canvasBuilder: CanvasBuilderService,
    private winService: ModalWindowService,
    private router: Router,
    private colorConvert: ColorConvertingService) {
    this.offsetY = OFFSET_Y;
    this.offsetX = OFFSET_X;
    this.svMaxValue = SV_MAX_VALUE;
    this.hueCursorWidth = CURSOR_WIDTH;
    this.hue = 0;
    this.saturation = 0;
    this.value = DEFAULT_VALUE;
    this.svCursorPos = { x: this.saturation, y: this.svMaxValue - this.value };
    this.isHueSelecting = false;
    this.isSVSelecting = false;
  }

  ngOnInit(): void {
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

  blockEvent(ev: KeyboardEvent): void {
    ev.stopPropagation();

    this.inputEntered = false;
  }

  resizeCanvas(): void {
    this.width = this.canvasBuilder.getDefWidth();
    this.height = this.canvasBuilder.getDefHeight();
  }

  initForm(): void {
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

  onSubmit(): void {
    const VALUES = this.newDrawForm.value;
    this.canvasBuilder.setCanvasFromForm(+VALUES.canvWidth, +VALUES.canvHeight, VALUES.canvColor);
    this.canvasBuilder.emitCanvas();
    this.closeModalForm();
    this.router.navigate(['/vue']);
    const LOAD_TIME = 15;
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, LOAD_TIME); // waits for the canvas to be created
  }

  closeModalForm(): void {
    this.winService.closeWindow();
  }

  get canvHeight(): AbstractControl | null { // basic accessors to get individual input validity in html
    return this.newDrawForm.get('canvHeight');
  }

  get canvWidth(): AbstractControl | null {
    return this.newDrawForm.get('canvWidth');
  }

  get canvColor(): AbstractControl | null {
    return this.newDrawForm.get('canvColor');
  }

  updateColor(): void {
    // slice (1) removes the '#'
    this.color = this.colorConvert.hsvToHex(this.hue, this.saturation / this.svMaxValue, this.value / this.svMaxValue).slice(1);
    this.newDrawForm.patchValue({ canvColor: this.color }); // updates value for form
  }

  onMouseDownHue(event: MouseEvent): void {
    this.isHueSelecting = true;
    this.hueSelect(event);
  }

  onMouseDownSV(event: MouseEvent): void {
    this.isSVSelecting = true;
    this.svSelect(event);
  }

  onMouseUp(): void {
    this.isHueSelecting = false;
    this.isSVSelecting = false;
  }

  hueSelect(event: MouseEvent): void {
    if (this.isHueSelecting) {
      this.hue = Math.round((event.offsetY - this.offsetY) * (this.cData.MAX_HUE_VALUE / this.svMaxValue));
      this.updateColor();
    }
  }

  svSelect(event: MouseEvent): void {
    if (this.isSVSelecting) {
      this.saturation = event.offsetX - this.offsetX;
      this.value = this.svMaxValue - (event.offsetY - this.offsetY);
      this.updateColor();
    }
  }

  get hueCursorStyles(): {} {
    return {
      transform: 'translateY(' +
        ((Math.round(this.hue * (this.svMaxValue / this.cData.MAX_HUE_VALUE))) +
          (this.offsetY - this.hueCursorWidth / 2)) + 'px)'
    };
  }

  get svCursorStyles(): {} {
    return { transform: 'translate(' + this.saturation + 'px,' + (this.svMaxValue - this.value) + 'px)' };
  }
}
