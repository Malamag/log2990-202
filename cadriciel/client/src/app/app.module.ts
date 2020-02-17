import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './components/app/app.component';
import { ColorPickerComponent} from './components/color-picker/color-picker.component'
import { DrawViewComponent } from './components/draw-view/draw-view.component';
import { EntryPointComponent } from './components/entry-point/entry-point.component';
import { NewDrawComponent } from './components/new-draw/new-draw.component';
import { UserManualContentComponent } from './components/user-manual/user-manual-content/user-manual-content.component';
import { UserManualComponent } from './components/user-manual/user-manual.component';
import { ColorConvertingService } from './services/colorPicker/color-converting.service';
import { ColorPickingService } from './services/colorPicker/color-picking.service';
import { CanvasBuilderService } from './services/drawing/canvas-builder.service';
import { ModalWindowService } from './services/window-handler/modal-window.service';

import { AppRoutingModule } from './app-routing.module';

/*import material*/
import {
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatRadioModule,
    MatSidenavModule,
    MatSliderModule,
    MatSnackBarModule,
    MatToolbarModule,
    MatTooltipModule,
    MatSelectModule
} from '@angular/material';
import { OptionBarComponent } from './components/draw-view/option-bar/option-bar.component';
import { SvgDrawComponent } from './components/draw-view/svg-draw/svg-draw.component';
import { ToolAttributesComponent } from './components/draw-view/tool-box/tool-attributes/tool-attributes.component';
import { ToolBoxComponent } from './components/draw-view/tool-box/tool-box.component';
import { ExportFormComponent } from './components/export-form/export-form.component';
import { ExportService } from './services/exportation/export.service';

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
        ToolBoxComponent,
        ToolAttributesComponent,
        ExportFormComponent
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
        MatSelectModule,
        AppRoutingModule
    ],
    providers: [
        CanvasBuilderService,
        ModalWindowService,
        ColorConvertingService,
        ColorPickingService,
        ExportService
    ],

    bootstrap: [AppComponent],
    entryComponents: [NewDrawComponent, UserManualComponent, OptionBarComponent, ColorPickerComponent, ExportFormComponent] // components added dynamically

})
export class AppModule {}
