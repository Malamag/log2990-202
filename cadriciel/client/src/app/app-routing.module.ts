import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DrawViewComponent } from './components/draw-view/draw-view.component';
import { EntryPointComponent } from './components/entry-point/entry-point.component';
import { RouterModule, Routes } from '@angular/router';


const appRoutes: Routes = [
  {path: '', component: EntryPointComponent},
  {path: "vue", component: DrawViewComponent}
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
