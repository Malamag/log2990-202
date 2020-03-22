import { HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule, MatDialogModule, MatDialogRef, MatIconModule } from '@angular/material';
import { toolsItems, welcomeItem } from 'src/app/functionality';
import { UserManualContentComponent } from './user-manual-content/user-manual-content.component';
import { UserManualComponent } from './user-manual.component';

describe('UserManualComponent', () => {
    let component: UserManualComponent;
    let fixture: ComponentFixture<UserManualComponent>;
    // tslint:disable-next-line: no-any
    let fakeDialog: any;

    beforeEach(async(() => {
        fakeDialog = {
            close: () => 0,
        };
        TestBed.configureTestingModule({
            declarations: [UserManualComponent, UserManualContentComponent],
            imports: [MatDialogModule, MatButtonModule, MatIconModule, HttpClientModule],
            providers: [{ provide: MatDialogRef, useValue: fakeDialog }],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(UserManualComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should have changed active button', () => {
        const FUNC_NUMBER = 5; // Arbitrary number for testing the selection buttons
        const BUTTONS = fixture.debugElement.nativeElement.querySelectorAll('.guide-selection-button'); // Find all guide selection buttons
        component.changeActivatedButton(component.func[FUNC_NUMBER - 2]); // Change active button for another arbitrary button
        BUTTONS[FUNC_NUMBER].click(); // Simulate a click on the first arbitrary button
        expect(component.activeButton).toEqual(component.func[FUNC_NUMBER]);
    });

    it('should change to the next page', () => {
        const FUNC_NUMBER = 6; // Arbitrary number for testing
        component.changeActivatedButton(component.func[FUNC_NUMBER]); // Change active button to an arbitrary button
        const BUTTON = fixture.debugElement.nativeElement.querySelector('#nextButton'); // Find the nextButton in the DOM
        BUTTON.click(); // Simulate a click on the first arbitrary button
        expect(component.activeButton).toEqual(component.func[FUNC_NUMBER + 1]);
    });

    it('should change to the previous page', () => {
        const FUNC_NUMBER = 6; // Arbitrary number for testing
        component.changeActivatedButton(component.func[FUNC_NUMBER]); // Change active button to an arbitrary button
        const BUTTON = fixture.debugElement.nativeElement.querySelector('#previousButton'); // Find the nextButton in the DOM
        BUTTON.click(); // Simulate a click on the first arbitrary button
        expect(component.activeButton).toEqual(component.func[FUNC_NUMBER - 1]);
    });

    it('should stay at the same page at the last page when calling nextPage', () => {
        const FUNC_NUMBER = component.func.length - 1; // number of the last selection button
        component.changeActivatedButton(component.func[FUNC_NUMBER]); // Change active button to the last selection button
        component.nextPage(); // Try to go to the next page of the guide
        expect(component.activeButton).toEqual(component.func[FUNC_NUMBER]);
    });

    it('should stay at the same page at the last page when calling previousPage', () => {
        const FUNC_NUMBER = 0; // number of the first selection button
        component.changeActivatedButton(component.func[FUNC_NUMBER]); // Change active button to the first selection button
        component.previousPage(); // Try to go to the previous page of the guide
        expect(component.activeButton).toEqual(component.func[FUNC_NUMBER]);
    });

    it('should hide previousButton on first page', () => {
        const FUNC_NUMBER = 0; // number of the first selection button
        const BUTTON = fixture.debugElement.nativeElement.querySelector('#previousButton'); // Find the previousButton in the DOM
        component.changeActivatedButton(component.func[FUNC_NUMBER]); // Change active button to the first selection button
        expect(BUTTON.hasAttributes('hidden')).toEqual(true);
    });

    it('should hide nextButton on last page', () => {
        const FUNC_NUMBER = component.func.length - 1; // number of the last selection button
        const BUTTON = fixture.debugElement.nativeElement.querySelector('#nextButton'); // Find the nextButton in the DOM
        component.changeActivatedButton(component.func[FUNC_NUMBER]); // Change active button to the last selection button
        expect(BUTTON.hasAttributes('hidden')).toEqual(true);
    });

    it('should close modal window', () => {
        const BUTTON = fixture.debugElement.nativeElement.querySelector('#quitButton'); // Find the quitButton in the DOM
        const CLOSE_GUIDE = spyOn(component, 'closeModal');
        BUTTON.click();
        expect(CLOSE_GUIDE).toHaveBeenCalled();
    });

    it('should call the library function to close modal', () => {
        const SPY = spyOn(component.dialogRef, 'close');
        component.closeModal();
        expect(SPY).toHaveBeenCalled();
    });

    it('should disable the next button at the last functionnality', () => {
        component.func = welcomeItem;
        component.activeButton = component.func[1]; // last functionnality

        component.nextPage();
        expect(component.activeButton).toBeFalsy();
    });

    it('should disable the previous button at the first functionnality', () => {
        component.func = toolsItems;
        component.activeButton = component.func[component.func.length - 2];
        component.previousPage();
        expect(component.activePreviousButton).toBeFalsy();
    });
});
