import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { MatChipInputEvent, MatDialogModule, MatSnackBarModule } from '@angular/material';
import { By } from '@angular/platform-browser';
import { DoodleFetchService } from 'src/app/services/doodle-fetch/doodle-fetch.service';
import { IndexService } from 'src/app/services/index/index.service';
import { ModalWindowService } from 'src/app/services/window-handler/modal-window.service';
import { SaveFormComponent } from './save-form.component';

describe('SaveFormComponent', () => {
  let component: SaveFormComponent;
  let fixture: ComponentFixture<SaveFormComponent>;
  // tslint:disable-next-line: no-any
  let dFetchStub: any;
  let winService: ModalWindowService;
  let index: IndexService;
  beforeEach(async(() => {

    dFetchStub = {
      askForDoodle: () => 0,
      getDrawingWithoutGrid: () => 0,
      getDrawingWithoutNoGrid: () => 0,
      getDrawingDataNoGrid: () => 0,
    };
    TestBed.configureTestingModule({
      declarations: [SaveFormComponent],
      imports: [MatDialogModule, HttpClientTestingModule, MatSnackBarModule],
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
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should build the form on initialisation', () => {
    const SPY = spyOn(component, 'initForm');
    component.ngOnInit();
    expect(SPY).toHaveBeenCalled();
  });

  it('should initialize the doodle after content init', () => {
    component.ngAfterContentInit();
    expect(component.doodle).toBeDefined();
  });

  it('should close the form on cancel using the window service', () => {
    const SPY = spyOn(winService, 'closeWindow');
    component.closeForm();
    expect(SPY).toHaveBeenCalled();
  });

  it('should remove a label', () => {
    component.labels = ['test'];
    const SPY = spyOn(component.labels, 'splice');
    component.remove('test');
    expect(SPY).toHaveBeenCalled();
  });

  it('should add a label', () => {
    const DUMMY_ELEMENT = document.createElement('input');
    const mockUpEvent: MatChipInputEvent = {
      input: DUMMY_ELEMENT,
      value: 'hello',
    };
    const SPY = spyOn(component.labels, 'push');
    component.add(mockUpEvent);
    expect(SPY).toHaveBeenCalled();
  });

  it('should not add the label if it contains symbols', () => {
    const DUMMY_ELEMENT = document.createElement('input');
    const mockUpEvent: MatChipInputEvent = {
      input: DUMMY_ELEMENT,
      value: '!%!@!#!@#!',
    };
    const SPY = spyOn(component.labels, 'push');
    component.add(mockUpEvent);
    expect(SPY).not.toHaveBeenCalled();
  });

  it('should complete http request to save the image', () => {
    const SPY = spyOn(index, 'saveImage');
    component.saveImage();
    expect(SPY).toHaveBeenCalled();
  });

  it('should get the drawing in string format without the grid', () => {
    component.ngOnInit();
    // tslint:disable-next-line: no-string-literal
    const SPY = spyOn(component['doodleFetch'], 'getDrawingDataNoGrid');
    component.saveImage();
    expect(SPY).toHaveBeenCalled();
  });

  it('should disable the save button if draw name is invalid', () => {
    const INPUT: HTMLInputElement = fixture.debugElement.query(By.css('input[type=text]')).nativeElement;
    INPUT.value = '';
    component.saveForm.setValue({ doodleName: INPUT.value });
    expect(component.saveForm.valid).toBe(false);
  });

  it('should get the drawing in string format without the grid', () => {
    // tslint:disable-next-line: no-string-literal
    const SPY = spyOn(component['doodleFetch'], 'getDrawingDataNoGrid');
    component.saveImage();
    expect(SPY).toHaveBeenCalled();
  });

  it('should stop event propagation when save form is open', () => {
    const KEY_EVENT = new KeyboardEvent('keydown', { code: 'Key1' });
    const SPY = spyOn(KEY_EVENT, 'stopPropagation');
    component.blockEvent(KEY_EVENT);
    expect(SPY).toHaveBeenCalled();
  });
});
