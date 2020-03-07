import { Component} from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { menuItems, toolsItems, welcomeItem } from '../../functionality';

@Component({
  selector: 'app-user-manual',
  templateUrl: './user-manual.component.html',
  styleUrls: ['./user-manual.component.scss'],
})

export class UserManualComponent  {

  // Initialize functionalities
  toolsItems = toolsItems;
  menuItems = menuItems;
  welcomeItem = welcomeItem;

  // Initialize booleans saying if these buttons should be visible or hidden
  activeNextButton = true;
  activePreviousButton = false;

  // Initialize func as an array containing all functionalities
  func: any[] = welcomeItem.concat(menuItems, toolsItems);
  activeButton: any = this.welcomeItem[0];

  constructor(public dialogRef: MatDialogRef<UserManualComponent>) { }

  closeModal() {  // Close the dialog window of the guide
    this.dialogRef.close();
  }

  changeActivatedButton(actualButton: any) {
    // Change activeButton reference to the button clicked
    this.activeButton = actualButton;
    // Look if the nextButton and previousButtons should be hidden due to being at the beginning/end of the array
    this.activeNextButton = this.activeButton !== this.func[this.func.length - 1];
    this.activePreviousButton = this.activeButton !== this.func[0];
  }

  nextPage() {
    // Iterate the array of functionalities to find the matching active one
    for (let i = this.func.length - 2; i >= 0; i--) {
      if (this.func[i].shortcutName === this.activeButton.shortcutName) {
        this.activeButton = this.func[i + 1]; // Change active button for the next one
        if (this.activeButton === this.func[this.func.length - 1]) {
          this.activeNextButton = false;
        }  // We want the nextButton hidden if it's the last functionality
      }
    }
    this.activePreviousButton = true; // There is now absolutely a previous page
  }

  previousPage() {
    // Iterate the array of functionalities to find the matching active one
    for (let i = 1; i < this.func.length; ++i) {
      if (this.func[i].shortcutName === this.activeButton.shortcutName) {
        this.activeButton = this.func[i - 1];  // Change active button for the next one
        if (this.activeButton === this.func[0]) {
          this.activePreviousButton = false;
        }  // We want the previousButton hidden if it's the first functionality
      }
    }
    this.activeNextButton = true; // There is now absolutely a next page
  }
}
