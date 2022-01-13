import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainPage } from './main.page';

const routes: Routes = [
  {
    path: '',
    component: MainPage,
    children: [
      {
        path: 'receive/:viewType',
        loadChildren: () => import('../../pages/receive/receive.module').then(m => m.ReceivePageModule)
      },
      {
        path: 'sendOut',
        loadChildren: () => import('../../pages/send-out/send-out.module').then(m => m.SendOutPageModule)
      },
      {
        path: 'barcodeList',
        loadChildren: () => import('../../pages/barcode-list/barcode-list.module').then(m => m.BarcodeListPageModule)
      },
      {
        path: 'scan',
        loadChildren: () => import('../../pages/scan/scan.module').then(m => m.ScanPageModule)
      },
      {
        path: 'packing-info/:docNo',
        loadChildren: () => import('../../pages/packing-info/packing-info.module').then( m => m.PackingInfoPageModule)
      },
      {
        path: 'packing-barcode/:type',
        loadChildren: () => import('../../pages/packing-barcode/packing-barcode.module').then( m => m.PackingBarcodePageModule)
      },
      {
        path: 'packing-list',
        loadChildren: () => import('../../pages/packing-list/packing-list.module').then( m => m.PackingListPageModule)
      },
      {
        path: 'packing-main',
        loadChildren: () => import('../../pages/packing-main/packing-main.module').then( m => m.PackingMainPageModule)
      }
    ]
  },
  {
    path: '',
    redirectTo: '/main/scan',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainPageRoutingModule { }
