import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SaveFormComponent } from './save-form.component';
import { FormBuilder } from '@angular/forms';
import { DoodleFetchService } from 'src/app/services/doodle-fetch/doodle-fetch.service';
import { ModalWindowService } from 'src/app/services/window-handler/modal-window.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatDialogModule, MatChipInputEvent } from '@angular/material';
import { IndexService } from 'src/app/services/index/index.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';

fdescribe('SaveFormComponent', () => {
  let component: SaveFormComponent;
  let fixture: ComponentFixture<SaveFormComponent>;
  let dFetchStub: any;
  let winService: ModalWindowService;
  let index : IndexService;
  

  beforeEach(async(() => {

    dFetchStub = {
      askForDoodle: () => 0,
      getDrawingWithoutGrid: () => 0,
      getDrawingWithoutNoGrid: () => 0,
      getDrawingStringNoGrid:() => 0,
    };
    TestBed.configureTestingModule({
      declarations: [SaveFormComponent],
      imports: [MatDialogModule, HttpClientTestingModule],
      providers: [ModalWindowService, FormBuilder, { provide: DoodleFetchService, useValue: dFetchStub }, IndexService],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    dFetchStub.askForDoodle();
    winService = TestBed.get(ModalWindowService);
    index = TestBed.get(IndexService);
    fixture = TestBed.createComponent(SaveFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();


    //winService = TestBed.get(ModalWindowService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should build the form on initialisation', () => {
    const spy = spyOn(component, 'initForm');
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  it('should initialize the doodle after content init', () => {
    component.ngAfterContentInit();
    expect(component.doodle).toBeDefined();
  });

  it('should close the form on cancel using the window service', () => {
    const spy = spyOn(winService, 'closeWindow');
    component.closeForm();
    expect(spy).toHaveBeenCalled();
  });

  it('should remove a label', () => {
    component.labels = ['test'];
    const spy = spyOn(component.labels, 'splice');
    component.remove('test');
    expect(spy).toHaveBeenCalled();
  });

  it('should add a label', () => {
    const dummyElement = document.createElement('input');
    const mockUpEvent: MatChipInputEvent = {
      input: dummyElement,
      value: 'hello',
    }
    const spy = spyOn(component.labels, 'push');
    component.add(mockUpEvent);
    expect(spy).toHaveBeenCalled();
  });

  it('should not add the label if it contains symbols', () => {
    const dummyElement = document.createElement('input');
    const mockUpEvent: MatChipInputEvent = {
      input: dummyElement,
      value: '!%!@!#!@#!',
    }
    const spy = spyOn(component.labels, 'push');
    component.add(mockUpEvent);
    expect(spy).not.toHaveBeenCalled();
  });

  it('should complete http request to save the image', () => {
    const spy = spyOn(index, 'saveImage');
    component.saveImage();
    expect(spy).toHaveBeenCalled();
  });

  it('should get the drawing in string format without the grid', () => {
    component.ngOnInit();
    const spy = spyOn(component.doodleFetch, 'getDrawingStringNoGrid');
    component.saveImage();
    expect(spy).toHaveBeenCalled();
  });

  it('should disable the save button if draw name is invalid', () => {
    let input: HTMLInputElement = fixture.debugElement.query(By.css('input[type=text]')).nativeElement;
    input.value = '';
    component.saveForm.setValue({doodleName : input.value});
    expect(component.saveForm.valid).toBe(false);
  });

});
