import { GoodsReceipt } from './goods-receipt';

export class GoodsIssue {
  goodsIssueID: number;
  goodsIssueDate: any = new Date();
  company: string;
  style: string;
  packingMeasurement: string;
  totalPackingQuantity: number = 0;
  unitMeasurement: string;
  totalUnitTotalQuantity: number = 0;
  goodsReceipt: GoodsReceipt;
  insertUser: string;
  insertDate: any = new Date();
  modifyDate: any = new Date();
}
