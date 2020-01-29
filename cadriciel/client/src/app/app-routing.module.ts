import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DrawViewComponent } from './components/draw-view/draw-view.component';
import { EntryPointComponent } from './components/entry-point/entry-point.component';
import { RouterModule, Routes } from '@angular/router';
import { GuideUtilisationComponent } from './components/guide-utilisation/guide-utilisation.component';
import { GuideContentComponent } from './guide-content/guide-content.component';


const appRoutes: Routes = [
  {path: '', component: EntryPointComponent},
  {path: "vue", component: DrawViewComponent},
  {path: "guide", component:GuideUtilisationComponent, outlet:"entryPoint"},
  {path: "test", component:GuideContentComponent, outlet:"guideUtilisation"}
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(appRoutes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
