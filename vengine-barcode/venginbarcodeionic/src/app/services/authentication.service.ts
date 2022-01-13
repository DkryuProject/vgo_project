import { Platform, NavController } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

const ACCESS_TOKEN = "DHG_ACCESS_TOKEN";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  httpHeader = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  private baseUrl: string = "http://localhost:5000";

  authenticationState = new BehaviorSubject(false);
  user: any = {};

  constructor(private storage: Storage, private platform: Platform, private http: HttpClient, public navCtrl: NavController) {
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

  isAuthenticated() {
    return this.authenticationState.value;
  }

  setAuthenticated() {
    this.authenticationState.next(true);
  }

  login(user: any) {
    return this.http
      .post(this.baseUrl + "/auth/login", JSON.stringify(user), this.httpHeader)
      .map((response) => {
        console.log(response);
        return response;
      })
      .catch((err: any) => {
        console.log(err);
        return Observable.throw(err);
      });
  }

  signUp(user: any) {
    return this.http
      .post(this.baseUrl + "/auth/signup", JSON.stringify(user), this.httpHeader)
      .map((response) => {
        console.log(response);
        return response;
      })
      .catch((err: any) => {
        console.log(err);
        return Observable.throw(err);
      });
  }
}
