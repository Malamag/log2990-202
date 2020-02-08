import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NewDrawComponent } from './new-draw.component';
import { MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule} from '@angular/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By } from "@angular/platform-browser";
import { Router } from '@angular/router';
import { CanvasBuilderService } from '../../services/drawing/canvas-builder.service';

describe('NewDrawComponent', () => {
  let component: NewDrawComponent;
  let fixture: ComponentFixture<NewDrawComponent>;
  let router: Router;
  let canvasBuilder: CanvasBuilderService;

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
        RouterTestingModule
      ],
      providers:[ By ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewDrawComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    router = TestBed.get(Router);
    canvasBuilder = TestBed.get(CanvasBuilderService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close modal window on cancel',() => {
    const closeGuide = spyOn(component, "closeModalForm");  //Spy on closeModalForm function
    let closeButton = fixture.debugElement.nativeElement.querySelector('#quitButton'); //Find the quitButton in the DOM
    closeButton.click();
    expect(closeGuide).toHaveBeenCalled();  //Look if function has been called with the help of the spy
  });

  it('should close modal window on submit',() => {
    const closeGuide = spyOn(component, "closeModalForm");  //Spy on closeModalForm function
    let submitButton = fixture.debugElement.query(By.css('button[type=submit]')).nativeElement; //Find the submit button
    submitButton.click();
    expect(closeGuide).toHaveBeenCalled();  //Look if function has been called with the help of the spy
  });

  it('should open draw-view on submit',() => {
    const navigateSpy = spyOn(router, 'navigate');  //Spy on the navigate function of the router
    let submitButton = fixture.debugElement.query(By.css('button[type=submit]')).nativeElement; //Find the submit button
    submitButton.click(); //Create new click event on the submitButton
    expect(navigateSpy).toHaveBeenCalledWith(['/vue']); //Look if we navigate to the drawing screen
  });

  it('should send the correct values when submitted',() => {
    const widthValue = 321; const heightValue = 123; const colorValue = 'ffffff';
    setInputValue('input[formControlName=canvWidth]',widthValue); //Put a number in the input of width
    setInputValue('input[formControlName=canvHeight]',heightValue); //Put a number in the input of height
    setInputValue('input[formControlName=canvColor]',colorValue); //Put a hex color in the input of color
    const CanvasSpy = spyOn(canvasBuilder, 'setCanvasFromForm');  //Spy on the navigate function of the router
    let submitButton = fixture.debugElement.query(By.css('button[type=submit]')).nativeElement; //Find the submit button
    submitButton.click(); //Create new click event on the submitButton
    expect(CanvasSpy).toHaveBeenCalledWith(widthValue,heightValue,colorValue); //Look if we navigate to the drawing screen
  });

  it('should change the hexadecimal color to the color selected',() => {
    const colorNumber = 5; //Arbitrary number for testing the color buttons
    let colors = fixture.debugElement.nativeElement.querySelectorAll('.paletteElem'); //Find color buttons
    colors[colorNumber].dispatchEvent(new Event('click'));  //Create a click event on the wanted color
    let wantedStringColor = "#" + component.color;  //Add # to the hex color for comparing
    expect(component.paletteArray[5].color).toEqual(wantedStringColor); //Expect the string colors to be identical
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

  function setInputValue(name: string, value: any) {
    let input = fixture.debugElement.query(By.css(name)).nativeElement; //Find the input in DOM
    input.value = value;  //Change its value
    input.dispatchEvent(new Event('input'));  //Create new input event for wanted input
    fixture.detectChanges();
  }

});
