import { Component, OnInit } from '@angular/core';
import { fakeImages } from './fake_images';
import { MatChipInputEvent } from '@angular/material/chips';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
@Component({
    selector: 'app-gallery',
    templateUrl: './gallery.component.html',
    styleUrls: ['./gallery.component.scss'],
})
export class GalleryComponent implements OnInit {
    fakeImage = fakeImages;
    filter: string = '';
    readonly inputTagSeparators: number[] = [ENTER, COMMA];
    tags: string[] = [];
    // @ViewChild('filterContainer', { static: false }) filters: ElementRef;
    constructor(/*private render: Renderer2*/) {}

    ngOnInit() {}

    /*addFilter() {
    const newInput = this.render.createElement('input');
    this.render.setAttribute(newInput, 'type', 'text');
    this.render.appendChild(this.filters.nativeElement, newInput);
  }*/
    removeTag(tag: string) {
        const INDEX = this.tags.indexOf(tag);
        if (INDEX >= 0) {
            // making sure the tag exists in the array
            this.tags.splice(INDEX, 1);
        }
    }

    addTag(tagAdd: MatChipInputEvent) {}
}
