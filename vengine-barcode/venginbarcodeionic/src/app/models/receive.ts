import { GoodsReceipt } from './goods-receipt';

export class Receive {
  deliveryNumber: string;
  deliveryDate: string;
  company: string;
  supplier: string;
  packingMeasurement: string;
  packingQuantity: number = 0;
  unitMeasurement: string;
  unitQuantity: number = 0;
  item: string;
  style: string;
  color: string;
  size: string;
  goodsReceipt: GoodsReceipt;
}
