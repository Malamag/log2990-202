import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './components/app/app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NewDrawComponent } from './components/app/new-draw/new-draw.component';

/*import material*/
import {
    MatFormFieldModule,
    MatInputModule
    
 } from '@angular/material';
 import { MatButtonModule } from '@angular/material/button';

@NgModule({
    declarations: [
        AppComponent, 
        NewDrawComponent
    ],
    imports: [
        BrowserModule, 
        HttpClientModule, 
        BrowserAnimationsModule,
        ReactiveFormsModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
