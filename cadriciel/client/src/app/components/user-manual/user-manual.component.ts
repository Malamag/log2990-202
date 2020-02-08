import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { toolsItems, menuItems, welcomeItem } from '../../functionality';

@Component({
  selector: 'app-user-manual',
  templateUrl: './user-manual.component.html',
  styleUrls: ['./user-manual.component.scss'],
})

export class UserManualComponent implements OnInit {
  
  //Initialize functionalities
  toolsItems = toolsItems;
  menuItems = menuItems;
  welcomeItem = welcomeItem;

  //Initialize booleans saying if these buttons should be visible or hidden
  activeNextButton: boolean = true;
  activePreviousButton: boolean = false;

  //Initialize func as an array containing all functionalities
  func: Array<any> = welcomeItem.concat(menuItems, toolsItems);
  activeButton: any = this.welcomeItem[0];

  constructor(public dialogRef: MatDialogRef<UserManualComponent>) { }

  ngOnInit() {
  }

  closeModal() {  //Close the dialog window of the guide
    this.dialogRef.close();
  }

  changeActivatedButton(actualButton: any) {
    //Change activeButton reference to the button clicked
    this.activeButton = actualButton;
    //Look if the nextButton and previousButtons should be hidden due to being at the beginning/end of the array
    this.activeButton === this.func[this.func.length - 1] ? this.activeNextButton = false : this.activeNextButton = true;
    this.activeButton === this.func[0] ? this.activePreviousButton = false : this.activePreviousButton = true;
  }

  nextPage() {
    //Iterate the array of functionalities to find the matching active one
    for (let i = this.func.length - 2; i >= 0; i--) {
      if (this.func[i].shortcutName === this.activeButton.shortcutName){
        this.activeButton = this.func[i + 1]; //Change active button for the next one
        if (this.activeButton === this.func[this.func.length - 1])
          this.activeNextButton = false;  //We want the nextButton hidden if it's the last functionality
      }
    }
    this.activePreviousButton = true; //There is now absolutely a previous page
  }

  previousPage() {
    //Iterate the array of functionalities to find the matching active one
    for (let i = 1; i < this.func.length; ++i) {
      if (this.func[i].shortcutName === this.activeButton.shortcutName){
        this.activeButton = this.func[i - 1];  //Change active button for the next one
        if (this.activeButton === this.func[0])
          this.activePreviousButton = false;  //We want the previousButton hidden if it's the first functionality
      }
    }
    this.activeNextButton = true; //There is now absolutely a next page
  }
}








































