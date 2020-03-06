import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalWindowService } from 'src/app/services/window-handler/modal-window.service';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { DoodleFetchService } from 'src/app/services/doodle-fetch/doodle-fetch.service';
@Component({
  selector: 'app-save-form',
  templateUrl: './save-form.component.html',
  styleUrls: ['./save-form.component.scss']
})
export class SaveFormComponent implements OnInit {
  saveForm: FormGroup;
  constructor(private winService: ModalWindowService, private formBuilder: FormBuilder, private doodleFetch: DoodleFetchService,) { }
  readonly LabelsNumberCap :number = 20;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  labels: string[];
  selectable: boolean;
  removable: boolean;
  format: RegExp;
  containsSymbols: boolean;
  labelsIsFull: boolean;
  cWidth: number; // attributes to get the correct export size
  cHeigth: number;
  doodle: Node;
  ngOnInit() {
    this.initForm();
    this.labels = [];
    this.format = new RegExp(/[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/);
    this.selectable = true;
    this.removable = true;
    this.containsSymbols = false;
    this.labelsIsFull = false;
    this.doodleFetch.askForDoodle();
    this.cWidth = this.doodleFetch.widthAttr;
    this.cHeigth = this.doodleFetch.heightAttr;
  }

  ngAfterContentInit() {
    this.doodle = this.doodleFetch.getDrawingWithoutGrid();
}


  initForm() {
    this.saveForm = this.formBuilder.group({
      doodleName: ['Dessin sans titre', Validators.required],
    });
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    this.containsSymbols = this.format.test(event.value);
    this.labelsIsFull = this.labels.length >= this.LabelsNumberCap;
    
    if ((value || '').trim() && !this.containsSymbols && !this.labelsIsFull) {
      this.labels.push(value.trim());
    }

    if (input) {
      input.value = '';
    }
  }

  remove(label: string): void {
    const index = this.labels.indexOf(label);

    if (index >= 0) {
      this.labels.splice(index, 1);
    }
    this.labelsIsFull = this.labels.length >= this.LabelsNumberCap;
  }

  closeForm() {
    this.winService.closeWindow();
  }
}