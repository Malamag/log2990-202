import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { AfterContentInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { DoodleFetchService } from 'src/app/services/doodle-fetch/doodle-fetch.service';
import { IndexService } from 'src/app/services/index/index.service';
import { ModalWindowService } from 'src/app/services/window-handler/modal-window.service';
import { ImageData } from '../../image-data';

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
    public doodleFetch: DoodleFetchService,
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
    const input = event.input;
    const value = event.value;
    this.containsSymbols = this.format.test(event.value);
    this.labelsIsFull = this.labels.length >= LABELS_NUMBER_CAP;

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
    this.labelsIsFull = this.labels.length >= LABELS_NUMBER_CAP;
  }
  saveImage(): void {
    const id: string = new Date().getUTCMilliseconds() + '';
    const doodleString = this.doodleFetch.getDrawingStringNoGrid();
    const imageData: ImageData = { id, name: this.saveForm.value.doodleName, tags: this.labels, svgElement: doodleString };
    this.index.saveImage(imageData);
    this.winService.closeWindow();

  }
  closeForm(): void {
    this.winService.closeWindow();
  }

}
