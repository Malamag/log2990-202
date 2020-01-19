import { Component, OnInit } from '@angular/core';
import { FormGroup} from '@angular/forms';

@Component({
  selector: 'app-new-draw',
  templateUrl: './new-draw.component.html',
  styleUrls: ['./new-draw.component.scss']
})
export class NewDrawComponent implements OnInit {

  newDrawForm: FormGroup;

  constructor() { }

  ngOnInit() {
  }

}
