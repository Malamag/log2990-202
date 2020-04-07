import { AfterViewInit, Component, OnInit } from '@angular/core';
import { InteractionService } from 'src/app/services/service-interaction/interaction.service';

@Component({
    selector: 'app-tool-attributes',
    templateUrl: './tool-attributes.component.html',
    styleUrls: ['./tool-attributes.component.scss'],
})
export class ToolAttributesComponent implements OnInit, AfterViewInit {
    lineThickness: number;
    texture: number;
    numberCorners: number; // not done
    plotType: number;
    emissionPerSecond: number;
    diameter: number;
    junction: boolean;
    junctionRadius: number;

    fontSize: number;
    fontFamily: string;
    alignment: string;
    isBold: boolean;
    isItalic: boolean;

    selectedTool: string;
    tools: string[] = [];

    pipettePreviewFill: string;
    constructor(public interaction: InteractionService) {
        this.tools = [
            'Rectangle',
            'Ligne',
            'Pinceau',
            'Crayon',
            'Ellipse',
            'Polygone',
            'Pipette',
            'Aérosol',
            'ApplicateurCouleur',
            'Efface',
            'Texte'
        ];
        const DEF_THICK = 5;
        const DEF_TEXTURE = 0;
        const DEF_POLYGONE_CORNERS = 3;
        const DEF_EMISSIONS = 50;
        const DEF_DIAMETER = 50;
        const DEF_PLOTTYPE = 2;
        const DEF_JUNCTION_RAD = 6;
        const DEF_FONT_FAMILY = 'arial';
        const DEF_ALIGNEMENT = 'L';
        this.lineThickness = DEF_THICK; // 5px thick line
        this.texture = DEF_TEXTURE; // blur texture

        this.numberCorners = DEF_POLYGONE_CORNERS; // for polygon

        this.emissionPerSecond = DEF_EMISSIONS;
        this.diameter = DEF_DIAMETER;

        this.fontSize = DEF_THICK;
        this.fontFamily = DEF_FONT_FAMILY;
        this.alignment = DEF_ALIGNEMENT;
        this.isBold = false;
        this.isItalic = false;

        this.plotType = DEF_PLOTTYPE; // type 2 --> filled with border
        this.junction = true; // with junction dots of 6 px size
        this.junctionRadius = DEF_JUNCTION_RAD;
        this.selectedTool = 'Crayon';
    }

    ngOnInit(): void {
        this.interaction.$selectedTool.subscribe((tool: string) => {
            let toolExist = false;
            this.tools.forEach((el: string) => {
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
    ngAfterViewInit(): void {
        // default values

        this.updateForms(); // emit all after init
        this.updateLine();
        this.updateTools();
    }

    updateForms(): void {
        this.interaction.emitFormsAttributes({
            plotType: this.plotType,
            lineThickness: this.lineThickness,
            numberOfCorners: this.numberCorners,
        });
    }

    updateLine(): void {
        this.interaction.emitLineAttributes({
            junction: this.junction,
            lineThickness: this.lineThickness,
            junctionDiameter: this.junctionRadius,
        });
    }

    updateTools(): void {
        this.interaction.emitToolsAttributes({
            lineThickness: this.lineThickness,
            texture: this.texture });
    }

    updateAerosol(): void {
        this.interaction.emitAerosolAttributes({
            emissionPerSecond: this.emissionPerSecond,
            diameter: this.diameter });
    }

    updateText(): void {
        this.interaction.emitTextAttributes({
            fontSize: this.fontSize,
            fontFamily: this.fontFamily,
            alignment: this.alignment,
            isBold: this.isBold,
            isItalic: this.isItalic,
        });
    }

    mutate(type: boolean): void {
        switch (type) {
            case false: {
              this.isBold = !this.isBold;
              return;
            }
            case true: {
                this.isItalic = !this.isItalic;
                return;
            }
        }
    }

    alignement(type: string): void {
        this.alignment = type;
    }

    resize(): void {
        window.dispatchEvent(new Event('resize'));
    }
}
