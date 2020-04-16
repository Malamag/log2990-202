import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { AfterViewInit, Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ContinueDrawingService } from 'src/app/services/continue-drawing/continue-drawing.service';
import { ModalWindowService } from 'src/app/services/window-handler/modal-window.service';
import { ShownData } from 'src/app/shown-data';
import { ImageData } from '../../../../../image-data';
import { SVGData } from '../../../../../svg-data';
import { ConnectionService } from '../../services/connection/connection.service';

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
    shownDrawings: ShownData[] = [];
    readonly inputTagSeparators: number[] = [ENTER, COMMA];
    tags: string[] = [];
    possibleTags: string[];
    filteredTags: Observable<string[]>;
    tagCtrl: FormControl = new FormControl();
    render: Renderer2;
    text: Element;
    hasLoaded: boolean;
    allLoaded: boolean;
    @ViewChild('cardsContainer', { static: false }) cardsContainer: ElementRef;
    @ViewChild('tagInput', { static: false }) tagInput: ElementRef<HTMLInputElement>;
    @ViewChild('auto', { static: false }) autoComplete: MatAutocomplete;
    constructor(
        public connect: ConnectionService,
        render: Renderer2,
        public winService: ModalWindowService,
        public continueDraw: ContinueDrawingService,
    ) {
        this.render = render;
        this.possibleTags = [];
        this.filteredTags = this.tagCtrl.valueChanges.pipe(
            startWith(null),
            map((tag: string | null) => (tag ? this.filter(tag) : this.possibleTags.slice())),
        );
        this.tags = [];
        this.hasLoaded = false;
        this.allLoaded = true;

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
            INPUT.value = '';
        }
        this.tagCtrl.setValue(null);
    }

    showMessage(): void {
        this.text = this.render.createText('en cours de chargement');

        this.render.appendChild(this.cardsContainer.nativeElement, this.text);
    }

    delete(id: string): void {
        this.allLoaded = false;
        try {
            this.connect.deleteImageById(id);
        } catch (error) {
            this.text = this.render.createText("L'élément ne peut pas être effacé car il n'existe pas sur le serveur");
        }

        // this.getAllImages();
        for (let i = 0; i < this.shownDrawings.length; ++i) {
            if (id === this.shownDrawings[i].id) {
                this.shownDrawings.splice(i, 1);
            }
        }
        if (this.shownDrawings.length === 0) {
            this.text = this.render.createText('Aucun dessin ne se trouve sur le serveur');
            this.render.appendChild(this.cardsContainer.nativeElement, this.text);
        }
        this.allLoaded = true;
    }

    getAllImages(): void {
        this.showMessage();

        this.connect.getAllImages().subscribe((data: ImageData[]) => {
            this.shownDrawings = [];
            if (data.length === 0) {
                this.render.removeChild(this.cardsContainer.nativeElement, this.text);
                this.text = this.render.createText('Aucun dessin ne se trouve sur le serveur');
                this.render.appendChild(this.cardsContainer.nativeElement, this.text);
            } else {
                data.forEach((im: ImageData) => {
                    const svg = this.createSVG(im.svgElement);
                    this.shownDrawings.push({
                        id: im.id,
                        svgElement: svg,
                        name: im.name,
                        tags: im.tags,
                        data: im.svgElement,
                        width: +im.svgElement.width,
                        height: +im.svgElement.height,
                    });
                });
                this.getAllTags(data);
            }
        });
        this.render.removeChild(this.cardsContainer, this.text);
        this.hasLoaded = true;
        this.allLoaded = true;

    }
    getImagesByTags(): void {
        this.allLoaded = false;
        this.render.removeChild(this.cardsContainer, this.text);
        if (!this.tags.length) {
            this.getAllImages();
        }
        this.showMessage();
        this.render.removeChild(this.cardsContainer, this.text);
        this.connect.getImagesByTags(this.tags).subscribe((data: ImageData[]) => {
            this.shownDrawings = [];
            if (data.length === 0) {
                this.text = this.render.createText('Aucun dessin correspond a vos critères de recherche');
                this.render.appendChild(this.cardsContainer.nativeElement, this.text);
            } else {
                data.forEach((im: ImageData) => {
                    const svg = this.createSVG(im.svgElement);
                    const SHOWN_DATA_TEMP = {
                        id: im.id,
                        svgElement: svg,
                        name: im.name,
                        tags: im.tags,
                        data: im.svgElement,
                        width: +im.svgElement.width,
                        height: +im.svgElement.height,
                    };
                    let exist = false;
                    this.shownDrawings.forEach((image) => {
                        if (image === SHOWN_DATA_TEMP) {
                            exist = true;
                        }
                    });
                    if (!exist) {this.shownDrawings.push(SHOWN_DATA_TEMP); }
                });
            }
        });
        this.allLoaded = true;
    }
    getAllTags(imageContainer: ImageData[]): void {
        this.allLoaded = false;
        imageContainer.forEach((image: ImageData) => {
            image.tags.forEach((tag) => {
                let tagExist = false;
                this.possibleTags.forEach((exTag) => {
                    if (tag === exTag) {
                        tagExist = true;
                    }
                });
                if (!tagExist) {
                    this.possibleTags.push(tag);
                }
            });
        });
        this.allLoaded = true;
    }
    // source: https://material.angular.io/components/chips/examples
    selected(event: MatAutocompleteSelectedEvent): void {
        this.tags.push(event.option.value);
        this.tagInput.nativeElement.value = '';
        this.tagCtrl.setValue(null);
    }

    filter(value: string): string[] {
        const FILTER_VALUE = value.toLowerCase();
        return this.possibleTags.filter((tag: string) => tag.toLowerCase().indexOf(FILTER_VALUE) === 0);
    }

    continueDrawing(data: SVGData): void {
        this.allLoaded = false;
        this.continueDraw.continueDrawing(data);
        this.allLoaded = true;
        this.winService.closeWindow();
    }
    // The setAttributes below might be useless, as the subscription in SvgDrawComponent already set all the attributes
    createSVG(data: SVGData): Element {
        const SVG = this.render.createElement('svg', 'http://www.w3.org/2000/svg');
        this.render.setAttribute(SVG, 'width', data.width);
        this.render.setAttribute(SVG, 'height', data.height);
        const RECT = this.render.createElement('rect', 'svg');
        if (data.bgColor.charAt(0) !== '#') {
            data.bgColor = '#' + data.bgColor;
        }
        this.render.setAttribute(RECT, 'fill', data.bgColor);
        this.render.setAttribute(RECT, 'height', '100%');
        this.render.setAttribute(RECT, 'width', '100%');
        this.render.appendChild(SVG, RECT);
        data.innerHTML.forEach((str) => {
            const TAG = this.render.createElement('g', 'http://www.w3.org/2000/svg');
            if (TAG !== undefined) {
                TAG.innerHTML = str;
                this.render.appendChild(SVG, TAG);
            }
        });
        return SVG;
    }
}
