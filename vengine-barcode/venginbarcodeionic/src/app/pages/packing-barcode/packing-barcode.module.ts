import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PackingBarcodePageRoutingModule } from './packing-barcode-routing.module';

import { PackingBarcodePage } from './packing-barcode.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PackingBarcodePageRoutingModule
  ],
  declarations: [PackingBarcodePage]
})
export class PackingBarcodePageModule {}
