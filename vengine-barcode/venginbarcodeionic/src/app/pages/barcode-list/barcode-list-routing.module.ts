import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BarcodeListPage } from './barcode-list.page';

const routes: Routes = [
  {
    path: '',
    component: BarcodeListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BarcodeListPageRoutingModule {}
