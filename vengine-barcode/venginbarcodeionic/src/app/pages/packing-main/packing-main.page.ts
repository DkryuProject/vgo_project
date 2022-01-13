import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-packing-main',
  templateUrl: './packing-main.page.html',
  styleUrls: ['./packing-main.page.scss'],
})
export class PackingMainPage implements OnInit {

  constructor(private router: Router) {
  }

  ngOnInit() {
  }

  movePage(type: any) {
    this.router.navigate(['/main/packing-barcode/' + type]);
  }
}
