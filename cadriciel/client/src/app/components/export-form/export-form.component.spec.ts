import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatButtonModule,
  MatDialogModule,
  MatFormFieldModule,
  MatInputModule,
  MatOptionModule,
  MatSelectModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ExportFormComponent } from './export-form.component';

import { DoodleFetchService } from 'src/app/services/doodle-fetch/doodle-fetch.service';
import { SvgDrawComponent } from '../draw-view/svg-draw/svg-draw.component';

describe('ExportFormComponent', () => {
  let component: ExportFormComponent;
  let fixture: ComponentFixture<ExportFormComponent>;
  let dFetchStub: any;

  beforeEach(async(() => {

    dFetchStub = {
      askForDoodle: () => 0,
      getDrawing: () => undefined
    }

    TestBed.configureTestingModule({
      declarations: [ ExportFormComponent, SvgDrawComponent ],
      imports: [
        MatDialogModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        FormsModule,
        BrowserAnimationsModule,
        MatInputModule,
        MatButtonModule,
        MatDialogModule,
        MatOptionModule,
        MatSelectModule
      ],
      providers: [
        {provide: DoodleFetchService, useValue: dFetchStub}
      ]

    })
    .compileComponents();
  }));

  beforeEach(() => {
    dFetchStub.askForDoodle();
    fixture = TestBed.createComponent(ExportFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {

    expect(component).toBeTruthy();
  });
});
