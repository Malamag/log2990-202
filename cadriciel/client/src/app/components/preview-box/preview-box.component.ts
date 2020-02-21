import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { DoodleFetchService } from 'src/app/services/doodle-fetch/doodle-fetch.service';

@Component({
  selector: 'app-preview-box',
  templateUrl: './preview-box.component.html',
  styleUrls: ['./preview-box.component.scss']
})
export class PreviewBoxComponent implements OnInit, AfterViewInit {
  draw: SVGElement;

  
  @ViewChild('imgBox', {static:false}) export: ElementRef; // has an eye on the <canvas> element
 
  constructor(private doodleFetch: DoodleFetchService) { }

  ngOnInit() {
    this.doodleFetch.askForDoodle();
  }

  ngAfterViewInit() {
    this.draw = this.doodleFetch.getDrawing();
  }
  

}
