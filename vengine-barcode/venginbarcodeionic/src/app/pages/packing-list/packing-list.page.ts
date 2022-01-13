import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InventoryService } from '../../services/inventory.service';

@Component({
  selector: 'app-packing-list',
  templateUrl: './packing-list.page.html',
  styleUrls: ['./packing-list.page.scss'],
})
export class PackingListPage implements OnInit {
  searchKeyWord: string = "";
  errorMessage: string = "";
  page = 0;
  perPage = 0;
  totalData = 0;
  totalPage = 0;
  packingList: Array<packing> = [];

  constructor(private router: Router, private inventoryService: InventoryService) {
  }

  ngOnInit() {
    this.inventoryService.getPackingList(this.searchKeyWord, this.page)
      .subscribe(
        (res: any) => {
          this.packingList = res;
        },
        error => this.errorMessage = <any>error
      );
  }

  movePage(docNo: any) {
    this.router.navigate(['/main/packing-info/' + docNo]);
  }
}

interface packing {
    packingNumber: string
}
