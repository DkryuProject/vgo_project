import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { Vibration } from '@ionic-native/vibration/ngx';
import { NativeAudio } from '@ionic-native/native-audio/ngx';
import { InventoryService } from '../../services/inventory.service';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-packing-barcode',
  templateUrl: './packing-barcode.page.html',
  styleUrls: ['./packing-barcode.page.scss'],
})
export class PackingBarcodePage implements OnInit {
  type: string;
  barcodeValue: string;
  barcodeData: any = [];
  ionContentClass: string;
  loading: any;

  constructor(private activatedRoute: ActivatedRoute,
    private keyboard: Keyboard,
    private vibration: Vibration,
    private nativeAudio: NativeAudio,
    private readonly loadingCtrl: LoadingController,
    private inventoryService: InventoryService) {
  }

  ngOnInit() {
    this.type = this.activatedRoute.snapshot.paramMap.get('type');
    if (this.type == "packed") {
      this.ionContentClass = "ionContentPackedColor"
    } else {
      this.ionContentClass = "ionContentShipedColor"
    }
  }

  ionViewDidLeave() {
    this.nativeAudio.unload('scanCompleteID').then(function() {
      console.log("scanComplete Beep unloaded audio!");
    }, function(err) {
      console.log("couldn't unload audio... " + err);
    });
  }

  ionViewWillEnter() {
    console.log("ionViewWillEnter");
    this.nativeAudio.preloadComplex('scanCompleteID', 'assets/audio/beep2.mp3', 1, 1, 0).then(function() {
      console.log("scanComplete beep audio loaded!");
    }, function(err) {
      console.log("audio failed: " + err);
    });

    setTimeout(() => {
      this.keyboard.hide();
    }, 150);
  }

  scanCompleteSignal() {
    this.vibration.vibrate([200, 200, 200]);
    this.nativeAudio.play('scanCompleteID').then(function() {
      console.log("playing audio!");
    }, function(err) {
      console.log("error playing audio: " + err);
    });
  }

  barcodeInput(event: any) {
    this.scanCompleteSignal();
    if (event.target.value != "") {
      console.log("You entered: ", event.target.value);
      console.log("barcodeValue: ", this.barcodeValue);
      console.log("barcodeData Length: ", this.barcodeData.length);
      let compareCheck = false;

      for (let i = 0; i < this.barcodeData.length; i++) {
        if (this.barcodeData[i] == event.target.value) {
          compareCheck = true;
        }
      }

      if (!compareCheck) {
        this.barcodeData.push(event.target.value);
      } else {

      }
      this.barcodeValue = "";
      event.target.value = "";
      console.log("barcodeValue: ", this.barcodeValue);
    }
  }

  sendData() {
    this.loadingProgress().then(() => {
      var sendData = new FormData();
      sendData.append("type", this.type);
      sendData.append("barcodeData", this.barcodeData);

      this.inventoryService.sendData(sendData).subscribe((res: any) => {
        console.log("res: ", res);
        this.loading.dismiss().then(() => {
          this.vibration.vibrate([1000]);
          this.barcodeData = [];
        }, (error: any) => {
          console.log("error: ", error);
          this.loading.dismiss();
        });
      });
    });
  }

  private async loadingProgress() {
    this.loading = await this.loadingCtrl.create({
      message: "Sending..."
    });
    this.loading.present();
  }
}
