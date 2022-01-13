import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PackingInfoPageRoutingModule } from './packing-info-routing.module';

import { PackingInfoPage } from './packing-info.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PackingInfoPageRoutingModule
  ],
  declarations: [PackingInfoPage]
})
export class PackingInfoPageModule {}
