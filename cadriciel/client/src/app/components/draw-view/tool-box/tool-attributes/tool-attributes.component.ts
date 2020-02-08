import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { InteractionService } from 'src/app/services/service-interaction/interaction.service';
import { FormsAttribute } from 'src/app/services/attributes/attribute-form';
import { LineAttributes } from 'src/app/services/attributes/line-attributes';
import { ToolsAttributes } from 'src/app/services/attributes/tools-attribute';

@Component({
  selector: 'app-tool-attributes',
  templateUrl: './tool-attributes.component.html',
  styleUrls: ['./tool-attributes.component.scss']
})
export class ToolAttributesComponent implements OnInit, OnDestroy, AfterViewInit {

  lineThickness: number;
  texture: number;
  numberCorners: number; // not done
  plotType: number;
  junction: boolean;
  junctionRadius: number;
  selectedTool: String;
  tools:string[]=[]
  constructor(private interaction: InteractionService) {
    this.tools= ['Rectangle', 'Ligne', 'Pinceau', 'Crayon','Choisir couleur']
  }
  
  ngOnInit(){}
  ngAfterViewInit() {
    // default values
    this.lineThickness = 5; //5px thick line
    this.texture = 0; // blur texture

    this.numberCorners = 3; // for polygon -- wait 'til sprint 2! 

    this.plotType = 2; // type 2 --> filled with border
    this.junction = true; // with junction dots of 6 px size
    this.junctionRadius = 6;

    this.interaction.$selectedTool.subscribe( tool =>{
      let toolExist:boolean = false
      this.tools.forEach(el=>{
        if(el===tool)
          toolExist= true
      })
      if(toolExist)
        this.selectedTool = tool;
    });

    this.updateForms(); // emit all after init
    this.updateLine();
    this.updateTools();
  }

  updateForms(){
    //const attr : FormsAttribute = new FormsAttribute 
    this.interaction.emitFormsAttributes(new FormsAttribute(this.plotType, this.lineThickness, this.numberCorners));
    
  }

  updateLine(){
    this.interaction.emitLineAttributes(new LineAttributes(this.junction, this.lineThickness, this.junctionRadius));

  }

  updateTools(){
    this.interaction.emitToolsAttributes(new ToolsAttributes(this.lineThickness, this.texture));
    
  }

  resize() {
    window.dispatchEvent(new Event('resize'));
  }
  
  ngOnDestroy() {
    
  }

}
