import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModalWindowService } from 'src/app/services/window-handler/modal-window.service';
import { DoodleFetchService } from 'src/app/services/doodle-fetch/doodle-fetch.service';
import { ExportService } from 'src/app/services/exportation/export.service';

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

  constructor(
    private formBuilder: FormBuilder,
    private winService: ModalWindowService,
    private doodleFetch: DoodleFetchService,
    private expService: ExportService) { }
  
  exportForm: FormGroup;
  doodle: SVGElement;

  cWidth: number; // attributes to get the correct export size
  cHeigth: number;

  ngOnInit() {
    this.initForm();
    this.doodleFetch.askForDoodle();
    this.cWidth = this.doodleFetch.widthAttr;
    this.cHeigth = this.doodleFetch.heightAttr;    
  }

  initForm() {
    this.exportForm = this.formBuilder.group({
      doodleName:['Dessin sans titre', Validators.required],
      formatSel: [null, Validators.required]
    });
  }
  
  ngAfterViewInit() {
    this.doodle = this.doodleFetch.getDrawing();
  }

  onSubmit() {
    const FORMVAL = this.exportForm.value;
  
    const TYPE = FORMVAL.formatSel;
    const NAME = FORMVAL.doodleName;

    this.exportation(NAME, TYPE);
    

    this.closeForm();
  }

  closeForm() {
    this.winService.closeWindow();
  }

  exportation(name: string, type: string) {
    this.expService.exportInCanvas(this.doodle, this.export, name, type);
  }


}
