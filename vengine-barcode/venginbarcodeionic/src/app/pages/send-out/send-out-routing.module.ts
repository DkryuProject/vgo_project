import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SendOutPage } from './send-out.page';

const routes: Routes = [
  {
    path: '',
    component: SendOutPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SendOutPageRoutingModule {}
