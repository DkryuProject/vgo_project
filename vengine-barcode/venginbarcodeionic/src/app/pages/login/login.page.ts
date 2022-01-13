import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  user = {};
  loading: any;

  constructor(private authService: AuthenticationService, private readonly loadingCtrl: LoadingController, public router: Router) { }

  ngOnInit() {
  }

  movePage() {
    this.router.navigate(['/sign-up']);
  }

  login() {
    this.presentLoading().then(() => {
      console.log("user: ", this.user);
      this.authService.login(this.user).subscribe((res: any) => {
        console.log("res: ", res);
        this.loading.dismiss().then(() => {
          localStorage.setItem("ACCESS_TOKEN", res.accessToken);
          this.router.navigate(['/home']);
        });
      });
    });
  }

  private async presentLoading() {
    this.loading = await this.loadingCtrl.create({
      message: 'Please wait...'
    });
    this.loading.present();
  }
}
