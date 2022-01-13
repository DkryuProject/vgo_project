import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PackingMainPageRoutingModule } from './packing-main-routing.module';

import { PackingMainPage } from './packing-main.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PackingMainPageRoutingModule
  ],
  declarations: [PackingMainPage]
})
export class PackingMainPageModule {}
