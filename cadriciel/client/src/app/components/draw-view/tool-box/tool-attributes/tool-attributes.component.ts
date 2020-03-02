import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormsAttribute } from 'src/app/services/attributes/attribute-form';
import { LineAttributes } from 'src/app/services/attributes/line-attributes';
import { ToolsAttributes } from 'src/app/services/attributes/tools-attribute';
import { InteractionService } from 'src/app/services/service-interaction/interaction.service';
import { AerosolAttributes } from 'src/app/services/attributes/aerosol-attribute';

@Component({
  selector: 'app-tool-attributes',
  templateUrl: './tool-attributes.component.html',
  styleUrls: ['./tool-attributes.component.scss']
})
export class ToolAttributesComponent implements OnInit, OnDestroy, AfterViewInit {

  lineThickness: number;
  texture: number;
  numberCorners: number;
  emissionPerSecond:number;
  diameter:number;
  plotType: number;
  junction: boolean;
  junctionRadius: number;
  selectedTool: String;
  tools: string[] = []
  constructor(public interaction: InteractionService) {
    this.tools = ['Rectangle', 'Ligne', 'Pinceau', 'Crayon', 'Sélection de couleur', 'Ellipse', 'Polygone', 'Aérosol'];
    this.lineThickness = 5; // 5px thick line
    this.texture = 0; // blur texture

    this.numberCorners = 3; // for polygon

    this.emissionPerSecond = 200;
    this.diameter = 50;

    this.plotType = 2; // type 2 --> filled with border
    this.junction = true; // with junction dots of 6 px size
    this.junctionRadius = 6;
    this.selectedTool = 'Pencil'
  }

  ngOnInit() {
    this.interaction.$selectedTool.subscribe( (tool) => {
      let toolExist = false
      this.tools.forEach((el) => {
        if (el === tool) {
          toolExist = true
        }
      })
      if (toolExist) {
        this.selectedTool = tool;
      }
    });

  }
  ngAfterViewInit() {
    // default values

    this.updateForms(); // emit all after init
    this.updateLine();
    this.updateTools();
    this.updateAerosol();
  }

  updateForms() {
    // const attr : FormsAttribute = new FormsAttribute
    this.interaction.emitFormsAttributes(new FormsAttribute(this.plotType, this.lineThickness, this.numberCorners));

  }

  updateLine() {
    this.interaction.emitLineAttributes(new LineAttributes(this.junction, this.lineThickness, this.junctionRadius));

  }

  updateTools() {
    this.interaction.emitToolsAttributes(new ToolsAttributes(this.lineThickness, this.texture));

  }

  updateAerosol() {
    this.interaction.emitAerosolAttributes(new AerosolAttributes(this.emissionPerSecond, this.diameter));

  }

  resize() {
    window.dispatchEvent(new Event('resize'));
  }

  ngOnDestroy() {

  }

}
