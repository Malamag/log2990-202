import { Component, OnInit } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig} from '@angular/material';
@Component({
  selector: 'app-entry-point',
  templateUrl: './entry-point.component.html',
  styleUrls: ['./entry-point.component.scss']
})
export class EntryPointComponent implements OnInit {
  constructor(private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.open();
  }

  open() {
    const config = new MatSnackBarConfig();
    config.duration = 2500;
    this.snackBar.open('Bienvenue sur PolyDessin !', undefined, config);
  }

}
