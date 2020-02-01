import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { CanvasBuilderService } from '../../services/services/drawing/canvas-builder.service';
import { ModalWindowService } from 'src/app/services/modal-window.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-draw',
  templateUrl: './new-draw.component.html',
  styleUrls: ['./new-draw.component.scss']
})
export class NewDrawComponent implements OnInit {

  newDrawForm: FormGroup;
  width: number;
  height: number;
  color: string;

  constructor(private formBuilder: FormBuilder,
              private canvasBuilder: CanvasBuilderService,
              private winService: ModalWindowService,
              private router: Router) {
               
   }

  ngOnInit() {
    this.initForm();
    this.width = this.canvasBuilder.getDefWidth();
    this.height = this.canvasBuilder.getDefHeight();
    this.color = this.canvasBuilder.getDefColor();
  }

  initForm() {
    this.newDrawForm = this.formBuilder.group({
      'canvWidth':  new FormControl('', [Validators.pattern(/^\d+$/), Validators.min(1)]), // accepts only positive integers
      'canvHeight': new FormControl('', [Validators.pattern(/^\d+$/), Validators.min(1)]), 
      'canvColor': new FormControl('', Validators.pattern(/^[a-fA-F0-9]{6}$/)), // only accepts 6-chars strings made of hex characters
    });
  }

  onSubmit() {
    const values = this.newDrawForm.value;

    this.canvasBuilder.setCanvasFromForm(+values.canvWidth, +values.canvHeight,values.canvColor);
    this.canvasBuilder.emitCanvas();
    this.closeModalForm();
    this.router.navigate(["/vue"]);
  }
  
  closeModalForm() {
    this.winService.closeWindow();
  }

  get canvHeight() {
    return this.newDrawForm.get('canvHeight');
  }

  get canvWidth() {
    return this.newDrawForm.get('canvWidth');
  }

  get canvColor() {
    return this.newDrawForm.get('canvColor');
  }

}
