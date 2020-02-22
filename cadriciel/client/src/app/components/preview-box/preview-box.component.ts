import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Input } from '@angular/core';
//import { DoodleFetchService } from 'src/app/services/doodle-fetch/doodle-fetch.service';

@Component({
  selector: 'app-preview-box',
  templateUrl: './preview-box.component.html',
  styleUrls: ['./preview-box.component.scss']
})
export class PreviewBoxComponent implements OnInit, AfterViewInit {
  @Input() draw: SVGElement;
  @Input() svgH: number;
  @Input() svgW: number;
  
  
  @ViewChild('prevBox', {static:false}) previewBoxRef: ElementRef; // has an eye on the <canvas> element
 
  constructor() { }

  ngOnInit() {
    
  }

  ngAfterViewInit() {
    //this.draw = this.doodleFetch.getDrawing();
   
    this.previewBoxRef.nativeElement.innerHTML = this.draw.outerHTML;
    
  }

  scaleSVG() {
    
  }
  

}
