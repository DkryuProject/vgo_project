import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BarcodeListPageRoutingModule } from './barcode-list-routing.module';

import { BarcodeListPage } from './barcode-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BarcodeListPageRoutingModule
  ],
  declarations: [BarcodeListPage]
})
export class BarcodeListPageModule {}
