import { Barcode } from './barcode';

export class SendOut {
  outWareHousingNumber: string;
  outWareHousingDate: string;
  packingMeasurement: string;
  packingQuantity: number;
  unitMeasurement: string;
  unitQuantity: number;
  insertUser: string;
  insertDate: any = new Date();
  barcode: Barcode;
  warehouse: string;
  style: string;
}
