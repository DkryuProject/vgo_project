import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Barcode } from '../models/barcode';
import { GoodsReceipt } from '../models/goods-receipt';
import { GoodsIssue } from '../models/goods-issue';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable({
  providedIn: 'root'
})

export class InventoryService {
  httpHeader = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  private baseUrl: string = "http://192.168.101.164:9000/api/v1/inventory";

  constructor(private http: HttpClient) { }

  public checkBarcode(barcode: string) {
    let company = localStorage.getItem("dhgUserCompany");
    console.log("company", company);
    return this.http
      .get(this.baseUrl + "/checkBarcode?barcode=" + barcode + "&warehouse=" + company)
      .map((data: any) => {
        console.log(data);
        return data;
      })
      .catch((err: any) => {
        console.log(err);
        return Observable.throw(err);
      });
  }

  public getReceiveList(searchKeyWord: string, pageNum: number) {
    let company = localStorage.getItem("dhgUserCompany");
    console.log("company", company);
    return this.http
      .get(this.baseUrl + "/getReceiveList?searchKeyWord=" + searchKeyWord + "&pageNum=" + pageNum+ "&company="+ company)
      .map((data: any) => {
        console.log("data: ", data);
        return data;
      })
      .catch((err: any) => {
        return Observable.throw(err);
      });
  }

  public insertBarcode(barcodeData: Barcode[]) {
    return this.http
      .post(this.baseUrl + "/insertBarcode", JSON.stringify(barcodeData), this.httpHeader)
      .map((response) => {
        console.log(response);
        return response;
      })
      .catch((err: any) => {
        console.log(err);
        return Observable.throw(err);
      });
  }

  public insertGoodsReceipt(goodsReceiptData: GoodsReceipt) {
    return this.http
      .post(this.baseUrl + "/insertGoodsReceipt", JSON.stringify(goodsReceiptData), this.httpHeader)
      .map((response: GoodsReceipt) => {
        console.log(response);
        return response;
      })
      .catch((err: any) => {
        console.log(err);
        return Observable.throw(err);
      });
  }

  public getSendOutList(searchKeyWord: string, pageNum: number) {
    let company = localStorage.getItem("dhgUserCompany");
    console.log("company", company);
    return this.http
      .get(this.baseUrl + "/getOutwarehousingList?searchKeyWord=" + searchKeyWord + "&pageNum=" + pageNum + "&company=" + company)
      .map((data: any) => {
        return data;
      })
      .catch((err: any) => {
        return Observable.throw(err);
      });
  }

  public insertGoodsIssue(goodsIssue: GoodsIssue) {
    return this.http
      .post(this.baseUrl + "/insertGoodsIssue", JSON.stringify(goodsIssue), this.httpHeader)
      .map(response => {
        console.log(response);
      })
      .catch((err: any) => {
        console.log(err);
        return Observable.throw(err);
      });
  }

  public getBarcodeList(searchKeyWord: string, pageNum: number) {
    return this.http
      .get(this.baseUrl + "/getBarcodeList?searchKeyWord=" + searchKeyWord + "&pageNum=" + pageNum)
      .map((items: any) => {
        console.log(items);
        return items;
      })
      .catch((err: any) => {
        console.log(err);
        return Observable.throw(err);
      });
  }

  getDeliveryInfo(deliveryNumber: string) {
    console.log("deliveryNumber: ", deliveryNumber);

    return this.http
      .get(this.baseUrl + "/getDetail?docNo=" + deliveryNumber)
      .map((item: any) => {
        console.log(item);
        return item;
      })
      .catch((err: any) => {
        console.log(err);
        return Observable.throw(err);
      });
  }

  getGoodsReceiptData(docNo: string, type: string) {
    let company = localStorage.getItem("dhgUserCompany");
    console.log("company", company);
    return this.http
      .get(this.baseUrl + "/getGoodsReceiptData?docNo=" + docNo + "&type=" + type + "&company="+company)
      .map((item: any) => {
        console.log(item);
        return item.data;
      })
      .catch((err: any) => {
        console.log(err);
        return Observable.throw(err);
      });
  }

  getGoodsIssueData(goodsReceipt: GoodsReceipt) {
    return this.http
      .post(this.baseUrl + "/getGoodsIssueData", JSON.stringify(goodsReceipt), this.httpHeader)
      .map((item: any) => {
        console.log(item);
        return item;
      })
      .catch((err: any) => {
        console.log(err);
        return Observable.throw(err);
      });
  }

  getGoodsIssueDataByID(id: any) {
    return this.http
      .get(this.baseUrl + "/getGoodsIssueDataByID?id="+id)
      .map((item: any) => {
        console.log(item);
        return item;
      })
      .catch((err: any) => {
        console.log(err);
        return Observable.throw(err);
      });
  }

  uploadFile(formData: FormData) {
    console.log("formData: ", formData);
    return this.http
      .post(this.baseUrl + "/upload", formData)
      .map(response => {
        console.log(response);
        return response;
      })
      .catch((err: any) => {
        console.log(err);
        return Observable.throw(err);
      });
  }

  sendData(formData: FormData) {
    console.log("formData: ", formData);
    return this.http
      .post(this.baseUrl + "/sendBarcode", formData)
      .map(response => {
        console.log(response);
        return response;
      })
      .catch((err: any) => {
        console.log(err);
        return Observable.throw(err);
      });
  }

  public getPackingList(searchKeyWord: string, pageNum: number) {
    return this.http
      .get(this.baseUrl + "/getPackingList?searchKeyWord=" + searchKeyWord + "&pageNum=" + pageNum)
      .map((data: any) => {
        console.log("data: ", data);
        return data;
      })
      .catch((err: any) => {
        return Observable.throw(err);
      });
  }
}
