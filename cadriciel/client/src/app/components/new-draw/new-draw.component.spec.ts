import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatDialogModule, MatFormFieldModule, MatInputModule } from '@angular/material';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { CanvasBuilderService } from '../../services/new-doodle/canvas-builder.service';
import { NewDrawComponent } from './new-draw.component';

describe('NewDrawComponent', () => {
    let component: NewDrawComponent;
    let fixture: ComponentFixture<NewDrawComponent>;
    let router: Router;
    let canvasBuilder: CanvasBuilderService;

    // tslint:disable-next-line: no-any
    let kbEventStub: any;

    beforeEach(async(() => {
        kbEventStub = {
            stopPropagation: () => 0,
        };
        TestBed.configureTestingModule({
            declarations: [NewDrawComponent],
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
            providers: [By, { provide: KeyboardEvent, useValue: kbEventStub }],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(NewDrawComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        router = TestBed.get(Router);
        router.navigate = jasmine.createSpy().and.returnValue(0);
        canvasBuilder = TestBed.get(CanvasBuilderService);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should close modal window on cancel', () => {
        const CLOSE_GUIDE = spyOn(component, 'closeModalForm'); // Spy on closeModalForm function
        const CLOSE_BUTTON = fixture.debugElement.nativeElement.querySelector('#quitButton'); // Find the quitButton in the DOM
        CLOSE_BUTTON.click();
        expect(CLOSE_GUIDE).toHaveBeenCalled(); // Look if function has been called with the help of the spy
    });

    it('should close modal window on submit', () => {
        const CLOSE_GUIDE = spyOn(component, 'closeModalForm'); // Spy on closeModalForm function
        const SUBMIT_BUTTON = fixture.debugElement.query(By.css('button[type=submit]')).nativeElement; // Find the submit button
        SUBMIT_BUTTON.click();
        expect(CLOSE_GUIDE).toHaveBeenCalled(); // Look if function has been called with the help of the spy
    });

    it('should open draw-view on submit', () => {
        const SUBMIT_BUTTON = fixture.debugElement.query(By.css('button[type=submit]')).nativeElement; // Find the submit button
        SUBMIT_BUTTON.click(); // Create new click event on the submitButton
        expect(router.navigate).toHaveBeenCalledWith(['/vue']); // Look if we navigate to the drawing screen
    });

    it('should send the correct values when submitted', () => {
        const WIDTH_VALUE = 321;
        const HEIGHT_VALUE = 123;
        const COLOR_VALUE = 'ffffff';
        setInputValue('input[formControlName=canvWidth]', WIDTH_VALUE); // Put a number in the input of width
        setInputValue('input[formControlName=canvHeight]', HEIGHT_VALUE); // Put a number in the input of height
        setInputValue('input[formControlName=canvColor]', COLOR_VALUE); // Put a hex color in the input of color
        const CANVAS_SPY = spyOn(canvasBuilder, 'setCanvasFromForm'); // Spy on the navigate function of the router
        const SUBMIT_BUTTON = fixture.debugElement.query(By.css('button[type=submit]')).nativeElement; // Find the submit button
        SUBMIT_BUTTON.click(); // Create new click event on the submitButton
        expect(CANVAS_SPY).toHaveBeenCalledWith(WIDTH_VALUE, HEIGHT_VALUE, COLOR_VALUE); // Look if we navigate to the drawing screen
    });

    /*it('should change the hexadecimal color to the color selected', () => {
    const colorNumber = 5; // Arbitrary number for testing the color buttons
    const colors = fixture.debugElement.nativeElement.querySelectorAll('.paletteElem'); // Find color buttons
    colors[colorNumber].dispatchEvent(new Event('click'));  // Create a click event on the wanted color
    const wantedStringColor = '#' + component.color;  // Add # to the hex color for comparing
    expect(component.paletteArray[5].color).toEqual(wantedStringColor); // Expect the string colors to be identical
  });*/

    it('should not accept negative values in width', () => {
        setInputValue('input[formControlName=canvWidth]', '-335'); // Put a random negative number in the input of width
        const submitButton = fixture.debugElement.query(By.css('button[type=submit]')); // Find the submit button
        expect(submitButton.nativeElement.disabled).toBeTruthy(); // Look if the submit button is disabled
    });

    it('should not accept negative values in height', () => {
        setInputValue('input[formControlName=canvHeight]', '-437'); // Put a random negative number in the input of height
        const SUBMIT_BUTTON = fixture.debugElement.query(By.css('button[type=submit]')); // Find the submit button
        expect(SUBMIT_BUTTON.nativeElement.disabled).toBeTruthy(); // Look if the submit button is disabled
    });

    it('should not accept character values in width', () => {
        setInputValue('input[formControlName=canvWidth]', '4h7'); // Put a random number with characters inside in the input of width
        const SUBMIT_BUTTON = fixture.debugElement.query(By.css('button[type=submit]')); // Find the submit button
        expect(SUBMIT_BUTTON.nativeElement.disabled).toBeTruthy(); // Look if the submit button is disabled
    });

    it('should not accept character values in height', () => {
        setInputValue('input[formControlName=canvHeight]', '4h7'); // Put a random number with characters inside in the input of height
        const SUBMIT_BUTTON = fixture.debugElement.query(By.css('button[type=submit]')); // Find the submit button
        expect(SUBMIT_BUTTON.nativeElement.disabled).toBeTruthy(); // Look if the submit button is disabled
    });

    it('should not accept undefined values in width', () => {
        setInputValue('input[formControlName=canvWidth]', undefined);
        const SUBMIT_BUTTON = fixture.debugElement.query(By.css('button[type=submit]')); // Find the submit button
        expect(SUBMIT_BUTTON.nativeElement.disabled).toBeTruthy(); // Look if the submit button is disabled
    });

    it('should not accept undefined values in height', () => {
        setInputValue('input[formControlName=canvHeight]', undefined);
        const SUBMIT_BUTTON = fixture.debugElement.query(By.css('button[type=submit]')); // Find the submit button
        expect(SUBMIT_BUTTON.nativeElement.disabled).toBeTruthy(); // Look if the submit button is disabled
    });

    it('should not accept undefined values in color', () => {
        setInputValue('input[formControlName=canvColor]', undefined);
        const SUBMIT_BUTTON = fixture.debugElement.query(By.css('button[type=submit]')); // Find the submit button
        expect(SUBMIT_BUTTON.nativeElement.disabled).toBeTruthy(); // Look if the submit button is disabled
    });

    it('should not accept more than 6 characters in color', () => {
        setInputValue('input[formControlName=canvColor]', 'fffffff'); // Put a 7 characters in the input of color
        const SUBMIT_BUTTON = fixture.debugElement.query(By.css('button[type=submit]')); // Find the submit button
        expect(SUBMIT_BUTTON.nativeElement.disabled).toBeTruthy(); // Look if the submit button is disabled
    });

    it('should not accept other characters than hexadecimals in color', () => {
        setInputValue('input[formControlName=canvColor]', 'fetkhf'); // Put random characters in color
        const SUBMIT_BUTTON = fixture.debugElement.query(By.css('button[type=submit]')); // Find the submit button
        expect(SUBMIT_BUTTON.nativeElement.disabled).toBeTruthy(); // Look if the submit button is disabled
    });

    it('should block events with stop propagation', () => {
        const SPY = spyOn(kbEventStub, 'stopPropagation');
        component.blockEvent(kbEventStub);
        expect(SPY).toHaveBeenCalled();
    });

    it('should update the new color for the form on change', () => {

        const SPY = spyOn(component.newDrawForm, 'patchValue');
        const FAKE_COLOR = 'ffffff';
        component.updateColor(FAKE_COLOR);
        expect(SPY).toHaveBeenCalled();
    });

    it('should resize the canvas dimension on window resize', () => {
        const SPY = spyOn(component, 'resizeCanvas');
        component.ngOnInit();
        window.dispatchEvent(new Event('resize'));
        expect(SPY).toHaveBeenCalled(); // at init and in the handler
    });

    it('should not call canvasResize if an input has been entered', () => {
        const SPY = spyOn(component, 'resizeCanvas');
        component.ngOnInit();
        component.inputEntered = false;

        window.dispatchEvent(new Event('resize'));

        expect(SPY).toHaveBeenCalledTimes(1); // called at first init

    });

    // tslint:disable-next-line: only-arrow-functions
    function setInputValue(name: string, value: number | string | undefined): void {
        const INPUT = fixture.debugElement.query(By.css(name)).nativeElement; // Find the input in DOM
        INPUT.value = value; // Change its value
        INPUT.dispatchEvent(new Event('input')); // Create new input event for wanted input
        fixture.detectChanges();
    }

});
