import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Renderer2} from '@angular/core';
import {fakeImages} from './fake_images'
@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit, AfterViewInit{
  fakeImage = fakeImages;
  filter: string;
  filterContainer: string[];
  @ViewChild('filterContainer', {static: false}) filters: ElementRef;
  constructor(private render: Renderer2) { 
    this.filter = '';
    this.filterContainer = [];
  }

  ngOnInit() {
  }
  ngAfterViewInit(){
    
  }
  AddFilter(){
    const newInput = this.render.createElement('input');
    this.render.setAttribute(newInput, 'type', 'text');
    this.render.appendChild(this.filters.nativeElement, newInput);
  }
}
