import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DrawViewComponent } from './components/draw-view/draw-view.component';
import { EntryPointComponent } from './components/entry-point/entry-point.component';

const appRoutes = [
  { path: "vueDessin", component: DrawViewComponent },
  { path: "ptEntree", component: EntryPointComponent }
];

@NgModule({
  declarations: [DrawViewComponent, EntryPointComponent],
  imports: [
    CommonModule,
    RouterModule.forRoot(appRoutes)
  ]
})
export class AppRoutingModule { }
