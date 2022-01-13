import { Component, OnInit } from '@angular/core';
import { InventoryService } from '../../services/inventory.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Barcode } from '../../models/barcode';

@Component({
  selector: 'app-barcode-list',
  templateUrl: './barcode-list.page.html',
  styleUrls: ['./barcode-list.page.scss'],
})
export class BarcodeListPage implements OnInit {
  barcodeData: Array<Barcode> = [];
  searchKeyWord: string;
  errorMessage: string;
  page = 0;
  perPage = 0;
  totalData = 0;
  totalPage = 0;
  companyName = "";

  constructor(private inventoryService: InventoryService) {
    this.companyName = localStorage.getItem("dhgUserCompany");
  }

  ngOnInit() {
    this.inventoryService.getBarcodeList(this.searchKeyWord, this.page)
      .subscribe(
        (res: any) => {
          this.perPage = res.pageable.pageSize;
          this.totalData = res.totalElements;
          this.totalPage = res.totalPages;

          this.barcodeData = res.content;
        });
  }

  doInfinite(infiniteScroll: any) {
    this.page = this.page + 1;
    setTimeout(() => {
      this.inventoryService.getBarcodeList(this.searchKeyWord, this.page)
        .subscribe(
          (res: any) => {
            this.perPage = res.pageable.pageSize;
            this.totalData = res.totalElements;
            this.totalPage = res.totalPages;

            for (let i = 0; i < res.content.length; i++) {
              this.barcodeData.push(res.content[i]);
            }
          },
          error => this.errorMessage = <any>error);

      console.log('Async operation has ended');
      infiniteScroll.target.complete();
    }, 1000);
  }
}
