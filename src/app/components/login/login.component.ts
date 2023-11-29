import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/service/api.service';
import { UserService } from 'src/app/service/user.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  private redirectTo: string = "/";

  constructor(
    private api: ApiService,
    public user: UserService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }



  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((qp: any) => {
      this.redirectTo = qp.redirectTo || "/";
    })
  }





  async login_google() {
    await this.user.googeLogin();
    return await this.router.navigateByUrl(this.redirectTo);

  }


  async login_anon() {
    await this.user.login_anon();
    return await this.router.navigateByUrl(this.redirectTo);

  }


  async logout() {
    return await this.user.logout();
  }
}
