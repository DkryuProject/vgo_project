import { Receive } from './receive';

export class GoodsReceipt {
  goodsReceiptNumber: string;
  goodsReceiptDate: any = new Date();
  company: string;
  style: string;
  supplier: string;
  packingMeasurement: string;
  totalPackingQuantity: number = 0;
  unitMeasurement: string;
  totalUnitTotalQuantity: number = 0;
  delivery: Receive;
  insertUser: string;
  insertDate: any = new Date();
  modifyDate: any = new Date();
}
