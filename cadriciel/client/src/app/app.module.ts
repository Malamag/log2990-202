import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

import { AppComponent } from './components/app/app.component';
import { ColorPickerComponent } from './components/app/color-picker/color-picker.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TextFieldModule } from '@angular/cdk/text-field';
import { MatCardModule } from '@angular/material/card'; 
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSliderModule } from '@angular/material/slider';
import {ColorPickingService} from './services/services/color-picking.service';
import { ColorConvertingService } from './services/services/color-converting.service';
import { ColorSliderService } from './services/services/color-slider.service';

@NgModule({
    declarations: [AppComponent, ColorPickerComponent],
    imports: [
        BrowserModule, 
        HttpClientModule, 
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        TextFieldModule,
        MatCardModule,
        MatFormFieldModule,
        MatSliderModule,
        RouterModule.forRoot([
            { path: '', component: ColorPickerComponent} //pas besoin
        ])],
    providers: [ColorPickingService, ColorConvertingService, ColorSliderService],
    bootstrap: [AppComponent],
})
export class AppModule {}
