import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {
  user = {};

  constructor(private authService: AuthenticationService, public router: Router) { }

  ngOnInit() {
  }

  movePage() {
    this.router.navigate(['/login']);
  }

  signUp() {
    console.log("user: ", this.user);
    this.authService.signUp(this.user).subscribe((res: any) => {
      console.log("res: ", res);
      alert("You're successfully registered. Please login to continue!");
      this.router.navigate(['/login']);
    });
  }
}
