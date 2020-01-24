import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './components/app/app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NewDrawComponent } from './components/new-draw/new-draw.component';
import { EntryPointComponent } from './components/entry-point/entry-point.component';

import { CanvasBuilderService } from './services/services/drawing/canvas-builder.service';

/*import material*/
import { MatFormFieldModule, MatInputModule, MatDialogModule } from '@angular/material';

 import { MatButtonModule } from '@angular/material/button';
 import { MatIconModule } from '@angular/material';
 import { MatSnackBarModule } from '@angular/material'

@NgModule({
    declarations: [
        AppComponent, 
        NewDrawComponent,
        EntryPointComponent
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
        MatSnackBarModule
    ],
    providers: [CanvasBuilderService],
    bootstrap: [AppComponent],
})
export class AppModule {}
