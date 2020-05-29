import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LineComponent } from './line/line.component';
import { PieChartComponent } from './pie-chart/pie-chart.component';
import { HeaderComponent } from './header/header.component';
import { AppComponent } from './app.component';




const routes: Routes = [
  { path: 'line', component: LineComponent },
  { path: 'pie', component: PieChartComponent },



];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
