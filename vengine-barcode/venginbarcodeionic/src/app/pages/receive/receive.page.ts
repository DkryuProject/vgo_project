import { Component, OnInit } from '@angular/core';
import { InventoryService } from '../../services/inventory.service';
import { Receive } from '../../models/receive';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-receive',
  templateUrl: './receive.page.html',
  styleUrls: ['./receive.page.scss'],
})
export class ReceivePage implements OnInit {
  receive: Receive[];
  searchKeyWord: string = "";
  errorMessage: string = "";
  page = 0;
  perPage = 0;
  totalData = 0;
  totalPage = 0;
  companyName = "";
  viewType: any;

  constructor(private activatedRoute: ActivatedRoute, public router: Router, private inventoryService: InventoryService) {
    this.companyName = localStorage.getItem("dhgUserCompany");
  }

  ngOnInit() {
    this.viewType = this.activatedRoute.snapshot.paramMap.get('viewType');
    console.log("viewType", this.viewType);
    this.inventoryService.getReceiveList(this.searchKeyWord, this.page)
      .subscribe(
        (res: any) => {
          this.perPage = res.page.pageable.pageSize;
          this.totalData = res.page.totalElements;
          this.totalPage = res.page.totalPages;
          this.receive = res.page.content;

          for(let i=0; i< this.receive.length; i++){
            this.inventoryService.getGoodsReceiptData(this.receive[i].deliveryNumber, 'deliveryNo').subscribe((data: any) => {
              console.log("data: ", data);
              this.receive[i].goodsReceipt = data;
            });
          }
        },
        error => this.errorMessage = <any>error
      );
  }

  doInfinite(infiniteScroll: any) {
    this.page = this.page + 1;
    setTimeout(() => {
      this.inventoryService.getReceiveList(this.searchKeyWord, this.page)
        .subscribe(
          (res: any) => {
            this.perPage = res.pageable.pageSize;
            this.totalData = res.totalElements;
            this.totalPage = res.totalPages;

            for (let i = 0; i < res.content.length; i++) {
              this.receive.push(res.content[i]);
            }
          },
          error => this.errorMessage = <any>error);

      console.log('Async operation has ended');
      infiniteScroll.target.complete();
    }, 1000);
  }

  movePage(receive: Receive) {
    if (this.viewType == "scan") {
      let navigationExtras: NavigationExtras = {
        queryParams: {
          scanType: "BARCODE_REGISTER",
          data: receive.deliveryNumber
        }
      }
      this.router.navigate(['/main/scan'], navigationExtras);
    }else{
      this.router.navigate(['/main/barcodeList']);
    }
  }
}
