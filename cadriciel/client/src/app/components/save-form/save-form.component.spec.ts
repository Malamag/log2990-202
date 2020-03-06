import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveFormComponent } from './save-form.component';
import { FormBuilder } from '@angular/forms';
import { DoodleFetchService } from 'src/app/services/doodle-fetch/doodle-fetch.service';
import { ModalWindowService } from 'src/app/services/window-handler/modal-window.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatDialogModule } from '@angular/material';
//import { By } from '@angular/platform-browser';
fdescribe('SaveFormComponent', () => {
  let component: SaveFormComponent;
  let fixture: ComponentFixture<SaveFormComponent>;
  let dFetchStub: any;
  //let winService: ModalWindowService; 
  
  beforeEach(async(() => {

    dFetchStub = {
      askForDoodle: () => 0,
      getDrawingWithoutGrid: () => 0,
    };
    TestBed.configureTestingModule({
      declarations: [SaveFormComponent],
      imports:[MatDialogModule],
      providers: [ ModalWindowService,FormBuilder,{ provide: DoodleFetchService, useValue: dFetchStub }],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    dFetchStub.askForDoodle();
    
    fixture = TestBed.createComponent(SaveFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    //winService = TestBed.get(ModalWindowService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
