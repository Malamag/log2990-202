import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { AfterViewInit, Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Canvas } from 'src/app/models/Canvas.model';
import { DoodleFetchService } from 'src/app/services/doodle-fetch/doodle-fetch.service';
import { GridRenderService } from 'src/app/services/grid/grid-render.service';
import { InteractionService } from 'src/app/services/service-interaction/interaction.service';
import { ModalWindowService } from 'src/app/services/window-handler/modal-window.service';
import { ShownData } from 'src/app/shownData';
import { SVGData } from 'src/svgData';
import { ImageData } from '../../imageData';
import { IndexService } from './../../services/index/index.service';

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
    drawings: Observable<ImageData[]>;
    shownDrawings: ShownData[] = [];
    readonly inputTagSeparators: number[] = [ENTER, COMMA];
    tags: string[] = [];
    possibleTags: string[];
    filteredTags: Observable<string[]>;
    tagCtrl = new FormControl();
    render: Renderer2;
    text: Element;
    @ViewChild('cardsContainer', { static: false }) cardsContainer: ElementRef;
    @ViewChild('tagInput', { static: false }) tagInput: ElementRef<HTMLInputElement>;
    @ViewChild('auto', { static: false }) autoComplete: MatAutocomplete;
    constructor(
        public index: IndexService,
        render: Renderer2,
        public doodle: DoodleFetchService,
        public interact: InteractionService,
        public gridService: GridRenderService,
        public winService: ModalWindowService,
    ) {
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
        try {
            this.index.deleteImageById(id);
        } catch (error) {
            this.text = this.render.createText("l'élément ne peut pas être effacé car il n'existe pas sur le serveur");
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
    }

    getAllImages(): void {
        this.shownDrawings = [];
        this.showMessage();
        this.drawings = this.index.getAllImages();
        this.render.removeChild(this.cardsContainer, this.text);
        this.drawings.subscribe((data: ImageData[]) => {
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
            }
        });
    }
    getAllTags(imageContainer: ImageData[]): void {
        imageContainer.forEach((image: ImageData) => {
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
    filter(value: string): string[] {
        const filterValue = value.toLowerCase();
        return this.possibleTags.filter((tag: string) => tag.toLowerCase().indexOf(filterValue) === 0);
    }
    continueDrawing(data: SVGData) {
        this.doodle.askForDoodle();
        const el = this.doodle.currentDraw.nativeElement;
        this.render.setAttribute(el, 'width', data.width);
        this.render.setAttribute(el, 'height', data.height);
        const childs: HTMLCollection = el.children;
        for (let i = 0; i < childs.length; ++i) {
            if (i === 0 && data.bgColor !== null) {
                childs[i].setAttribute('fill', data.bgColor.substring(6, 24));
            }
            if (data.innerHTML[i] === undefined) {
                childs[i].innerHTML = '';
            } else {
                childs[i].innerHTML = data.innerHTML[i];
            }
        }

        const CANVAS_ATTRS: Canvas = { canvasWidth: +data.width, canvasHeight: +data.height, canvasColor: '#ffffffff' };
        this.interact.emitGridAttributes(CANVAS_ATTRS);

        this.interact.emitCanvasRedone();
        this.winService.closeWindow();
    }
    createSVG(data: SVGData) {
        const svg = this.render.createElement('svg', 'http://www.w3.org/2000/svg');
        this.render.setAttribute(svg, 'width', data.width);
        this.render.setAttribute(svg, 'height', data.height);
        const rect = this.render.createElement('rect', 'svg');
        if (data.bgColor !== null) {
            this.render.setAttribute(rect, 'fill', data.bgColor.substring(6, 24));
        }
        this.render.setAttribute(rect, 'height', '100%');
        this.render.setAttribute(rect, 'width', '100%');
        this.render.appendChild(svg, rect);

        for (let i = 0; i < data.innerHTML.length; ++i) {
            const tag = this.render.createElement('g', 'http://www.w3.org/2000/svg');
            if (tag !== undefined){
                tag.innerHTML = data.innerHTML[i];
                this.render.appendChild(svg, tag);
            }
        }

        return svg;
    }
}
