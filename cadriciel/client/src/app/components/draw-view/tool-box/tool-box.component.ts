import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { InteractionService } from 'src/app/services/service-interaction/interaction.service';
import { toolsItems } from '../../../functionality';
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

    constructor(public interactionService: InteractionService) {
        this.selectingToolsMap.set('1', 'Rectangle');
        this.selectingToolsMap.set('c', 'Crayon');
        this.selectingToolsMap.set('w', 'Pinceau');
        this.selectingToolsMap.set('l', 'Ligne');
        this.selectingToolsMap.set('2', 'Ellipse');
        this.selectingToolsMap.set('3', 'Polygone');
        this.selectingToolsMap.set('r', 'Applicateur de couleur');
        this.selectingToolsMap.set('ctrl+z', 'Annuler');
        this.selectingToolsMap.set('ctrl+shift+z', 'Refaire');
        this.selectingToolsMap.set('s', 'Sélectionner');
        this.selectingToolsMap.set('e', 'Efface');
        this.selectingToolsMap.set('r', 'ApplicateurCouleur');
        this.disableUndo = true;
        this.disableRedo = true;
    }
    @HostListener('document: keydown', ['$event'])
    updateBoard(event: KeyboardEvent) {
        // keyCode 90 for z
        if (event.ctrlKey && event.keyCode === 90) {
            if (event.shiftKey) {
                this.buttonAction(this.selectingToolsMap.get('ctrl+shift+z'));
            } else {
                this.buttonAction(this.selectingToolsMap.get('ctrl+z'));
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
