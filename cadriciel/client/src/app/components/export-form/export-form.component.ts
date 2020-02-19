import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';

interface Formats {
  type: string,
  view: string
}

@Component({
  selector: 'app-export-form',
  templateUrl: './export-form.component.html',
  styleUrls: ['./export-form.component.scss']
})
export class ExportFormComponent implements OnInit, AfterViewInit {
  formats: Formats[] = [
    {type: "jpeg", view: ".jpeg"},
    {type: "png", view: ".png"},
    {type: "svg", view: ".svg"}
  ];
  
  @ViewChild('imgBox', {static:false}) export: ElementRef; // has an eye on the <canvas> element

  constructor(private formBuilder: FormBuilder) { }
  
  exportForm: FormGroup;

  ngOnInit() {
    // get the element
    this.initForm();
    
  }

  initForm() {
    this.exportForm = this.formBuilder.group({
      doodleName:['Dessin sans titre', Validators.required],
      formatSel: ['', Validators.required]
    })
  }

  ngAfterViewInit() {
  }

  onSubmit() {
    const FORMVAL = this.exportForm.value;
    console.log(FORMVAL);

  }



}
