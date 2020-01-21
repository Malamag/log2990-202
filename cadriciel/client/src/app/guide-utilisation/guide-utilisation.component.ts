import { Component, OnInit } from '@angular/core';

////////////////////////
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-guide-utilisation',
  templateUrl: './guide-utilisation.component.html',
  styleUrls: ['./guide-utilisation.component.scss']
})
export class GuideUtilisationComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<GuideUtilisationComponent>) { }

  ngOnInit() {
  }

//////////////////////////
// When the user clicks the action button a.k.a. the logout button in the\
  // modal, show an alert and followed by the closing of the modal
  actionFunction() {
    alert("Yo");
    this.closeModal();
  }

  // If the user clicks the cancel button a.k.a. the go back button, then\
  // just close the modal
  closeModal() {
    this.dialogRef.close();
  }
///////////////////////////

}
