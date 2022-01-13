import { Platform, NavController } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { BehaviorSubject } from 'rxjs';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

const ACCESS_TOKEN = "DHG_ACCESS_TOKEN";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  authenticationState = new BehaviorSubject(false);
  user: any = {};

  constructor(private storage: Storage, private platform: Platform, private googlePlus: GooglePlus, private http: HttpClient, public navCtrl: NavController) {
    this.platform.ready().then(() => {
      this.checkToken();
      //this.authenticationState.next(false);
    });
  }

  checkToken() {
    this.storage.get(ACCESS_TOKEN).then(res => {
      if (res) {
        console.log("res: ", res);
        //this.getData(res);
        this.authenticationState.next(true);
      }
    })
  }

  login() {
    return new Observable((observer) => {
      this.googlePlus.login({}).then(res => {
        console.log("res: ", res);
        this.user = res;
        this.storage.set(ACCESS_TOKEN, this.user.accessToken).then(() => {
          this.getData(this.user.accessToken).subscribe((data: any) => {
            console.log("data flag:", data);
            observer.next(true);
            this.authenticationState.next(true);
          },(error: any)=>{
            observer.next(false);
          });
        });
      })
        .catch((err: any) => {
          console.log(err);
          observer.next(false);
        });
    });
  }

  async logout() {
    console.log("Log Out");
    await this.googlePlus.logout()
      .then(res => {
        console.log("Logout res: ", res);
        //user logged out so we will remove him from the NativeStorage
      }, err => {
        console.log(err);
      });

    this.storage.remove(ACCESS_TOKEN).then(() => {
      //this.router.navigateByUrl('/login');
      this.authenticationState.next(false);
    });
  }

  isAuthenticated() {
    return this.authenticationState.value;
  }

  getData(token: string) {
    return new Observable((observer) => {
      this.http.get("https://www.googleapis.com/oauth2/v1/userinfo?access_token=" + token).subscribe((data: any) => {
        console.log("userInfo", data);
        this.user.name = data.name;
        this.user.email = data.email;
        this.user.image = data.picture;

        localStorage.setItem('dhgUserName', this.user.name);
        localStorage.setItem('dhgUserEmail', this.user.email);
        localStorage.setItem('dhgUserID', this.user.email);
        localStorage.setItem('dhgUserImage', this.user.image);

        if (this.user.email != "dkryu@dhgsourcing.com") {
          localStorage.setItem('dhgUserCompany', 'VENGINE');
        } else {
          localStorage.setItem('dhgUserCompany', 'DAEHAN GLOBAL');
        }
        observer.next(true);
      }, (error: any) => {
        console.log("error: ", error);
        observer.next(false);
      });
    });
  }
}
