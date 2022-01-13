import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PackingBarcodePage } from './packing-barcode.page';

const routes: Routes = [
  {
    path: '',
    component: PackingBarcodePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PackingBarcodePageRoutingModule {}
