import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';
import { NavController, NavParams, Platform, AlertController, LoadingController, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs-compat/Subscription';
import { InventoryService } from '../../services/inventory.service';
import { ActivatedRoute } from '@angular/router';
import { Receive } from '../../models/receive';
import { Location } from '../../models/location';
import { Barcode } from '../../models/barcode';
import { GoodsReceipt } from '../../models/goods-receipt';
import { GoodsIssue } from '../../models/goods-issue';
import { Vibration } from '@ionic-native/vibration/ngx';
import { NativeAudio } from '@ionic-native/native-audio/ngx';

@Component({
  selector: 'app-scan',
  templateUrl: './scan.page.html',
  styleUrls: ['./scan.page.scss'],
})

export class ScanPage implements OnInit {
  receiveData: Receive;             //납품데이타
  goodsReceiptData: GoodsReceipt;
  goodsIssueData: Array<GoodsIssue> = [];
  goodsMoveData: GoodsIssue;
  barcodeData: Barcode;
  locationData: Location;
  deliveryNumber: string;

  scanData: string;
  scanSubscription: Subscription;
  barcodeType: string;
  barcodeList: Array<Barcode> = [];
  barcodeCount = 0;
  scanType = "BARCODE_SCAN";
  scanTitle = "Barcode Scan";
  loading: any;
  scanningloading: any;
  goodsReceiptQuantity = 0;
  goodsIssueQuantity = 0;
  remainPackingQuantity = 0;
  remainUnitQuantity = 0;
  goodsIssueStyle: string;
  goodsIssuePlant: string;

  constructor(public navCtrl: NavController,
    private activatedRoute: ActivatedRoute,
    public qrScanner: QRScanner,
    public platform: Platform,
    public alertCtrl: AlertController,
    public navParams: NavParams,
    private readonly loadingCtrl: LoadingController,
    private readonly toastCtrl: ToastController,
    private chRef: ChangeDetectorRef,
    private vibration: Vibration,
    private nativeAudio: NativeAudio,
    private inventoryService: InventoryService) {
    this.activatedRoute.queryParams.subscribe((params: any) => {
      this.scanType = params.scanType;
      if (this.scanType == "BARCODE_REGISTER") {
        this.scanTitle = "Barcode Register";
        this.deliveryNumber = params.data;
        this.getDeliveryInfo();
      } else if (this.scanType == "BARCODE_MOVE") {
        this.scanTitle = "Barcode Move";
        console.log("data: ", params);
        this.inventoryService.getGoodsIssueDataByID(params.data).subscribe((data: any) => {
          this.receiveData = data.goodsReceipt.delivery;
          this.goodsMoveData = data;
          console.log("Move Data: ", this.goodsMoveData);
        });
      }
    });

    platform.ready().then(() => {
      //this.prepareQRScan();
    });
  }

  ngOnInit() {
  }

  ionViewDidLoad() {
    console.log("Scan ionViewDidLoad");
  }

  ionViewDidEnter() {
    console.log("Scan ionViewDidEnter");
  }

  ionViewWillLeave() {
    console.log("Scan ionViewWillLeave");
  }

  ionViewDidLeave() {
    console.log("Scan ionViewDidLeave");
    this.nativeAudio.unload('scanCompleteID').then(function() {
      console.log("unloaded audio!");
    }, function(err) {
      console.log("couldn't unload audio... " + err);
    });

    this.qrScanner.pausePreview().then((status: QRScannerStatus)=> {
      console.log("ionViewDidLeave status: ", status);
    });
    this.hideCamera();
    this.scanSubscription.unsubscribe();
  }

  ionViewWillUnload() {
    console.log("Scan ionViewWillUnload");
  }

  ionViewWillEnter() {
    console.log("Scan ionViewWillEnter");
    this.nativeAudio.preloadComplex('scanCompleteID', 'assets/audio/beep2.mp3', 1, 1, 0).then(function() {
      console.log("audio loaded!");
    }, function(err) {
      console.log("audio failed: " + err);
    });
    this.prepareQRScan();
  }

  showCamera() {
    (window.document.querySelector('ion-app') as HTMLElement).classList.add('cameraView');
  }

  hideCamera() {
    (window.document.querySelector('ion-app') as HTMLElement).classList.remove('cameraView');
  }

  scanCompleteSignal() {
    this.scanSubscription.unsubscribe();
    this.qrScanner.getStatus().then((status: QRScannerStatus)=> {
      console.log("scanCompleteSignal status: ", status);
    });
    this.vibration.vibrate([200, 200, 200]);
    this.nativeAudio.play('scanCompleteID').then(function() {
      console.log("playing audio!");
    }, function(err) {
      console.log("error playing audio: " + err);
    });
  }

  prepareQRScan() {
    this.qrScanner.prepare().then((status: QRScannerStatus) => {
      console.log("status: ", status);
      if (status.authorized) {
        console.log("status.authorized");
        this.qrScanner.resumePreview();
        this.showCamera();
        // show camera preview
        this.qrScanner.show();
        this.scan();
      } else if (status.previewing) {
        console.log("status.previewing");

      } else if (status.denied) {
        console.log('camera permission denied');
        this.navCtrl.pop();
        this.qrScanner.openSettings();
      } else {
      }
    })
      .catch((e: any) => console.log('Error is', e));
  }

  scan() {
    console.log("Scan Ready");
    this.scanSubscription = this.qrScanner.scan().subscribe((barcodeText: string) => {
      this.scanCompleteSignal();
      this.inventoryService.checkBarcode(barcodeText).subscribe((data: any) => {
        if (data.type == "BY") {
          console.log("CASE. 상품바코드 찍은 경우");

          let barcodeObj = new Barcode();
          barcodeObj = data.barcode;

          if (barcodeObj.location == null) {
            console.log("BARCODE_LOCATION_REGISTER");
            this.scanType = "BARCODE_LOCATION_REGISTER";
            this.scanTitle = "바코드 위치 지정";

            this.loadingProgress("Loading...").then((res) => {
              let compareCheck = false;

              this.loading.dismiss().then(() => {
                for (let i = 0; i < this.barcodeList.length; i++) {
                  if (this.barcodeList[i].barcodeId == barcodeObj.barcodeId) {
                    compareCheck = true;
                  }
                }

                if (!compareCheck) {
                  this.barcodeList.push(barcodeObj);
                }
                console.log(this.barcodeList);
                this.chRef.detectChanges();
                this.prepareQRScan();
              });
            });
          } else {
            console.log("barcodeObj company", barcodeObj.company);
            console.log("local company", localStorage.getItem("dhgUserCompany"));
            if (barcodeObj.company != localStorage.getItem("dhgUserCompany") && this.scanType != "BARCODE_MOVE") {
              console.log("BARCODE_MOVE FIRST");
              this.barcodeList = [];
              this.barcodeList.push(barcodeObj);
              //send out리스트로 이동
              this.navCtrl.navigateForward("/main/sendOut");
            } else if (barcodeObj.company != localStorage.getItem("dhgUserCompany") && this.scanType == "BARCODE_MOVE") {
              console.log("BARCODE_MOVE");

              let compareCheck = false;

              for (let i = 0; i < this.barcodeList.length; i++) {
                if (this.barcodeList[i].barcodeId == barcodeObj.barcodeId) {
                  compareCheck = true;
                }
              }

              if (!compareCheck) {
                this.barcodeList.push(barcodeObj);
              }

              console.log(this.barcodeList);
              this.chRef.detectChanges();
              this.prepareQRScan();
            } else {
              console.log("BARCODE_OUT");
              this.scanType = "BARCODE_OUT";
              this.scanTitle = "출고하기";
              let compareCheck = false;

              for (let i = 0; i < this.barcodeList.length; i++) {
                if (this.barcodeList[i].barcodeId == barcodeObj.barcodeId) {
                  compareCheck = true;
                }
              }

              if (!compareCheck) {
                this.barcodeList.push(barcodeObj);

                console.log("goodsReceiptData: ", this.goodsReceiptData);
                if (this.goodsReceiptData == null) {
                  this.goodsReceiptData = barcodeObj.goodsReceipt;
                  this.remainPackingQuantity = this.goodsReceiptData.totalPackingQuantity;
                  this.remainUnitQuantity = this.goodsReceiptData.totalUnitTotalQuantity;
                  this.goodsIssueStyle = this.goodsReceiptData.style;
                  this.goodsIssuePlant = this.goodsReceiptData.company;
                  console.log("goodsReceiptData Input: ", this.goodsReceiptData);
                }

                console.log("goodsIssueData: ", this.goodsIssueData);
                if (this.goodsIssueData.length == 0) {
                  this.inventoryService.getGoodsIssueData(this.goodsReceiptData).subscribe((data: any) => {
                    console.log("res : ", JSON.stringify(data));
                    this.goodsIssueData = data;
                    console.log("goodsIssueData Input: ", this.goodsIssueData);

                    for (let i = 0; i < this.goodsIssueData.length; i++) {
                      this.remainPackingQuantity -= this.goodsIssueData[i].totalPackingQuantity;
                      this.remainUnitQuantity -= this.goodsIssueData[i].totalUnitTotalQuantity;
                      console.log("remainUnitQuantity", this.remainUnitQuantity);
                      this.chRef.detectChanges();
                    }
                  });
                }
              }

              this.chRef.detectChanges();
              //this.scanSubscription.unsubscribe();
              this.prepareQRScan();
            }
          }
        } else if (data.type == "LY") {
          console.log("CASE. 위치바코드 찍은 경우");
          let locationObj = new Location();
          locationObj = data.barcode;
          this.locationData = locationObj;
          this.scanType = "BARCODE_LOCATION_REGISTER";
          this.scanTitle = "바코드 위치 지정";

          this.chRef.detectChanges();
          //this.scanSubscription.unsubscribe();
          this.prepareQRScan();

        } else {
          if (this.receiveData == null) {
            console.log("CASE. 바코드 처음 스캔하여 입고정보가 없을 경우");
            this.barcodeList = [];
            let barcodeObj = new Barcode();
            barcodeObj.barcodeId = barcodeText;
            this.barcodeList.push(barcodeObj);

            //receie 리스트로 이동
            this.navCtrl.navigateForward("/main/receive/scan");
          } else {
            if (this.scanType == "BARCODE_CHANGE") {
              console.log("CASE. 바코드 변경 스캔");

            } else {
              console.log("CASE. 입고정보가 없는 바코드 스캔한 경우");
              //this.scanSubscription.unsubscribe();
              this.loadingProgress("Loading...").then((res) => {

                let barcodeObj = new Barcode();
                barcodeObj.barcodeId = barcodeText;

                let compareCheck = false;

                this.loading.dismiss().then(() => {
                  if (this.barcodeList.length < this.receiveData.packingQuantity) {
                    for (let i = 0; i < this.barcodeList.length; i++) {
                      if (this.barcodeList[i].barcodeId == barcodeObj.barcodeId) {
                        compareCheck = true;
                      }
                    }
                  } else {
                    //compareCheck = true;
                    //alert("입고될 수량을 초과하였습니다.");
                  }

                  if (!compareCheck) {
                    this.barcodeList.push(barcodeObj);
                  }
                  console.log(this.barcodeList);
                  this.chRef.detectChanges();
                  //this.scanSubscription.unsubscribe();
                  this.prepareQRScan();
                });
              });
            }
          }
        }
      });
    });
  }

  private async loadingProgress(text: string) {
    this.loading = await this.loadingCtrl.create({
      message: text
    });
    this.loading.present();
  }

  async saveData(type: string) {
    if (type != "GI") {
      console.log("goodsReceiptQuantity: ", this.goodsReceiptQuantity);
      console.log("unitQuantity: ", this.receiveData.unitQuantity);
      if((this.goodsReceiptQuantity == 0 || this.goodsReceiptQuantity == null) && this.scanType == "BARCODE_REGISTER"){
        alert("입고될 수량을 입력하세요.");
        this.chRef.detectChanges();
        //this.scanSubscription.unsubscribe();
        this.prepareQRScan();
        return;
      }
      if ((this.goodsReceiptQuantity > this.receiveData.unitQuantity) && this.scanType == "BARCODE_REGISTER") {
        alert("입고될 수량을 초과할 수 없습니다.");
        this.chRef.detectChanges();
        //this.scanSubscription.unsubscribe();
        this.prepareQRScan();
        return;
      }
    } else {
      if(this.goodsIssueQuantity == 0 || this.goodsIssueQuantity == null){
        alert("출고될 수량을 입력하세요.");
        this.chRef.detectChanges();
        //this.scanSubscription.unsubscribe();
        this.prepareQRScan();
        return;
      }

      if (this.goodsIssueQuantity > this.remainUnitQuantity) {
        alert("출고 수량을 초과할 수 없습니다.");
        this.chRef.detectChanges();
        //this.scanSubscription.unsubscribe();
        this.prepareQRScan();
        return;
      }
    }

    let msg = "";
    if (type == "GR") {
      msg = "입고 하시겠습니까?";
    } else if (type == "DGI") {
      msg = "직출고 하시겠습니까?";
    } else if (type == "GI") {
      msg = "출고 하시겠습니까?";
    }

    if (confirm(msg)) {
      if (this.goodsReceiptData == null && (type == "GR" || type == "DGI")) {
        let goodsReceiptObj = new GoodsReceipt();
        goodsReceiptObj.company = localStorage.getItem("dhgUserCompany");
        goodsReceiptObj.style = this.receiveData.style;
        goodsReceiptObj.supplier = this.receiveData.supplier;
        goodsReceiptObj.packingMeasurement = this.receiveData.packingMeasurement;
        goodsReceiptObj.totalPackingQuantity = this.barcodeList.length;
        goodsReceiptObj.unitMeasurement = this.receiveData.unitMeasurement;
        if (this.scanType == "BARCODE_REGISTER") {
          goodsReceiptObj.totalUnitTotalQuantity = this.goodsReceiptQuantity;
        } else {
          goodsReceiptObj.totalUnitTotalQuantity = this.goodsMoveData.totalUnitTotalQuantity;
        }

        goodsReceiptObj.insertUser = localStorage.getItem("dhgUserID");
        goodsReceiptObj.delivery = this.receiveData;

        this.insertGoodsReceipt(goodsReceiptObj, this.barcodeList);

        if (type == "DGI") {
          this.insertDirectGoodsIssue(goodsReceiptObj);
        }
      } else if (type == "GI") {
        let goodsIssueObj = new GoodsIssue();
        goodsIssueObj.company = this.goodsIssuePlant;
        goodsIssueObj.style = this.goodsIssueStyle;
        goodsIssueObj.packingMeasurement = this.goodsReceiptData.packingMeasurement;
        goodsIssueObj.totalPackingQuantity = 0;
        goodsIssueObj.unitMeasurement = this.goodsReceiptData.unitMeasurement;
        goodsIssueObj.totalUnitTotalQuantity = this.goodsIssueQuantity;
        goodsIssueObj.insertUser = localStorage.getItem("dhgUserID");
        goodsIssueObj.goodsReceipt = this.goodsReceiptData;

        this.insertGoodsIssue(goodsIssueObj);
      }
    }
  }

  private insertDirectGoodsIssue(goodsReceiptData: GoodsReceipt) {
    let goodsIssueObj = new GoodsIssue();
    goodsIssueObj.company = goodsReceiptData.company;
    goodsIssueObj.style = goodsReceiptData.style;
    goodsIssueObj.packingMeasurement = goodsReceiptData.packingMeasurement;
    goodsIssueObj.totalPackingQuantity = 0;
    goodsIssueObj.unitMeasurement = goodsReceiptData.unitMeasurement;
    goodsIssueObj.totalUnitTotalQuantity = goodsReceiptData.totalUnitTotalQuantity;
    goodsIssueObj.insertUser = localStorage.getItem("dhgUserID");
    goodsIssueObj.goodsReceipt = goodsReceiptData;

    this.insertGoodsIssue(goodsIssueObj);
  }

  private async insertGoodsIssue(goodsIssueObj: GoodsIssue) {
    this.inventoryService.insertGoodsIssue(goodsIssueObj).subscribe((response: any) => {
      console.log("res : ", JSON.stringify(response));
      this.scanType = "BARCODE_SCAN";
      this.goodsReceiptData = null;
      this.goodsIssueData = [];
      this.barcodeList = [];
      this.remainUnitQuantity = 0;
      this.chRef.detectChanges();
      this.prepareQRScan();
    });
  }

  private async insertGoodsReceipt(goodsReceiptData: GoodsReceipt, barcode: Barcode[]) {
    this.inventoryService.insertGoodsReceipt(goodsReceiptData).subscribe((response: any) => {
      console.log("res : ", JSON.stringify(response));
      this.goodsReceiptData = response;

      for (let i = 0; i < barcode.length; i++) {
        barcode[i].goodsReceipt = this.goodsReceiptData;
        barcode[i].packingQuantity = 1;
        barcode[i].packingMeasurement = this.receiveData.packingMeasurement;
        barcode[i].goodsReceipt = this.goodsReceiptData;
        barcode[i].company = localStorage.getItem("dhgUserCompany");
        barcode[i].insertUser = localStorage.getItem("dhgUserID");

        if (this.scanType == "BARCODE_MOVE") {
          barcode[i].location = null;
        }
      }
      this.insertBarcode(barcode);
    });
  }

  private async insertBarcode(barcodeData: Barcode[]) {
    this.inventoryService.insertBarcode(barcodeData).subscribe((response: any) => {
      console.log("res : ", JSON.stringify(response));
      this.loading.dismiss().then(() => {
        this.showToast(response.resultMessage).then(() => {
          this.receiveData = null;
          this.barcodeList = [];
          this.scanType = "BARCODE_SCAN";
          this.scanTitle = "Barcode Scan";
          this.chRef.detectChanges();
          //this.scanSubscription.unsubscribe();
          this.prepareQRScan();
        });
      });
    });
  }

  getDeliveryInfo() {
    this.inventoryService.getDeliveryInfo(this.deliveryNumber).subscribe((data: any) => {
      console.log("data: ", data);
      this.receiveData = data;

      this.inventoryService.getGoodsReceiptData(this.deliveryNumber, 'deliveryNo').subscribe((data: any) => {
        console.log("data: ", data);
        this.goodsReceiptData = data;
      });
    });
  }

  private async showToast(message: string) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }

  updateLocation() {
    if (this.locationData == null) {
      alert("저장할 위치가 없습니다.");
      return;
    }

    for (let i = 0; i < this.barcodeList.length; i++) {
      this.barcodeList[i].location = this.locationData;
    }

    this.inventoryService.insertBarcode(this.barcodeList).subscribe((response: any) => {
      console.log("res : ", JSON.stringify(response));
      this.showToast(response.resultMessage).then(() => {
        this.locationData = null;
        this.barcodeList = [];
        this.scanType = "BARCODE_SCAN";
        this.scanTitle = "Barcode Scan";
        this.chRef.detectChanges();
        //this.scanSubscription.unsubscribe();
        this.prepareQRScan();
      });
    });
  }
}
