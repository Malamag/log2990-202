import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './components/app/app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RectangleToolComponent } from './components/rectangle-tool/rectangle-tool.component';


@NgModule({
    declarations: [AppComponent, RectangleToolComponent],
    imports: [BrowserModule, HttpClientModule, BrowserAnimationsModule],
    providers: [],
    bootstrap: [AppComponent],
    
})
export class AppModule {}
