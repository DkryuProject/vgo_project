import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Oauth2RedirectPageRoutingModule } from './oauth2-redirect-routing.module';

import { Oauth2RedirectPage } from './oauth2-redirect.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Oauth2RedirectPageRoutingModule
  ],
  declarations: [Oauth2RedirectPage]
})
export class Oauth2RedirectPageModule {}
