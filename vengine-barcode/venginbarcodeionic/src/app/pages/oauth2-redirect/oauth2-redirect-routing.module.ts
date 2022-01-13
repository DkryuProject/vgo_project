import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Oauth2RedirectPage } from './oauth2-redirect.page';

const routes: Routes = [
  {
    path: '',
    component: Oauth2RedirectPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Oauth2RedirectPageRoutingModule {}
