/*Fichier utilisé pour l'importation de modules d'Angular Material, librairie de styles 
permise par les chargés de lab. Donne un "look and feel" typique des applications Google
avec une interface minimaliste. 
Source: Équipe Google. (2019). Angular Material. En ligne: https://material.angular.io/*/

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


@NgModule({
  declarations: [
    /*Components*/
  ],
  imports: [
    /*Angular Material imports*/
    CommonModule,
    BrowserAnimationsModule
  ]
})
export class MaterialModule { }
