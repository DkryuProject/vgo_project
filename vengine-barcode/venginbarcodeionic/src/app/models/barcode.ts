import { GoodsReceipt } from './goods-receipt';
import { Location } from './location';

export class Barcode {
  barcodeId: string;
  company: string;
  packingMeasurement: string;
  packingQuantity: number = 0;
  insertUser: string;
  insertDate: any = new Date();
  modifyDate: any = new Date();
  goodsReceipt: GoodsReceipt;
  location: Location;
}
