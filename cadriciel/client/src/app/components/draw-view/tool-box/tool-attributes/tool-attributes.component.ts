import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { AerosolAttributes } from 'src/app/services/attributes/aerosol-attribute';
import { InteractionService } from 'src/app/services/service-interaction/interaction.service';

@Component({
    selector: 'app-tool-attributes',
    templateUrl: './tool-attributes.component.html',
    styleUrls: ['./tool-attributes.component.scss'],
})
export class ToolAttributesComponent implements OnInit, OnDestroy, AfterViewInit {
    lineThickness: number;
    texture: number;
    numberCorners: number; // not done
    plotType: number;
    emissionPerSecond: number;
    diameter: number;
    junction: boolean;
    junctionRadius: number;
    selectedTool: String;
    tools: string[] = [];

    pipettePreviewFill: string;
    constructor(public interaction: InteractionService) {
        this.tools = [
            'Rectangle',
            'Ligne',
            'Pinceau',
            'Crayon',
            'Sélection de couleur',
            'Ellipse',
            'Polygone',
            'Pipette',
            'Aérosol',
            'ApplicateurCouleur',
        ];
        this.lineThickness = 5; // 5px thick line
        this.texture = 0; // blur texture

        this.numberCorners = 3; // for polygon

        this.emissionPerSecond = 50;
        this.diameter = 50;

        this.plotType = 2; // type 2 --> filled with border
        this.junction = true; // with junction dots of 6 px size
        this.junctionRadius = 6;
        this.selectedTool = 'Crayon';
    }

    ngOnInit() {
        this.interaction.$selectedTool.subscribe((tool) => {
            let toolExist = false;
            this.tools.forEach((el) => {
                if (el === tool) {
                    toolExist = true;
                }
            });
            if (toolExist) {
                this.selectedTool = tool;
            }
            const CALL_CONVERSION: boolean = tool === 'Pipette';
            this.interaction.emitSvgCanvasConversion(CALL_CONVERSION);
        });

        this.interaction.$previewColor.subscribe((color: string) => {
            this.pipettePreviewFill = color; // updates the preview box for the pipette tool
        });
    }
    ngAfterViewInit() {
        // default values

        this.updateForms(); // emit all after init
        this.updateLine();
        this.updateTools();
    }

    updateForms() {
        this.interaction.emitFormsAttributes({ plotType: this.plotType, lineThickness: this.lineThickness, numberOfCorners: this.numberCorners });
    }

    updateLine() {
        this.interaction.emitLineAttributes({ junction: this.junction, lineThickness: this.lineThickness, junctionDiameter: this.junctionRadius });
    }

    updateTools() {
        this.interaction.emitToolsAttributes({ lineThickness: this.lineThickness, texture: this.texture });
    }

    updateAerosol() {
        this.interaction.emitAerosolAttributes(new AerosolAttributes(this.emissionPerSecond, this.diameter));
    }

    resize() {
        window.dispatchEvent(new Event('resize'));
    }

    ngOnDestroy() {}
}
