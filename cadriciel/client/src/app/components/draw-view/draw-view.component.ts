import { Component, OnInit, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import {functionality} from '../../functionality'



@Component({
  selector: 'app-draw-view',
  templateUrl: './draw-view.component.html',
  styleUrls: ['./draw-view.component.scss']
})
export class DrawViewComponent implements OnInit {
  functionality = functionality
  openToolOptions: boolean = false;
  width: number;
  height: number;
  selectedTool: string;
  @ViewChild('toolsOptionsRef', {static: false}) navBarRef: ElementRef
  renderer: Renderer2
  constructor() { }

  ngOnInit() {
    this.width= 2000;
    this.height= 1000;
    
  }
  buttonAction(name:string){
    this.openToolOptions= !this.openToolOptions;
    this.selectedTool= name;
  }

}
