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

  closeModal() {
    this.dialogRef.close();
  }
}
