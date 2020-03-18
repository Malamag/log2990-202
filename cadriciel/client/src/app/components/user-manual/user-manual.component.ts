import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { menuItems, toolsItems, welcomeItem } from '../../functionality';
import {IconsService} from '../../services/icons.service';
@Component({
    selector: 'app-user-manual',
    templateUrl: './user-manual.component.html',
    styleUrls: ['./user-manual.component.scss'],
})
export class UserManualComponent {
    // Initialize functionalities
    toolsItems: object = {};
    menuItems: object = {};
    welcomeItem: object = {};

    // Initialize booleans saying if these buttons should be visible or hidden
    activeNextButton: boolean;
    activePreviousButton: boolean;

    // Initialize func as an array containing all functionalities
    func: object[];
    activeButton: object = {};

    constructor(public dialogRef: MatDialogRef<UserManualComponent>, public icons: IconsService) {
        this.toolsItems = toolsItems;
        this.menuItems = menuItems;
        this.welcomeItem = welcomeItem;
        this.activeNextButton = true;
        this.activePreviousButton = false;
        // Initialize func as an array containing all functionalities
        this.func = welcomeItem.concat(menuItems, toolsItems);
        this.activeButton = this.func[0];
    }

    closeModal(): void {
        // Close the dialog window of the guide
        this.dialogRef.close();
    }

    changeActivatedButton(actualButton: object): void {
        // Change activeButton reference to the button clicked
        this.activeButton = actualButton;
        // Look if the nextButton and previousButtons should be hidden due to being at the beginning/end of the array
        this.activeNextButton = this.activeButton !== this.func[this.func.length - 1];
        this.activePreviousButton = this.activeButton !== this.func[0];
    }

    nextPage(): void {
        // Iterate the array of functionalities to find the matching active one
        for (let i = this.func.length - 2; i >= 0; i--) {
            if (this.func[i] === this.activeButton) {
                this.activeButton = this.func[i + 1];
                if (this.activeButton === this.func[this.func.length - 1]) {
                    this.activeNextButton = false;
                }
            }
        }
        this.activePreviousButton = true; // There is now absolutely a previous page
    }

    previousPage(): void {
        // Iterate the array of functionalities to find the matching active one
        for (let i = 1; i < this.func.length; ++i) {
            if (this.func[i] === this.activeButton) {
                this.activeButton = this.func[i - 1];
                if (this.activeButton === this.func[0]) {
                    this.activePreviousButton = false;
                }
            }
        }
        this.activeNextButton = true; // There is now absolutely a next page
    }
}
