import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalWindowService } from 'src/app/services/window-handler/modal-window.service';
import { CanvasBuilderService } from '../../services/new-doodle/canvas-builder.service';

@Component({
  selector: 'app-new-draw',
  templateUrl: './new-draw.component.html',
  styleUrls: ['./new-draw.component.scss'],
})

export class NewDrawComponent implements OnInit {
  // tslint:disable-next-line: typedef
  newDrawForm: FormGroup;
  width: number;
  height: number;
  color: string;
  inputEntered: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private canvasBuilder: CanvasBuilderService,
    private winService: ModalWindowService,
    private router: Router) {
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

  updateColor(color: string): void {
    this.color = color;
    this.newDrawForm.patchValue({ canvColor: this.color }); // updates value for form
  }

}
