import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

import { AppComponent } from './components/app/app.component';
import { ColorPickerComponent } from './components/app/color-picker/color-picker.component';


@NgModule({
    declarations: [AppComponent, ColorPickerComponent],
    imports: [
        BrowserModule, 
        HttpClientModule, 
        BrowserAnimationsModule,
        RouterModule.forRoot([
            { path: '', component: ColorPickerComponent}
        ])],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
