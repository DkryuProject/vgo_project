import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SendOutPageRoutingModule } from './send-out-routing.module';

import { SendOutPage } from './send-out.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SendOutPageRoutingModule
  ],
  declarations: [SendOutPage]
})
export class SendOutPageModule {}
