import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';


@Component({
  selector: 'app-new-draw',
  templateUrl: './new-draw.component.html',
  styleUrls: ['./new-draw.component.scss']
})
export class NewDrawComponent implements OnInit {

  newDrawForm: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.newDrawForm = this.formBuilder.group({
      canvWidth: [''], // TODO: ajouter validators
      canvHeight: [''],
      canvColor: ['']
    });
  }

  onSubmit() {
    console.log(this.newDrawForm.value);
  }

}
