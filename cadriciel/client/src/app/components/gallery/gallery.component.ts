import { FormControl } from '@angular/forms';
import { COMMA, ENTER} from '@angular/cdk/keycodes';
import { Component, Renderer2, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { DoodleFetchService } from 'src/app/services/doodle-fetch/doodle-fetch.service';
import { ImageData } from '../../imageData'
import { fakeImages } from './fake_images';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { IndexService } from './../../services/index/index.service'
import { SVGData } from 'src/svgData';
import { ShownData } from 'src/app/shownData';


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
export class GalleryComponent implements AfterViewInit {
    fakeImage = fakeImages;
    drawings: Observable<ImageData[]>;
    shownDrawings : ShownData[] = [];
    readonly inputTagSeparators: number[] = [ENTER, COMMA];
    tags: string[] = [];
    private possibleTags: string[];
    filteredTags: Observable<string[]>;
    tagCtrl = new FormControl();
    render: Renderer2;
    text: Element;
    @ViewChild('cardsContainer', { static: false }) cardsContainer: ElementRef;
    @ViewChild('tagInput', { static: false }) tagInput: ElementRef<HTMLInputElement>;
    @ViewChild('auto', { static: false }) autoComplete: MatAutocomplete;
    constructor(private index: IndexService, render: Renderer2, private doodle: DoodleFetchService) {
        this.render = render;
        this.possibleTags = [];
        this.filteredTags = this.tagCtrl.valueChanges.pipe(
            startWith(null),
            map((tag: string | null) => (tag ? this.filter(tag) : this.possibleTags.slice())),
        );
        this.tags = [];
    }

    ngAfterViewInit(): void {
        this.getAllImages();
    }
    blockEvent(ev: KeyboardEvent): void {
        ev.stopPropagation();
    }
    removeTag(tag: string): void {
        const INDEX: number = this.tags.indexOf(tag);
        if (INDEX >= 0) {
            // making sure the tag exists in the array
            this.tags.splice(INDEX, 1);
        }
    }

    addTag(tagAdd: MatChipInputEvent): void {
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
    showMessage(): void {
        this.text = this.render.createText('en cours de chargement');
        this.render.appendChild(this.cardsContainer.nativeElement, this.text);
    }
    delete(id: string): void {
        this.index.deleteImageById(id);

        this.getAllImages();
    }

    getAllImages(): void {
        this.showMessage();
        this.drawings = this.index.getAllImages();
        this.render.removeChild(this.cardsContainer, this.text);
        this.drawings.subscribe((data: ImageData[]) => {
            if (data.length === 0) {
                this.render.removeChild(this.cardsContainer.nativeElement, this.text);
                this.text = this.render.createText('Aucun dessin ne se trouve sur le serveur');
                this.render.appendChild(this.cardsContainer.nativeElement, this.text);
            }
            else{
                data.forEach((im) => {
                    const svg = this.createSVG(im.svgElement);
                    this.shownDrawings.push({id: im.id, svgElement: svg[2], name: im.name, tags: im.tags,
                        data: im.svgElement, width: svg[0], height: svg[1]});
                })
                this.getAllTags(data);
            }
            
        })

    }
    getImagesByTags(): void {
        if (!this.tags.length) {
            this.getAllImages();
        }
        this.showMessage();
        this.drawings = this.index.getImagesByTags(this.tags);
        this.render.removeChild(this.cardsContainer, this.text);
        this.drawings.subscribe((data: ImageData[]) => {
            if (data.length === 0) {
                this.render.removeChild(this.cardsContainer, this.text);
                this.text = this.render.createText('Aucun dessin correspond a vos critères de recherche');
                this.render.appendChild(this.cardsContainer.nativeElement, this.text);
            }
            else{
                data.forEach((im) => {
                    const svg = this.createSVG(im.svgElement);
                    this.shownDrawings.push({id: im.id, svgElement: svg[2], name: im.name, tags: im.tags,
                         data: im.svgElement, width: svg[0], height: svg[1]});
                })
            }
        });
    }
    getAllTags(imageContainer: ImageData[]): void {
        imageContainer.forEach(image => {
            for (let i = 0; i < image.tags.length; ++i) {
                let tagExist = false;
                for (let j = 0; j < this.possibleTags.length; ++j) {
                    if (image.tags[i] === this.possibleTags[j]) {
                        tagExist = true;
                    }
                }
                if (!tagExist) {
                    this.possibleTags.push(image.tags[i]);
                }
            }
        });
    }
    // source: https://material.angular.io/components/chips/examples
    selected(event: MatAutocompleteSelectedEvent): void {
        this.tags.push(event.option.value);
        this.tagInput.nativeElement.value = '';
        this.tagCtrl.setValue(null);
    }
    private filter(value: string): string[] {
        const filterValue = value.toLowerCase()
        return this.possibleTags.filter((tag) => tag.toLowerCase().indexOf(filterValue) === 0)
    }
    continueDrawing(data: SVGData) {
        this.doodle.askForDoodle();
        const el = this.doodle.currentDraw.nativeElement;
        if(data.canvasStyle !== null) {
            this.render.setAttribute(el, 'width', data.canvasStyle.substring(7, 13))
            this.render.setAttribute(el, 'height', data.canvasStyle.substring(23, 28));
        }
        const childs: HTMLCollection = el.children;
        for(let i = 0; i < childs.length; ++i) {
            if (i === 0 && data.bgColor !== null) {childs[i].setAttributeNS('http://www.w3.org/2000/svg', 'fill', data.bgColor)};
            if (data.innerHTML[i] === undefined) {
                childs[i].innerHTML = '';
            } else {
                childs[i].innerHTML = data.innerHTML[i]
            }
        }
    }
    createSVG(data: SVGData) {
        let variables : [number, number, any] = [0, 0, 3] 
        const svg = this.render.createElement('svg','http://www.w3.org/2000/svg');
        if(data.canvasStyle !== null) {
            this.render.setAttribute(svg, 'width', data.canvasStyle.substring(7, 13))
            console.log(data.canvasStyle.substring(7, 13))
            variables[0] = +data.canvasStyle.substring(7, 11); 
            this.render.setAttribute(svg, 'height', data.canvasStyle.substring(23, 28));
            variables[1] = + data.canvasStyle.substring(23, 26);
        }
        const rect = this.render.createElement('rect', 'svg');
        if (data.bgColor !== null) {this.render.setAttribute(rect, 'fill', data.bgColor)}
        this.render.setAttribute(rect, 'height', '100%');
        this.render.setAttribute(rect, 'width', '100%');
        this.render.appendChild(svg, rect);
        const tag = this.render.createElement('g', 'svg');
        for(let i = 0; i < data.innerHTML.length; ++i){
            if(data.innerHTML[i] !== '' || data.innerHTML[i] !== undefined ) { tag.innerHTML = data.innerHTML[i]}
        }
        this.render.appendChild(svg, tag);
        variables[2] = svg;
        return variables;
    }
}
