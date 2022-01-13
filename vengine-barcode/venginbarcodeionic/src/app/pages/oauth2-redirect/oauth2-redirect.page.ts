import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-oauth2-redirect',
  templateUrl: './oauth2-redirect.page.html',
  styleUrls: ['./oauth2-redirect.page.scss'],
})
export class Oauth2RedirectPage implements OnInit {

  constructor(private activatedRoute: ActivatedRoute, ) {
    this.activatedRoute.queryParams.subscribe((res: any) => {
      console.log(res);
    });
  }

  ngOnInit() {
  }

}
