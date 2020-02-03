import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './components/app/app.component';
import { SvgDrawComponent } from './components/svg-draw/svg-draw.component';

@NgModule({
    declarations: [AppComponent, SvgDrawComponent],
    imports: [BrowserModule, HttpClientModule],
    providers: [],
    bootstrap: [AppComponent],
    
})
export class AppModule {}
