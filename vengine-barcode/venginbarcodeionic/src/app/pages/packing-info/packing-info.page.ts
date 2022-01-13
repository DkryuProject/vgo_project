import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { NavController, LoadingController, ToastController } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { InventoryService } from '../../services/inventory.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-packing-info',
  templateUrl: './packing-info.page.html',
  styleUrls: ['./packing-info.page.scss'],
})
export class PackingInfoPage implements OnInit {
  options: CameraOptions = {
    quality: 100,
    destinationType: this.camera.DestinationType.FILE_URI,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE
  };

  public frontPhoto: any;
  public backPhoto: any;
  public rightPhoto: any;
  public leftPhoto: any;
  public beforeLoadingPhoto: any;
  public halfLoadingPhoto: any;
  public fullLoadingPhoto: any;
  public closeDoorPhoto: any;
  public sealPhoto1: any;
  public sealPhoto2: any;
  public error: string;
  private loading: any;
  barcodeText: string;
  imageData: any;
  docNo: string;
  photoList: any = [];

  constructor(public navCtrl: NavController,
    private activatedRoute: ActivatedRoute,
    private readonly loadingCtrl: LoadingController,
    private readonly toastCtrl: ToastController,
    private inventoryService: InventoryService,
    private camera: Camera,
    private readonly changeDetectorRef: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.docNo = this.activatedRoute.snapshot.paramMap.get('docNo');
  }

  takePhoto(type: any) {
    this.camera.getPicture(this.options).then((imageData) => {
      if (type == "front") {
        this.frontPhoto = this.convertFileSrc(imageData);
      } else if (type == "back") {
        this.backPhoto = this.convertFileSrc(imageData);
      } else if (type == "right") {
        this.rightPhoto = this.convertFileSrc(imageData);
      } else if (type == "left") {
        this.leftPhoto = this.convertFileSrc(imageData);
      } else if (type == "beforeLoading") {
        this.beforeLoadingPhoto = this.convertFileSrc(imageData);
      } else if (type == "halfLoading") {
        this.halfLoadingPhoto = this.convertFileSrc(imageData);
      } else if (type == "fullLoading") {
        this.fullLoadingPhoto = this.convertFileSrc(imageData);
      } else if (type == "closeDoor") {
        this.closeDoorPhoto = this.convertFileSrc(imageData);
      } else if (type == "seal1") {
        this.sealPhoto1 = this.convertFileSrc(imageData);
      } else if (type == "seal2") {
        this.sealPhoto2 = this.convertFileSrc(imageData);
      }
      this.changeDetectorRef.detectChanges();
      this.changeDetectorRef.markForCheck();

      this.uploadPhoto(imageData, type);
      this.imageData = imageData;

    }, (err) => {
      this.error = JSON.stringify(err);
    });
  }

  private convertFileSrc(url: string): string {
    if (!url) {
      return url;
    }
    if (url.startsWith('/')) {
      return window['WEBVIEW_SERVER_URL'] + '/_app_file_' + url;
    }
    if (url.startsWith('file://')) {
      return window['WEBVIEW_SERVER_URL'] + url.replace('file://', '/_app_file_');
    }
    if (url.startsWith('content://')) {
      return window['WEBVIEW_SERVER_URL'] + url.replace('content:/', '/_app_content_');
    }
    return url;
  }

  selectPhoto(): void {
    const camera: any = navigator['camera'];
    camera.getPicture(imageData => {
      this.frontPhoto = this.convertFileSrc(imageData);
      this.uploadPhoto(imageData, '');
    }, error => this.error = JSON.stringify(error), {
        sourceType: camera.PictureSourceType.PHOTOLIBRARY,
        destinationType: camera.DestinationType.FILE_URI,
        quality: 100,
        encodingType: camera.EncodingType.JPEG,
      });
  }

  private async uploadPhoto(imageFileUri: any, type: any) {
    this.error = null;
    window['resolveLocalFileSystemURL'](imageFileUri,
      entry => {
        entry['file'](file => {
          this.photoList.push({
            "file": file,
            "type": type
          });
          //this.readFile(file, type);
        });
      });
  }

  private async readFile(file: any, type: any) {
    const reader = new FileReader();
    reader.onloadend = () => {
      const formData = new FormData();
      const imgBlob = new Blob([reader.result], { type: file.type });
      formData.append('file', imgBlob, file.name);
      formData.append('packingNumber', this.docNo);
      formData.append('type', type);

      this.inventoryService.uploadFile(formData).subscribe((ok) => {
        console.log("flag:", ok);
        return ok;
      }, (error) => {
        console.log("error:", error);
        return error;
      });
    };
    reader.readAsArrayBuffer(file);
  }

  private async showToast(ok: boolean | {}) {
    if (ok === true) {
      const toast = await this.toastCtrl.create({
        message: 'Upload successful',
        duration: 2000,
        position: 'middle'
      });
      toast.present();
    } else {
      const toast = await this.toastCtrl.create({
        message: 'Upload failed',
        duration: 3000,
        position: 'middle'
      });
      toast.present();
    }
  }

  async uploadFile() {
    this.loading = await this.loadingCtrl.create({
      message: 'Uploading...'
    });

    this.loading.present().then(() => {
      for (let i = 0; i < this.photoList.length; i++) {
        console.log("photo:", this.photoList[i]);
        this.readFile(this.photoList[i].file, this.photoList[i].type).then((ok) => {

        });
      }

      this.loading.dismiss();
      this.showToast(true);
    });
  }
}
