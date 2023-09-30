import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ActivatedRoute, Router } from '@angular/router';
import firebase from 'firebase/compat/app';
import { ApiService } from 'src/app/service/api.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  private redirectTo: string = "/";

  constructor(
    public auth: AngularFireAuth,
    private api: ApiService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }



  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((qp: any) => {
      this.redirectTo = qp.redirectTo || "/";
    })
  }



  private getProvider() {
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    return provider;
  }

  login_google() {
    this.api.showLoader();
    this.auth.signInWithPopup(this.getProvider()).then((res) => {
      if (res) {
        this.router.navigateByUrl(this.redirectTo);
      }
    });
  }
  login_anon() {
    this.api.showLoader();
    this.auth.signInAnonymously().then(() => {
      this.router.navigateByUrl(this.redirectTo);
    });
  }
  logout() {
    this.auth.signOut();
  }
}
