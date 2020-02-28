import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './components/app/app.component';
import { ColorPickerComponent } from './components/color-picker/color-picker.component';
import { DrawViewComponent } from './components/draw-view/draw-view.component';
import { EntryPointComponent } from './components/entry-point/entry-point.component';
import { NewDrawComponent } from './components/new-draw/new-draw.component';
import { UserManualContentComponent } from './components/user-manual/user-manual-content/user-manual-content.component';
import { UserManualComponent } from './components/user-manual/user-manual.component';
import { ColorConvertingService } from './services/colorPicker/color-converting.service';
import { ColorPickingService } from './services/colorPicker/color-picking.service';
import { CanvasBuilderService } from './services/drawing/canvas-builder.service';
import { ModalWindowService } from './services/window-handler/modal-window.service';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';
import { AppRoutingModule } from './app-routing.module';

/*import material*/
import {
    MatButtonModule,
    MatButtonToggleModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatRadioModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSnackBarModule,
    MatToolbarModule,
    MatTooltipModule,
} from '@angular/material';
import { OptionBarComponent } from './components/draw-view/option-bar/option-bar.component';
import { SvgDrawComponent } from './components/draw-view/svg-draw/svg-draw.component';
import { ToolAttributesComponent } from './components/draw-view/tool-box/tool-attributes/tool-attributes.component';
import { ToolBoxComponent } from './components/draw-view/tool-box/tool-box.component';
import { ExportFormComponent } from './components/export-form/export-form.component';
import { PreviewBoxComponent } from './components/preview-box/preview-box.component';
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
        ExportFormComponent,
        PreviewBoxComponent,
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
        AppRoutingModule,
    ],
    providers: [CanvasBuilderService, ModalWindowService, ColorConvertingService, ColorPickingService, ExportService],

    bootstrap: [AppComponent],
    entryComponents: [NewDrawComponent, UserManualComponent, OptionBarComponent, ColorPickerComponent, ExportFormComponent, PreviewBoxComponent], // components added dynamically
})
export class AppModule {
    constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
        iconRegistry.addSvgIcon('redo', sanitizer.bypassSecurityTrustResourceUrl('../../../assets/images/redo.svg'));
        iconRegistry.addSvgIcon('undo', sanitizer.bypassSecurityTrustResourceUrl('../../../assets/images/undo.svg'));

        iconRegistry.addSvgIcon('brush', sanitizer.bypassSecurityTrustResourceUrl('../../../assets/images/brush.svg'));
        iconRegistry.addSvgIcon('calligraphie', sanitizer.bypassSecurityTrustResourceUrl('../../../assets/images/calligraphie.svg'));

        iconRegistry.addSvgIcon('color', sanitizer.bypassSecurityTrustResourceUrl('../../../assets/images/color.svg'));
        iconRegistry.addSvgIcon('cursor', sanitizer.bypassSecurityTrustResourceUrl('../../../assets/images/cursor.svg'));

        iconRegistry.addSvgIcon('ellipse', sanitizer.bypassSecurityTrustResourceUrl('../../../assets/images/ellipse.svg'));
        iconRegistry.addSvgIcon('eraser', sanitizer.bypassSecurityTrustResourceUrl('../../../assets/images/eraser.svg'));

        iconRegistry.addSvgIcon('hexagon', sanitizer.bypassSecurityTrustResourceUrl('../../../assets/images/hexagon.svg'));
        iconRegistry.addSvgIcon('line', sanitizer.bypassSecurityTrustResourceUrl('../../../assets/images/line.svg'));
        iconRegistry.addSvgIcon('pencil', sanitizer.bypassSecurityTrustResourceUrl('../../../assets/images/pencil.svg'));
        iconRegistry.addSvgIcon('pipette', sanitizer.bypassSecurityTrustResourceUrl('../../../assets/images/pipette.svg'));
        iconRegistry.addSvgIcon('rectangle', sanitizer.bypassSecurityTrustResourceUrl('../../../assets/images/rectangle.svg'));
        iconRegistry.addSvgIcon('spray', sanitizer.bypassSecurityTrustResourceUrl('../../../assets/images/spray.svg'));
        iconRegistry.addSvgIcon('stamp', sanitizer.bypassSecurityTrustResourceUrl('../../../assets/images/stamp.svg'));
        iconRegistry.addSvgIcon('text', sanitizer.bypassSecurityTrustResourceUrl('../../../assets/images/text.svg'));
        iconRegistry.addSvgIcon('redo', sanitizer.bypassSecurityTrustResourceUrl('../../../assets/images/redo.svg'));
        iconRegistry.addSvgIcon('undo', sanitizer.bypassSecurityTrustResourceUrl('../../../assets/images/undo.svg'));
        iconRegistry.addSvgIcon('paint-bucket', sanitizer.bypassSecurityTrustResourceUrl('../../../assets/images/paint-bucket.svg'));
    }
}
