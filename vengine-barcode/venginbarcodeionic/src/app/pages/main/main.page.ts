import { Component, OnInit } from '@angular/core';
import { Router, RouterEvent } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {
  user: any = {};
  selectedPath = "";
  selectedIndex = 0;
  pages = [
    {
      title: 'Scan',
      url: '/main/scan',
      icon: 'scan'
    },
    {
      title: 'Receive',
      url: '/main/receive/menu',
      icon: 'reader'
    },
    /*
    {
      title: 'SendOut',
      url: '/main/sendOut',
      icon: 'pricetags'
    },
    */
    {
      title: 'Packing List',
      url: '/main/packing-list',
      icon: 'camera'
    },
    {
      title: 'Packing',
      url: '/main/packing-main',
      icon: 'camera'
    }
  ];

  constructor(private router: Router, private authService: AuthenticationService) {
    this.router.events.subscribe((event: RouterEvent) => {
      this.selectedPath = event.url;
    });
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    console.log("ionViewWillEnter 페이지 로딩");
    this.user.name = localStorage.getItem("dhgUserName");
    this.user.email = localStorage.getItem("dhgUserEmail");
    this.user.image = localStorage.getItem("dhgUserImage");
    console.log("userInfo: ", this.user);
  }

  logOut() {
    if (confirm("Log Out?")) {
      this.authService.logout();
    }
  }
}
