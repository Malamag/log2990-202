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

  it('should not accept negative values in width',() => {
    setInputValue('input[formControlName=canvWidth]','-335'); //Put a random negative number in the input of width
    let submitButton = fixture.debugElement.query(By.css('button[type=submit]')); //Find the submit button
    expect(submitButton.nativeElement.disabled).toBeTruthy(); //Look if the submit button is disabled
  });  

  it('should not accept negative values in height',() => {
    setInputValue('input[formControlName=canvHeight]','-437');  //Put a random negative number in the input of height
    let submitButton = fixture.debugElement.query(By.css('button[type=submit]')); //Find the submit button
    expect(submitButton.nativeElement.disabled).toBeTruthy(); //Look if the submit button is disabled
  });


  it('should not accept character values in width',() => {
    setInputValue('input[formControlName=canvWidth]','4h7');  //Put a random number with characters inside in the input of width
    let submitButton = fixture.debugElement.query(By.css('button[type=submit]')); //Find the submit button
    expect(submitButton.nativeElement.disabled).toBeTruthy(); //Look if the submit button is disabled
  });

  it('should not accept character values in height',() => {
    setInputValue('input[formControlName=canvHeight]','4h7');  //Put a random number with characters inside in the input of height
    let submitButton = fixture.debugElement.query(By.css('button[type=submit]')); //Find the submit button
    expect(submitButton.nativeElement.disabled).toBeTruthy(); //Look if the submit button is disabled
  });

  it('should not accept null values in width',() => {
    setInputValue('input[formControlName=canvWidth]','');  //Put a null value in the input of width
    let submitButton = fixture.debugElement.query(By.css('button[type=submit]')); //Find the submit button
    expect(submitButton.nativeElement.disabled).toBeTruthy(); //Look if the submit button is disabled
  });

  it('should not accept null values in height',() => {
    setInputValue('input[formControlName=canvHeight]','');  //Put a null value in the input of height
    let submitButton = fixture.debugElement.query(By.css('button[type=submit]')); //Find the submit button
    expect(submitButton.nativeElement.disabled).toBeTruthy(); //Look if the submit button is disabled
  });

  it('should not accept null values in color',() => {
    setInputValue('input[formControlName=canvColor]','');  //Put a null value in the input of color
    let submitButton = fixture.debugElement.query(By.css('button[type=submit]')); //Find the submit button
    expect(submitButton.nativeElement.disabled).toBeTruthy(); //Look if the submit button is disabled
  });

  it('should not accept more than 6 characters in color',() => {
    setInputValue('input[formControlName=canvColor]','fffffff');  //Put a 7 characters in the input of color
    let submitButton = fixture.debugElement.query(By.css('button[type=submit]')); //Find the submit button
    expect(submitButton.nativeElement.disabled).toBeTruthy(); //Look if the submit button is disabled
  });

  it('should not accept more than 20 characters in width',() => {
    setInputValue('input[formControlName=canvWidth]','123456789012345678901');  //Put a 20 characters in the input of width
    let submitButton = fixture.debugElement.query(By.css('button[type=submit]')); //Find the submit button
    expect(submitButton.nativeElement.disabled).toBeTruthy(); //Look if the submit button is disabled
  });

  it('should not accept more than 20 characters in height',() => {
    setInputValue('input[formControlName=canvheight]','123456789012345678901');  //Put a 20 characters in the input of height
    let submitButton = fixture.debugElement.query(By.css('button[type=submit]')); //Find the submit button
    expect(submitButton.nativeElement.disabled).toBeTruthy(); //Look if the submit button is disabled
  });

  it('should not accept other characters than hexadecimals in color',() => {
    setInputValue('input[formControlName=canvColor]','fetkhf');  //Put random characters in color
    let submitButton = fixture.debugElement.query(By.css('button[type=submit]')); //Find the submit button
    expect(submitButton.nativeElement.disabled).toBeTruthy(); //Look if the submit button is disabled
  });

  function setInputValue(name: string, value: string) {
    let input = fixture.debugElement.query(By.css(name)).nativeElement;
    input.value = value;
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
  }

});
