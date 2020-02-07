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
  let buttons = fixture.debugElement.nativeElement.querySelectorAll('.guide-selection-button');
  const funcNumber = 5;
  component.changeActivatedButton(component.func[funcNumber-2]);
  buttons[funcNumber].click();
  expect(component.activeButton).toEqual(component.func[funcNumber]);
  });

 it('should stay at the same page at the last page when calling nextPage', () => {
  const funcNumber = component.func.length-1;
  component.changeActivatedButton(component.func[funcNumber]);
  component.nextPage();
  expect(component.activeButton).toEqual(component.func[funcNumber]);
});

it('should stay at the same page at the last page when calling previousPage', () => {
  const funcNumber = 0;
  component.changeActivatedButton(component.func[funcNumber]);
  component.previousPage();
  expect(component.activeButton).toEqual(component.func[funcNumber]);
});

it('should hide previousButton on first page',() => {
  let button = fixture.debugElement.nativeElement.querySelector('#previousButton');
  const funcNumber = 0;
  component.changeActivatedButton(component.func[funcNumber]);
  expect(button.hasAttributes('hidden')).toEqual(true);
});

it('should hide nextButton on last page',() => {
  let button = fixture.debugElement.nativeElement.querySelector('#nextButton');
  const funcNumber = component.func.length-1;
  component.changeActivatedButton(component.func[funcNumber]);
  expect(button.hasAttributes('hidden')).toEqual(true);
});

});
