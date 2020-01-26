import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CanvasBuilderService } from '../../services/services/drawing/canvas-builder.service';
import { ModalWindowService } from 'src/app/services/modal-window.service';

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
              private winService: ModalWindowService) {
               
   }

  ngOnInit() {
    this.initForm();
    this.width = this.canvasBuilder.getDefWidth();
    this.height = this.canvasBuilder.getDefHeight();
    this.color = this.canvasBuilder.getDefColor();
  }

  initForm() {
    this.newDrawForm = this.formBuilder.group({
      canvWidth: ['', [Validators.pattern(/^\d+$/), Validators.min(1)]], // accepts only positive integers
      canvHeight: ['', [Validators.pattern(/^\d+$/), Validators.min(1)]], 
      canvColor: ['', Validators.pattern(/^[a-fA-F0-9]{6}$/)]
    });
  }

  onSubmit() {
    const values = this.newDrawForm.value;

    const newDraw = this.canvasBuilder.getCanvasFromForm(
      +values.canvWidth,
      +values.canvHeight,
      values.canvColor
    );
    console.log(newDraw);
    this.closeModalForm();
  }
  
  closeModalForm() {
    this.winService.closeWindow();
  }

}
