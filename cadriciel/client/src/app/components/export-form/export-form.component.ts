import { AfterContentInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCheckbox } from '@angular/material';
import { DoodleFetchService } from 'src/app/services/doodle-fetch/doodle-fetch.service';
import { EmailExporterService } from 'src/app/services/exportation/email-exporter.service';
import { ExportService } from 'src/app/services/exportation/export.service';
import { ImageFilterService } from 'src/app/services/exportation/image-filter/image-filter.service';
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

    filters: { num: number | null; view: string }[] = [
        { num: -1, view: 'Aucun' },
        { num: 0, view: 'Noir & blanc' },
        { num: 1, view: 'Rotation de teinte' },
        { num: 2, view: 'Bruit' },
        { num: 3, view: 'Lisse' },
        { num: 4, view: 'Texture' },
    ];

    @ViewChild('imgConvert', { static: false }) exportFromCanvas: ElementRef; // has an eye on the <canvas> element
    checked: boolean;
    constructor(
        private formBuilder: FormBuilder,
        private winService: ModalWindowService,
        private doodleFetch: DoodleFetchService,
        private expService: ExportService,
        private imgFilter: ImageFilterService,
        private mailExport: EmailExporterService,
    ) {
        this.checked = false;
    }

    exportForm: FormGroup;
    doodle: Node;

    exportMode: number;
    cWidth: number; // attributes to get the correct export size
    cHeigth: number;

    selectedFilter: number;

    ngOnInit(): void {
        this.initForm();
        this.doodleFetch.askForDoodle();
        this.cWidth = this.doodleFetch.widthAttr;
        this.cHeigth = this.doodleFetch.heightAttr;
        this.exportMode = 0;
    }

    initForm(): void {
        this.exportForm = this.formBuilder.group({
            doodleName: ['Dessin sans titre', Validators.required],
            formatSel: [null, Validators.required],
            email: ['xxxx@yyyy.zzz', Validators.required],
        });
    }

    ngAfterContentInit(): void {
        this.doodle = this.doodleFetch.getDrawingWithoutGrid();
        console.log(this.doodle);
    }

    /*
        Maybe a boolean checking if isMail? then call exportation or exportAsMail
    */
    onSubmit(): void {
        const FORMVAL = this.exportForm.value;
        const TYPE = FORMVAL.formatSel;
        const NAME = FORMVAL.doodleName;

        switch (this.exportMode) {
            case 0:
                this.exportation(NAME, TYPE);
                break;
            case 1:
                this.exportAsEmail(NAME, TYPE, FORMVAL.email);
                break;
        }

        this.closeForm();
    }

    closeForm(): void {
        this.winService.closeWindow();
    }

    exportation(name: string, type: string): void {
        this.expService.exportInCanvas(this.doodle, this.exportFromCanvas.nativeElement, name, type);
    }

    exportAsEmail(name: string, type: string, email: string): void {
        this.mailExport.exportByMail(this.doodle, name, this.exportFromCanvas.nativeElement, type, email);
    }

    applyFilter(event: number): void {
        this.selectedFilter = event;
        this.imgFilter.toggleFilter(this.doodle, this.selectedFilter);
    }

    blockEvent(ev: KeyboardEvent): void {
        ev.stopPropagation();
    }

    emailExportStatus(event: MatCheckbox): void {
        if (event.checked) {
            this.checked = true;
            this.exportMode = 1;
        } else {
            this.checked = false;
            this.exportMode = 0;
        }
    }
}
