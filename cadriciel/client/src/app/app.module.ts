import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
/*import material*/
import {
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatChipsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatToolbarModule,
    MatTooltipModule
} from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './components/app/app.component';
import { ColorPickerComponent } from './components/color-picker/color-picker.component';
import { MiniColorPickerComponent } from './components/color-picker/mini-color-picker/mini-color-picker.component';
import { DrawViewComponent } from './components/draw-view/draw-view.component';
import { OptionBarComponent } from './components/draw-view/option-bar/option-bar.component';
import { SvgDrawComponent } from './components/draw-view/svg-draw/svg-draw.component';
import { ToolAttributesComponent } from './components/draw-view/tool-box/tool-attributes/tool-attributes.component';
import { ToolBoxComponent } from './components/draw-view/tool-box/tool-box.component';
import { EntryPointComponent } from './components/entry-point/entry-point.component';
import { ExportFormComponent } from './components/export-form/export-form.component';
import { GalleryComponent } from './components/gallery/gallery.component';
import { NewDrawComponent } from './components/new-draw/new-draw.component';
import { PreviewBoxComponent } from './components/preview-box/preview-box.component';
import { SaveFormComponent } from './components/save-form/save-form.component';
import { UserManualContentComponent } from './components/user-manual/user-manual-content/user-manual-content.component';
import { UserManualComponent } from './components/user-manual/user-manual.component';
import { CanvasSwitchDirective } from './directives/canvas-switch.directive';
import { ColorConvertingService } from './services/colorPicker/color-converting.service';
import { ColorPickingService } from './services/colorPicker/color-picking.service';
import { CanvasBuilderService } from './services/drawing/canvas-builder.service';
import { ExportService } from './services/exportation/export.service';
import { ModalWindowService } from './services/window-handler/modal-window.service';

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
        GalleryComponent,
        ExportFormComponent,
        PreviewBoxComponent,
        SaveFormComponent,
        MiniColorPickerComponent,
        CanvasSwitchDirective,
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
        MatButtonToggleModule,
        MatSlideToggleModule,
        AppRoutingModule,
        MatCardModule,
        MatChipsModule,
        MatAutocompleteModule,
        MatProgressSpinnerModule,
    ],
    providers: [CanvasBuilderService, ModalWindowService, ColorConvertingService, ColorPickingService, ExportService],

    bootstrap: [AppComponent],
    entryComponents: [
        NewDrawComponent,
        UserManualComponent,
        GalleryComponent,
        OptionBarComponent,
        ColorPickerComponent,
        ExportFormComponent,
        PreviewBoxComponent,
        SaveFormComponent,
        MiniColorPickerComponent] // components added dynamically

})
export class AppModule {

}
