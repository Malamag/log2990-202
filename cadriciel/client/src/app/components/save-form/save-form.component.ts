import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { AfterContentInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { DoodleFetchService } from 'src/app/services/doodle-fetch/doodle-fetch.service';
import { IndexService } from 'src/app/services/index/index.service';
import { ModalWindowService } from 'src/app/services/window-handler/modal-window.service';
import { ImageData } from '../../../../../image-data';

const LABELS_NUMBER_CAP = 20;

@Component({
  selector: 'app-save-form',
  templateUrl: './save-form.component.html',
  styleUrls: ['./save-form.component.scss']
})

export class SaveFormComponent implements OnInit, AfterContentInit {
  saveForm: FormGroup;
  constructor(
    private winService: ModalWindowService,
    private formBuilder: FormBuilder,
    private doodleFetch: DoodleFetchService,
    private index: IndexService) { }
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

  ngOnInit(): void {
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

  ngAfterContentInit(): void {
    this.doodle = this.doodleFetch.getDrawingWithoutGrid();
  }

  blockEvent(ev: KeyboardEvent): void {
    ev.stopPropagation();
  }
  initForm(): void {
    this.saveForm = this.formBuilder.group({
      doodleName: ['Dessin sans titre', Validators.required],
    });
  }

  add(event: MatChipInputEvent): void {
    const INPUT = event.input;
    const VALUE = event.value;
    this.containsSymbols = this.format.test(event.value);
    this.labelsIsFull = this.labels.length >= LABELS_NUMBER_CAP;

    if ((VALUE || '').trim() && !this.containsSymbols && !this.labelsIsFull) {
      this.labels.push(VALUE.trim());
    }

    if (INPUT) {
      INPUT.value = '';
    }
  }

  remove(label: string): void {
    const INDEX = this.labels.indexOf(label);

    if (INDEX >= 0) {
      this.labels.splice(INDEX, 1);
    }
    this.labelsIsFull = this.labels.length >= LABELS_NUMBER_CAP;
  }
  saveImage(): void {
    const ID: string = new Date().getUTCMilliseconds() + '';
    const DOODLE_STRING = this.doodleFetch.getDrawingDataNoGrid();
    const IMAGE_DATA: ImageData = { id: ID, name: this.saveForm.value.doodleName, tags: this.labels, svgElement: DOODLE_STRING };
    this.index.saveImage(IMAGE_DATA);
    this.winService.closeWindow();

  }
  closeForm(): void {
    this.winService.closeWindow();
  }

}
