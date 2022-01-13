import { Component, OnInit } from '@angular/core';
import { InventoryService } from '../../services/inventory.service';
import { GoodsIssue } from '../../models/goods-issue';
import { Router, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-send-out',
  templateUrl: './send-out.page.html',
  styleUrls: ['./send-out.page.scss'],
})
export class SendOutPage implements OnInit {
  sendOutData: GoodsIssue[];
  searchKeyWord: string;
  errorMessage: string;
  page = 0;
  perPage = 0;
  totalData = 0;
  totalPage = 0;
  companyName = "";

  constructor(private inventoryService: InventoryService, public router: Router) {
    this.companyName = localStorage.getItem("dhgUserCompany");
  }

  ngOnInit() {
    this.inventoryService.getSendOutList(this.searchKeyWord, this.page)
      .subscribe(
        (res: any) => {
          this.perPage = res.pageable.pageSize;
          this.totalData = res.totalElements;
          this.totalPage = res.totalPages;
          this.sendOutData = res.content;
        },
        error => this.errorMessage = <any>error
      );
  }

  doInfinite(infiniteScroll: any) {
    this.page = this.page + 1;
    setTimeout(() => {
      this.inventoryService.getSendOutList(this.searchKeyWord, this.page)
        .subscribe(
          (res: any) => {
            this.perPage = res.pageable.pageSize;
            this.totalData = res.totalElements;
            this.totalPage = res.totalPages;

            for (let i = 0; i < res.content.length; i++) {
              this.sendOutData.push(res.content[i]);
            }
          },
          error => this.errorMessage = <any>error);

      console.log('Async operation has ended');
      infiniteScroll.target.complete();
    }, 1000);
  }

  movePage(goodsIssue: GoodsIssue) {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        scanType: "BARCODE_MOVE",
        data: goodsIssue.goodsIssueID
      }
    }
    this.router.navigate(['/main/scan'], navigationExtras);
  }
}
