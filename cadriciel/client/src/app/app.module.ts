import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './components/app/app.component';
import { EntryPointComponent } from './components/entry-point/entry-point.component';
import { NewDrawComponent } from './components/new-draw/new-draw.component';
import { DrawViewComponent } from './components/draw-view/draw-view.component';
import { GuideUtilisationComponent } from '../app/components/guide-utilisation/guide-utilisation.component';

import { CanvasBuilderService } from './services/services/drawing/canvas-builder.service';
import { ModalWindowService } from './services/modal-window.service';

import { AppRoutingModule } from './app-routing.module';

/*import material*/
import {
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSnackBarModule,
    MatSidenavModule,
    MatToolbarModule,
    MatSliderModule,
    MatTooltipModule
} from '@angular/material';
import { BoardComponent } from './components/draw-view/board/board.component';


@NgModule({
    declarations: [
        AppComponent,
        NewDrawComponent,
        EntryPointComponent,
        DrawViewComponent,
        GuideUtilisationComponent,
        BoardComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatDialogModule,
        MatIconModule,
        MatSnackBarModule,
        MatSidenavModule,
        MatToolbarModule,
        MatSliderModule,
        MatTooltipModule,
        AppRoutingModule
    ],
    providers: [CanvasBuilderService, ModalWindowService],
    bootstrap: [AppComponent],
    entryComponents: [NewDrawComponent, GuideUtilisationComponent]
    
})
export class AppModule {}
