import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PackingInfoPage } from './packing-info.page';

const routes: Routes = [
  {
    path: '',
    component: PackingInfoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PackingInfoPageRoutingModule {}
