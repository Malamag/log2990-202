import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
//import { map } from 'rxjs/operators';
//import { Message } from '../../../../../common/communication/message';
//import { IndexService } from '../../services/index/index.service';

/**/
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { GuideUtilisationComponent } from '../../guide-utilisation/guide-utilisation.component';
/**/
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})

export class AppComponent {
    readonly title: string = 'LOG2990';
    message = new BehaviorSubject<string>('');

    constructor(/*private basicService: IndexService,*/ public dialog: MatDialog) {
        /*this.basicService
            .basicGet()
            .pipe(map((message: Message) => `${message.title} ${message.body}`))
            .subscribe(this.message);*/

            
    }    
      /**/
      openModalGuide() {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.id = "GuideConfig";
        dialogConfig.height = '100%';
        dialogConfig.width = '100%';
        // https://material.angular.io/components/dialog/overview
        this.dialog.open(GuideUtilisationComponent, dialogConfig);
      }
    /*this.matDialog.open(GuideUtilisationComponent, {
            height: '100%', // height = "500px"
            width: '100%'
        });
        */
}
