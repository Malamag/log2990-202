import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserManualComponent } from './user-manual.component';
import { MatDialogModule, MatButtonModule, MatIconModule, MatDialogRef } from '@angular/material';
import { UserManualContentComponent } from './user-manual-content/user-manual-content.component';

describe('UserManualComponent', () => {
  let component: UserManualComponent;
  let fixture: ComponentFixture<UserManualComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserManualComponent, UserManualContentComponent ],
      imports: [ MatDialogModule, MatButtonModule, MatIconModule ],
      providers: [{provide: MatDialogRef}]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserManualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have changed active button',() => {
    const funcNumber = 5; //Arbitrary number for testing the selection buttons
    let buttons = fixture.debugElement.nativeElement.querySelectorAll('.guide-selection-button'); //Find all guide selection buttons
    component.changeActivatedButton(component.func[funcNumber-2]);  //Change active button for another arbitrary button
    buttons[funcNumber].click();  //Simulate a click on the first arbitrary button
    expect(component.activeButton).toEqual(component.func[funcNumber]); //Expect the active button to have changed to the button clicked
    });

    it('should change to the next page',() => {
      const funcNumber = 6; //Arbitrary number for testing
      component.changeActivatedButton(component.func[funcNumber]);  //Change active button to an arbitrary button
      let button = fixture.debugElement.nativeElement.querySelector('#nextButton'); //Find the nextButton in the DOM
      button.click();  //Simulate a click on the first arbitrary button
      expect(component.activeButton).toEqual(component.func[funcNumber+1]);
    });

    it('should change to the previous page',() => {
      const funcNumber = 6; //Arbitrary number for testing
      component.changeActivatedButton(component.func[funcNumber]);  //Change active button to an arbitrary button
      let button = fixture.debugElement.nativeElement.querySelector('#previousButton'); //Find the nextButton in the DOM
      button.click();  //Simulate a click on the first arbitrary button
      expect(component.activeButton).toEqual(component.func[funcNumber-1]);
    });

  it('should stay at the same page at the last page when calling nextPage', () => {
    const funcNumber = component.func.length-1; //number of the last selection button
    component.changeActivatedButton(component.func[funcNumber]);  //Change active button to the last selection button
    component.nextPage(); //Try to go to the next page of the guide
    expect(component.activeButton).toEqual(component.func[funcNumber]);
  });

  it('should stay at the same page at the last page when calling previousPage', () => {
    const funcNumber = 0; //number of the first selection button
    component.changeActivatedButton(component.func[funcNumber]);  //Change active button to the first selection button
    component.previousPage(); //Try to go to the previous page of the guide
    expect(component.activeButton).toEqual(component.func[funcNumber]);
  });

  it('should hide previousButton on first page',() => {
    const funcNumber = 0; //number of the first selection button
    let button = fixture.debugElement.nativeElement.querySelector('#previousButton'); //Find the previousButton in the DOM
    component.changeActivatedButton(component.func[funcNumber]);  //Change active button to the first selection button
    expect(button.hasAttributes('hidden')).toEqual(true);
  });

  it('should hide nextButton on last page',() => {
    const funcNumber = component.func.length-1; //number of the last selection button
    let button = fixture.debugElement.nativeElement.querySelector('#nextButton'); //Find the nextButton in the DOM
    component.changeActivatedButton(component.func[funcNumber]);  //Change active button to the last selection button
    expect(button.hasAttributes('hidden')).toEqual(true);
  });

  it('should close modal window',() => {
    let button = fixture.debugElement.nativeElement.querySelector('#quitButton'); //Find the quitButton in the DOM
    const closeGuide = spyOn(component, "closeModal");
    button.click();
    expect(closeGuide).toHaveBeenCalled();
  });

});
