import { Component, OnInit, OnDestroy } from '@angular/core';
import { InteractionService } from 'src/app/services/service-interaction/interaction.service';

@Component({
  selector: 'app-tool-attributes',
  templateUrl: './tool-attributes.component.html',
  styleUrls: ['./tool-attributes.component.scss']
})
export class ToolAttributesComponent implements OnInit, OnDestroy {

  constructor(private interaction: InteractionService) { }
  selectedTool: String;

  ngOnInit() {
    this.interaction.$selectedTool.subscribe( tool =>{
      this.selectedTool = tool;
    });
  }

  ngOnDestroy() {
    
  }

}
