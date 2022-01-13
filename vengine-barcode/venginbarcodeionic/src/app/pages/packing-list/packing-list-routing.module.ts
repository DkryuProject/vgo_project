import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PackingListPage } from './packing-list.page';

const routes: Routes = [
  {
    path: '',
    component: PackingListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PackingListPageRoutingModule {}
