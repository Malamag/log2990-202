import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { InteractionService } from 'src/app/services/service-interaction/interaction.service';
import { toolsItems } from '../../../functionality';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';
@Component({
    selector: 'app-tool-box',
    templateUrl: './tool-box.component.html',
    styleUrls: ['./tool-box.component.scss'],
})
export class ToolBoxComponent implements OnInit {
    funcTools = toolsItems;

    activeButton: any;

    disableUndo: boolean;
    disableRedo: boolean;
    // I doubt if we can delete these two
    @ViewChild('toolsOptionsRef', { static: false }) navBarRef: ElementRef;
    selectingToolsMap = new Map();

    constructor(public interactionService: InteractionService, iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
        iconRegistry.addSvgIcon('redo', sanitizer.bypassSecurityTrustResourceUrl('../../../assets/images/redo.svg'));
        iconRegistry.addSvgIcon('undo', sanitizer.bypassSecurityTrustResourceUrl('../../../assets/images/undo.svg'));

        this.selectingToolsMap.set('1', 'Rectangle');
        this.selectingToolsMap.set('c', 'Crayon');
        this.selectingToolsMap.set('w', 'Pinceau');
        this.selectingToolsMap.set('l', 'Ligne');
        this.selectingToolsMap.set('2', 'Ellipse');
        this.selectingToolsMap.set('3', 'Polygone');
        this.selectingToolsMap.set('u', 'Annuler');
        this.selectingToolsMap.set('r', 'Refaire');
        this.disableUndo = true;
        this.disableRedo = true;
    }
    @HostListener('document: keydown', ['$event'])
    updateBoard(event: KeyboardEvent) {
        // keyCode 90 for z
        if (event.ctrlKey && event.keyCode === 90) {
            if (event.shiftKey) {
                this.buttonAction(this.selectingToolsMap.get('r'));
            } else {
                this.buttonAction(this.selectingToolsMap.get('u'));
            }
        } else if (this.selectingToolsMap.has(event.key)) {
            this.buttonAction(this.selectingToolsMap.get(event.key));
        }
    }

    ngOnInit() {
        this.interactionService.$enableDisableButtons.subscribe(disableContainer => {
            this.disableUndo = disableContainer[0];
            this.disableRedo = disableContainer[1];
        });
    }

    buttonAction(name: string) {
        // on click, emit the selected tool name
        this.interactionService.emitSelectedTool(name);
        this.activeButton = name;
    }
}
