import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NewDrawComponent } from './new-draw.component';
import { MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule} from '@angular/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By } from "@angular/platform-browser";

describe('NewDrawComponent', () => {
  let component: NewDrawComponent;
  let fixture: ComponentFixture<NewDrawComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewDrawComponent ],
      imports: [ 
        MatDialogModule, 
        MatFormFieldModule, 
        ReactiveFormsModule, 
        FormsModule, 
        BrowserAnimationsModule,
        MatInputModule,
        MatButtonModule,
        MatDialogModule,
        RouterTestingModule,
      ],
      providers:[ By ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewDrawComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close modal window',() => {
    let button = fixture.debugElement.nativeElement.querySelector('#quitButton'); //Find the quitButton in the DOM
    const closeGuide = spyOn(component, "closeModalForm");  //Spy on closeModalForm function
    button.click();
    expect(closeGuide).toHaveBeenCalled();  //Look if function has been called with the help of the spy
  });

  it('should open draw-view when submitted',() => {
    //
  });

  it('should send the correct values to draw-view when submitted',() => {
    //
  });

  it('should change the hexadecimal color to the color selected',() => {
    //
  });

  //DOESNT WORK :(
  it('should not accept negative values in width',() => { 
    //let input = fixture.debugElement.query(By.css('input[formControlName=canvWidth]')); //Find the input for width
    //input.nativeElement.value = '3H5';
    //component.newDrawForm.setValue({
    //  canvWidth: '333',
    //  canvHeight: '333',
    //  canvColor: 'ffffff'
    //});
    component.width = -335;
    let submitButton = fixture.debugElement.query(By.css('button[type=submit]')); //Find the submit button
    //const submit = spyOn(component, "onSubmit");  //Spy on submit function
    //submitButton.nativeElement.click();
    //fixture.detectChanges();
    //expect(component.newDrawForm.invalid).toBeTruthy();
    expect(submitButton.nativeElement.disabled).toBeTruthy();
    //expect(submit).not.toHaveBeenCalled();  //Look if function has been called with the help of the spy
  });

  it('should not accept negative values in height',() => {
    //
  });


  it('should not accept character values in width',() => {
    //
  });

  it('should not accept character values in height',() => {
    //
  });

  it('should not accept null values in width',() => {
    //
  });

  it('should not accept null values in height',() => {
    //
  });

  it('should not accept more than 6 characters in color',() => {
    //
  });

  it('should not accept more than 20 characters in width',() => {
    //
  });

  it('should not accept more than 20 characters in height',() => {
    //
  });

  it('should not accept other characters than hexadecimals in color',() => {
    //
  });

});
