import { Component, OnInit } from '@angular/core';

import { Platform, ToastController, NavController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AuthenticationService } from './services/authentication.service';
import { Router, NavigationExtras } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  back_clicked = 0;

  constructor(
    private toastCtrl: ToastController,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private authenticationService: AuthenticationService,
    public navCtrl: NavController,
    public router: Router,
    public location: Location
  ) {
    this.initializeApp();
  }

  GetParam(name) {
    const results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(this.location.path());
    if (!results) {
      return 0;
    }
    return results[1] || 0;
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      console.log(this.location.path());
      if (this.location.path().indexOf("/oauth2callback") != -1) {
        let token = this.GetParam("token");

        if (token) {
          this.authenticationService.setAuthenticated();
        }
      }

      this.authenticationService.authenticationState.subscribe(state => {
        console.log("state: ", state);
        if (state) {
          //this.router.navigate(['main','home']);
          let navigationExtras: NavigationExtras = {
            queryParams: {
              scanType: "NORMAL",
              data: ""
            }
          }
          //this.router.navigate(['/main/scan'], navigationExtras);
          this.navCtrl.navigateRoot("/main/scan", navigationExtras);
        } else {
          //this.router.navigate(['login']);
          this.navCtrl.navigateRoot("login");
          //this.navCtrl.navigateRoot("bluetooth-test");
        }
      });
    });
  }

  ngOnInit() {
    this.appExitConfig();
  }

  private appExitConfig() {
    this.platform.backButton.subscribe(async () => {
      if (this.back_clicked === 0) {
        this.back_clicked++;

        const toast = await this.toastCtrl.create({
          message: '뒤로가기 버튼을 한번 더 누르시면 앱이 종료됩니다.',
          duration: 2000
        });
        toast.present();

        setTimeout(() => {
          this.back_clicked = 0;
        }, 2000);
      } else {
        navigator['app'].exitApp();
      }
    });
  }
}
