import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PackingMainPage } from './packing-main.page';

const routes: Routes = [
  {
    path: '',
    component: PackingMainPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PackingMainPageRoutingModule {}
