import { F12 } from '@angular/cdk/keycodes';
import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { InteractionService } from 'src/app/services/service-interaction/interaction.service';
import { toolsItems } from '../../../functionality';
import { IconsService } from '../../../services/icons.service';
const Z_KEY_CODE = 90;
const C_KEY_CODE = 67;
const V_KEY_CODE = 86;
const D_KEY_CODE = 68;
const X_KEY_CODE = 88;
@Component({
    selector: 'app-tool-box',
    templateUrl: './tool-box.component.html',
    styleUrls: ['./tool-box.component.scss'],
})
export class ToolBoxComponent implements OnInit {
    // an interface
    // tslint:disable-next-line: typedef
    funcTools = toolsItems;

    activeButton: string;

    disableUndo: boolean;
    disableRedo: boolean;
    // I doubt if we can delete these two
    @ViewChild('toolsOptionsRef', { static: false }) navBarRef: ElementRef;
    // tslint:disable-next-line: typedef
    selectingToolsMap = new Map();

    constructor(public interactionService: InteractionService, public icons: IconsService) {
        this.selectingToolsMap.set('1', 'Rectangle');
        this.selectingToolsMap.set('c', 'Crayon');
        this.selectingToolsMap.set('w', 'Pinceau');
        this.selectingToolsMap.set('l', 'Ligne');
        this.selectingToolsMap.set('a', 'Aérosol');
        this.selectingToolsMap.set('2', 'Ellipse');
        this.selectingToolsMap.set('3', 'Polygone');
        this.selectingToolsMap.set('r', 'Applicateur de couleur');
        this.selectingToolsMap.set('ctrl+z', 'Annuler');
        this.selectingToolsMap.set('ctrl+shift+z', 'Refaire');
        this.selectingToolsMap.set('s', 'Sélectionner');
        this.selectingToolsMap.set('e', 'Efface');
        this.selectingToolsMap.set('i', 'Pipette');
        this.selectingToolsMap.set('t', 'Texte');
        this.selectingToolsMap.set('ctrl+c', 'Copier');
        this.selectingToolsMap.set('ctrl+v', 'Coller');
        this.selectingToolsMap.set('ctrl+d', 'Dupliquer');
        this.selectingToolsMap.set('Delete', 'Supprimer');
        this.selectingToolsMap.set('ctrl+x', 'Couper');
        this.selectingToolsMap.set('b', 'Sceau de peinture');
        this.disableUndo = true;
        this.disableRedo = true;
    }
    @HostListener('document: keydown', ['$event'])
    updateBoard(event: KeyboardEvent): void {
        // tslint:disable-next-line: deprecation
        if (event.keyCode !== F12) {
            event.preventDefault();
        }
        if (event.ctrlKey) {
            // tslint:disable-next-line: deprecation
            switch (event.keyCode) {
                case C_KEY_CODE:
                    this.buttonAction(this.selectingToolsMap.get('ctrl+c'));
                    break;
                case V_KEY_CODE:
                    this.buttonAction(this.selectingToolsMap.get('ctrl+v'));
                    break;
                case D_KEY_CODE:
                    this.buttonAction(this.selectingToolsMap.get('ctrl+d'));
                    break;
                case X_KEY_CODE:
                    this.buttonAction(this.selectingToolsMap.get('ctrl+x'));
                    break;
                case Z_KEY_CODE:
                    if (event.shiftKey) {
                        this.buttonAction(this.selectingToolsMap.get('ctrl+shift+z'));
                    } else {
                        this.buttonAction(this.selectingToolsMap.get('ctrl+z'));
                    }
                    break;
            }
        } else if (this.selectingToolsMap.has(event.key) && !event.ctrlKey) {
            this.buttonAction(this.selectingToolsMap.get(event.key));
        }
    }

    ngOnInit(): void {
        this.disableUndo = true;
        this.disableRedo = true;
        this.interactionService.$enableDisableButtons.subscribe((disableContainer) => {
            this.disableUndo = disableContainer[0];
            this.disableRedo = disableContainer[1];
        });
    }

    buttonAction(name: string): void {
        // on click, emit the selected tool name
        this.interactionService.emitSelectedTool(name);
        if (name !== 'Annuler' && name !== 'Refaire' && name !== 'Copier' && name !== 'Coller'
            && name !== 'Couper' && name !== 'Supprimer' && name !== 'Dupliquer') {
            this.activeButton = name;
        }
    }
}
