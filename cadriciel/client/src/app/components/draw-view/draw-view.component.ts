import { Component, OnInit, ElementRef, ViewChild, Renderer2 } from '@angular/core';



@Component({
  selector: 'app-draw-view',
  templateUrl: './draw-view.component.html',
  styleUrls: ['./draw-view.component.scss']
})
export class DrawViewComponent implements OnInit {

  // I doubt if we can delete these two
  @ViewChild('toolsOptionsRef', {static: false}) navBarRef: ElementRef
  renderer: Renderer2
 
  
  constructor() {
  }

  ngOnInit() {
    
  } 
  
  adaptWindowSize() {
    window.dispatchEvent(new Event("resize"));
  }

    /**Cette fonction peut à la limite être mise dans un service... */

  
}
