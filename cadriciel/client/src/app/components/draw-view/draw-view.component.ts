import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { InteractionService } from 'src/app/services/service-interaction/interaction.service';

@Component({
    selector: 'app-draw-view',
    templateUrl: './draw-view.component.html',
    styleUrls: ['./draw-view.component.scss'],
})
export class DrawViewComponent implements AfterViewInit {
    // I doubt if we can delete these two
    @ViewChild('workingSpace', { static: false }) workingSpaceRef: ElementRef;

    constructor(public interaction: InteractionService) { }

    ngAfterViewInit(): void {
        this.interaction.emitRef(this.workingSpaceRef);
    }

    adaptWindowSize(): void {
        window.dispatchEvent(new Event('resize'));
    }

    /*Cette fonction peut à la limite être mise dans un service... */
}
