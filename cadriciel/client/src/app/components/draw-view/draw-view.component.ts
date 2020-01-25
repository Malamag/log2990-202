import { Component, OnInit } from '@angular/core';
import {functionality} from '../../functionality'
@Component({
  selector: 'app-draw-view',
  templateUrl: './draw-view.component.html',
  styleUrls: ['./draw-view.component.scss']
})
export class DrawViewComponent implements OnInit {
  functionality = functionality
  toolsSideNav = true;
  width: number;
  height: number;
  constructor() { }

  ngOnInit() {
    this.width= 500;
    this.height= 500;
    
  }

}
