import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CanvasBuilderService } from '../../../services/services/drawing/canvas-builder.service';


@Component({
  selector: 'app-new-draw',
  templateUrl: './new-draw.component.html',
  styleUrls: ['./new-draw.component.scss']
})
export class NewDrawComponent implements OnInit {

  newDrawForm: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private canvasBuilder: CanvasBuilderService) { }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.newDrawForm = this.formBuilder.group({
      canvWidth: ['', this.canvasBuilder.isNumberValidator()], // TODO: ajouter validators
      canvHeight: ['', this.canvasBuilder.isNumberValidator()],
      canvColor: ['']
    });
  }

  onSubmit() {
    console.log(this.newDrawForm.value);
  }

}
