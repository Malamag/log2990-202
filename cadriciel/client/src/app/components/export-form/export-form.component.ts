import { AfterContentInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DoodleFetchService } from 'src/app/services/doodle-fetch/doodle-fetch.service';
import { ExportService } from 'src/app/services/exportation/export.service';
import { ModalWindowService } from 'src/app/services/window-handler/modal-window.service';

@Component({
    selector: 'app-export-form',
    templateUrl: './export-form.component.html',
    styleUrls: ['./export-form.component.scss'],
})
export class ExportFormComponent implements OnInit, AfterContentInit {
    formats: { type: string; view: string }[] = [
        // idea from angular material's site on select (TODO SRC)
        { type: 'jpeg', view: '.jpeg' },
        { type: 'png', view: '.png' },
        { type: 'svg', view: '.svg' },
    ];

    textures: { type: string; intensity: number; frequency: number }[] = [
        { type: 'blured', intensity: 5, frequency: 0 },
        { type: 'noise', intensity: 0.5, frequency: 0.5 },
        { type: 'noise', intensity: 0.3, frequency: 0.3 },
        { type: 'noise', intensity: 0.9, frequency: 0.3 },
        { type: 'noise', intensity: 0.3, frequency: 0.9 },
    ];

    @ViewChild('imgBox', { static: false }) export: ElementRef; // has an eye on the <canvas> element

    constructor(
        private formBuilder: FormBuilder,
        private winService: ModalWindowService,
        private doodleFetch: DoodleFetchService,
        private expService: ExportService,
    ) {}

    exportForm: FormGroup;
    doodle: SVGElement;

    cWidth: number; // attributes to get the correct export size
    cHeigth: number;

    ngOnInit() {
        this.initForm();
        this.doodleFetch.askForDoodle();
        this.cWidth = this.doodleFetch.widthAttr;
        this.cHeigth = this.doodleFetch.heightAttr;
    }

    initForm() {
        this.exportForm = this.formBuilder.group({
            doodleName: ['Dessin sans titre', Validators.required],
            formatSel: [null, Validators.required],
        });
    }

    ngAfterContentInit() {
        this.doodle = this.doodleFetch.getDrawing();
    }

    onSubmit() {
        const FORMVAL = this.exportForm.value;

        const TYPE = FORMVAL.formatSel;
        const NAME = FORMVAL.doodleName;

        this.exportation(NAME, TYPE);

        this.closeForm();
    }

    closeForm() {
        this.winService.closeWindow();
    }

    exportation(name: string, type: string) {
        this.expService.exportInCanvas(this.doodle, this.export, name, type);
    }
}
