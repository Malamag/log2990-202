import { Component, ElementRef, OnInit /*, Renderer2*/, ViewChild } from '@angular/core';
import { fakeImages } from './fake_images';
@Component({
    selector: 'app-gallery',
    templateUrl: './gallery.component.html',
    styleUrls: ['./gallery.component.scss'],
})
export class GalleryComponent implements OnInit {
    fakeImage = fakeImages;
    filter: string;
    filterContainer: string[];
    @ViewChild('filterContainer', { static: false }) filters: ElementRef;
    constructor(/*private render: Renderer2*/) {
        this.filter = '';
        this.filterContainer = [];
    }

    ngOnInit() {}

    /*addFilter() {
    const newInput = this.render.createElement('input');
    this.render.setAttribute(newInput, 'type', 'text');
    this.render.appendChild(this.filters.nativeElement, newInput);
  }*/
}
