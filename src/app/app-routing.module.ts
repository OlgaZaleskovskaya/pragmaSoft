import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HeaderComponent } from './header/header.component';



const routes: Routes = [
 /*  { path: 'chart/line', component: HeaderComponent },
  { path: 'chart/pie', component: HeaderComponent },
  { path: '', redirectTo: '/chart/pie', pathMatch: 'full' } */
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
