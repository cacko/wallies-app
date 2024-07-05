import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../service/api.service';
import { UserService } from '../../service/user.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { LoaderService } from '../../service/loader.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule
  ]
})
export class LoginComponent implements OnInit {

  private redirectTo: string = "/";

  constructor(
    private api: ApiService,
    public user: UserService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private loader: LoaderService
  ) { }



  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((qp: any) => {
      this.redirectTo = qp.redirectTo || "/";
    })
  }


  login_google() {
    this.user.googeLogin().then((r) => this.router.navigateByUrl(this.redirectTo)
    ).catch((err) => this.router.navigateByUrl(window.location.href));
  }


  login_anon() {
    this.user.login_anon().then((r) => this.router.navigateByUrl(this.redirectTo)).catch((err) => this.router.navigateByUrl(window.location.href));
  }

  logout() {
    this.user.logout().then((r) => this.router.navigateByUrl("/login"));
  }
}