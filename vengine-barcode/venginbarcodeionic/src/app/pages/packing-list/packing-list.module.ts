import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PackingListPageRoutingModule } from './packing-list-routing.module';

import { PackingListPage } from './packing-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PackingListPageRoutingModule
  ],
  declarations: [PackingListPage]
})
export class PackingListPageModule {}
