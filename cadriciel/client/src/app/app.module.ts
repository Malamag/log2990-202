import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './components/app/app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EntryPointComponent } from './components/entry-point/entry-point.component';
import { MatButtonModule } from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatSnackBarModule} from '@angular/material/snack-bar';


@NgModule({
    declarations: [AppComponent, EntryPointComponent],
    imports: [BrowserModule, HttpClientModule, BrowserAnimationsModule, MatButtonModule, MatIconModule,MatSnackBarModule,],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
