import { Component, OnInit } from '@angular/core';
import { fakeImages } from './fake_images';
import { MatChipInputEvent } from '@angular/material/chips';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
@Component({
    selector: 'app-gallery',
    templateUrl: './gallery.component.html',
    styleUrls: ['./gallery.component.scss'],
})

/**
 * The addTag/removeTag functions as well as the mat-chips-list template is inspired by the examples given
 * in the Angular Material documentation on Chips elements. SOURCE:
 * Angular Material (Google). "Chips" (01/03/2020). En ligne: https://material.angular.io/components/chips/examples
 */
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
    blockEvent(ev: KeyboardEvent) {
        ev.stopPropagation();
    }
    removeTag(tag: string) {
        const INDEX: number = this.tags.indexOf(tag);
        if (INDEX >= 0) {
            // making sure the tag exists in the array
            this.tags.splice(INDEX, 1);
        }
    }

    addTag(tagAdd: MatChipInputEvent) {
        const INPUT: HTMLInputElement = tagAdd.input;
        const VAL: string = tagAdd.value;
        if (VAL !== '') {
            this.tags.push(VAL);
        }

        INPUT.value = ''; // resets the input after insertion
    }
}
