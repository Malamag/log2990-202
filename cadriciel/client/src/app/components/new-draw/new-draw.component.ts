import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalWindowService } from 'src/app/services/window-handler/modal-window.service';
import { CanvasBuilderService } from '../../services/drawing/canvas-builder.service';

@Component({
    selector: 'app-new-draw',
    templateUrl: './new-draw.component.html',
    styleUrls: ['./new-draw.component.scss'],
})
export class NewDrawComponent implements OnInit {
    paletteArray: {};

    newDrawForm: FormGroup;
    width: number;
    height: number;
    color: string;

    inputEntered: boolean;

    constructor(
        private formBuilder: FormBuilder,
        private canvasBuilder: CanvasBuilderService,
        private winService: ModalWindowService,
        private router: Router,
    ) {
        this.paletteArray = this.canvasBuilder.getPalleteAttributes();
    }

    ngOnInit(): void {
        this.initForm();
        this.resizeCanvas();
        this.color = this.canvasBuilder.getDefColor();
        this.inputEntered = true;
        window.addEventListener('resize', () => {
            if (this.inputEntered) {
                this.resizeCanvas();
            }
        });
    }

    blockEvent(ev: KeyboardEvent): void {
        ev.stopPropagation();

        this.inputEntered = false;
    }

    resizeCanvas(): void {
        this.width = this.canvasBuilder.getDefWidth();
        this.height = this.canvasBuilder.getDefHeight();
    }

    initForm(): void {
        this.newDrawForm = this.formBuilder.group({
            canvWidth: ['', [Validators.pattern(/^\d+$/), Validators.min(1)]], // accepts only positive integers
            canvHeight: ['', [Validators.pattern(/^\d+$/), Validators.min(1)]],
            canvColor: ['', Validators.pattern(/^[a-fA-F0-9]{6}$/)], // only accepts 6-chars strings made of hex characters
        });

        this.newDrawForm.setValue({
            canvWidth: this.canvasBuilder.getDefWidth(),
            canvHeight: this.canvasBuilder.getDefHeight(),
            canvColor: this.canvasBuilder.getDefColor(),
        });
    }

    onSubmit(): void {
        const values = this.newDrawForm.value;
        this.canvasBuilder.setCanvasFromForm(+values.canvWidth, +values.canvHeight, values.canvColor);
        this.canvasBuilder.emitCanvas();
        this.closeModalForm();
        this.router.navigate(['/vue']);
        const TIME_LOAD = 15;
        setTimeout(() => {
            window.dispatchEvent(new Event('resize'));
        }, TIME_LOAD); // waits for the canvas to be created
    }

    closeModalForm(): void {
        this.winService.closeWindow();
    }

    get canvHeight(): AbstractControl | null {
        // basic accessors to get individual input validity in html
        return this.newDrawForm.get('canvHeight');
    }

    get canvWidth(): AbstractControl | null {
        return this.newDrawForm.get('canvWidth');
    }

    get canvColor(): AbstractControl | null {
        return this.newDrawForm.get('canvColor');
    }

    updateColor(newColor: string): void {
        this.color = newColor.slice(1); // removes the '#'
        this.newDrawForm.patchValue({ canvColor: this.color }); // updates value for form
    }
}
