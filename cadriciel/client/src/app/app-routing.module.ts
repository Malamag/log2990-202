import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DrawViewComponent } from './components/draw-view/draw-view.component';
import { EntryPointComponent } from './components/entry-point/entry-point.component';
import { RouterModule } from '@angular/router';

const appRoutes = [
  {path: "vueDessin", component: DrawViewComponent},
  {path: "entree", component: EntryPointComponent}
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(appRoutes)
  ]
})
export class AppRoutingModule { }
