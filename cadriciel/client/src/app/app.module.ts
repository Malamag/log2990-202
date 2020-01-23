import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './components/app/app.component';
import { GuideUtilisationComponent } from './guide-utilisation/guide-utilisation.component';

//import { AppRoutingModule } from '../app-routing.module'; ?not important?

//Adds browser animations for modal window opening
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
//Adds a better font for buttons
import { MatButtonModule } from '@angular/material/button';
// Adds dialogs -> for modal window
import { MatDialogModule } from '@angular/material/dialog';
// import utilisation guide
import { GuideUtilisationComponent as GuideComponent } from './guide-utilisation/guide-utilisation.component';
import { TopBarGuideComponent } from './guide-utilisation/top-bar-guide/top-bar-guide.component';
import { LeftBarGuideComponent } from './guide-utilisation/left-bar-guide/left-bar-guide.component';


@NgModule({
    declarations: [AppComponent, GuideUtilisationComponent, TopBarGuideComponent, LeftBarGuideComponent],
    imports: [BrowserModule, HttpClientModule,
        //AppRoutingModule, ?not important?
        BrowserAnimationsModule,
        MatButtonModule,
        MatDialogModule],
    providers: [],
    bootstrap: [AppComponent],
    entryComponents: [GuideComponent] 
})
export class AppModule {}
