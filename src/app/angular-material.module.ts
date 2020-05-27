import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSelectModule } from '@angular/material/select';



@NgModule({
  exports: [
    MatButtonModule,
    MatToolbarModule,
    MatSelectModule,
  ]
})
export class AngularMaterialModule {

}
