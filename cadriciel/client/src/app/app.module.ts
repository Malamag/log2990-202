import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './components/app/app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DrawViewComponent } from './components/draw-view/draw-view.component';
import { MatToolbarModule, MatIconModule, MatTooltipModule } from '@angular/material';

@NgModule({
    declarations: [AppComponent, DrawViewComponent],
    imports: [BrowserModule, HttpClientModule, BrowserAnimationsModule, MatToolbarModule, MatIconModule,MatTooltipModule],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
