import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './components/app/app.component';
import { EntryPointComponent } from './components/entry-point/entry-point.component';
import { NewDrawComponent } from './components/new-draw/new-draw.component';
import { DrawViewComponent } from './components/draw-view/draw-view.component';
import { ColorPickerComponent} from './components/color-picker/color-picker.component'
import { UserManualComponent } from './components/user-manual/user-manual.component';
import { UserManualContentComponent } from './components/user-manual/user-manual-content/user-manual-content.component';
import { CanvasBuilderService } from './services/drawing/canvas-builder.service';
import { ModalWindowService } from './services/window-handler/modal-window.service';
import { ColorPickingService } from './services/colorPicker/color-picking.service';
import { ColorConvertingService } from './services/colorPicker/color-converting.service';

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
    MatTooltipModule,
    MatRadioModule
} from '@angular/material';
import { SvgDrawComponent } from './components/draw-view/svg-draw/svg-draw.component';
import { OptionBarComponent } from './components/draw-view/option-bar/option-bar.component';
import { ColorFormComponent } from './components/color-picker/color-form/color-form.component';
import { ToolBoxComponent } from './components/draw-view/tool-box/tool-box.component';
import { ToolAttributesComponent } from './components/draw-view/tool-box/tool-attributes/tool-attributes.component';



@NgModule({
    declarations: [
        AppComponent,
        NewDrawComponent,
        EntryPointComponent,
        DrawViewComponent,
        SvgDrawComponent,
        UserManualComponent,
        UserManualContentComponent,
        OptionBarComponent,
        ColorPickerComponent,
        ColorFormComponent,
        ToolBoxComponent,
        ToolAttributesComponent
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
        MatRadioModule,
        AppRoutingModule
    ],
    providers: [
        CanvasBuilderService, 
        ModalWindowService,
        ColorConvertingService,
        ColorPickingService
    ],

    bootstrap: [AppComponent],
    entryComponents: [NewDrawComponent, UserManualComponent, OptionBarComponent, ColorPickerComponent] // components added dynamically
    
})
export class AppModule {}
