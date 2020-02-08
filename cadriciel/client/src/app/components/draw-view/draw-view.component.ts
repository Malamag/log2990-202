import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { InteractionService } from 'src/app/services/service-interaction/interaction.service';



@Component({
  selector: 'app-draw-view',
  templateUrl: './draw-view.component.html',
  styleUrls: ['./draw-view.component.scss']
})
export class DrawViewComponent implements OnInit {

  // I doubt if we can delete these two
  @ViewChild('WorkingSpace',{static:false}) workingSpaceRef: ElementRef 
 
  
  constructor(private interaction:InteractionService) {
  }

  ngOnInit() {
    this.interaction.emitRef(this.workingSpaceRef)
    
  }  

    /**Cette fonction peut à la limite être mise dans un service... */

  
}
