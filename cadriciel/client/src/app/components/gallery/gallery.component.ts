import { Component, OnInit, Renderer2, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { fakeImages } from './fake_images';
import { MatChipInputEvent } from '@angular/material/chips';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { IndexService } from './../../services/index/index.service'
import { ImageData } from '../../imageData'
import { FormControl } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material';
import { map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';


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
export class GalleryComponent implements OnInit, AfterViewInit {
    fakeImage = fakeImages;
    drawings: Observable<ImageData[]>;
    readonly inputTagSeparators: number[] = [ENTER, COMMA];
    tags: string[] = [];
    private possibleTags: string[];
    filteredTags: Observable<string[]>;
    tagCtrl = new FormControl();
    render: Renderer2;
    @ViewChild('cardsContainer', { static: false }) cardsContainer: ElementRef
    @ViewChild('tagInput', { static: false }) tagInput: ElementRef<HTMLInputElement>
    @ViewChild('auto', { static: false }) autoComplete: MatAutocomplete;
    constructor(private index: IndexService, render: Renderer2) {
        this.render = render;
        //this.index.pupolatedBd();
        this.possibleTags = [];
        this.filteredTags = this.tagCtrl.valueChanges.pipe(
            startWith(null),
            map((tag: string | null) => tag ? this.filter(tag) : this.possibleTags.slice())
        )
    }

    ngOnInit() {
        //this.getAllImages();
    }
    ngAfterViewInit() {
        //this.getAllImages();
        this.getImagesByTags(['none']);
    }
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
        // resets the input after insertion
        if (INPUT) {
            INPUT.value = ' ';
        }
        this.tagCtrl.setValue(null);
    }
    showMessage() {
        const text = this.render.createText('en cours de chargement');
        this.render.appendChild(this.cardsContainer.nativeElement, text);
        return text;
    }
    delete(id: string) {
        this.index.deleteImageById(id);

        this.getAllImages();
    }

    async getAllImages() {
        const text = this.showMessage();
        this.drawings = await this.index.getAllImages()
        this.render.removeChild(this.cardsContainer, text);
        this.drawings.subscribe((data) => {
            console.log(data);
            this.getAllTags(data);
        })

    }
    async getImagesByTags(tags: string[]) {
        const text = this.showMessage();
        this.drawings = await this.index.getImagesByTags(tags);
        this.render.removeChild(this.cardsContainer, text);
        this.drawings.subscribe((data) => {
            console.log(data);
            this.getAllTags(data);
        })

    }
    getAllTags(imageContainer: ImageData[]): void {
        imageContainer.forEach(image => {
            for (let i = 0; i < image.tags.length; ++i) {
                let tagExist: boolean = false;
                for (let j = 0; j < this.possibleTags.length; ++j) {
                    if (image.tags[i] === this.possibleTags[j]) {
                        tagExist = true;
                    }
                }
                if (!tagExist) { this.possibleTags.push(image.tags[i]) }
            }
        })
    }
    //source: https://material.angular.io/components/chips/examples
    selected(event: MatAutocompleteSelectedEvent) {
        this.tags.push(event.option.value);
        this.tagInput.nativeElement.value = '';
        this.tagCtrl.setValue(null);
    }
    private filter(value: string): string[] {
        const filterValue = value.toLowerCase()
        return this.possibleTags.filter(tag => tag.toLowerCase().indexOf(filterValue) === 0)
    }
}
