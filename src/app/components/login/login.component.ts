import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import firebase from 'firebase/compat/app';
import { ApiService } from 'src/app/service/api.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  constructor(
    public auth: AngularFireAuth,
    private api: ApiService,
    private router: Router
  ) {}

  private getProvider() {
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    return provider;
  }

  login_google() {
    this.api.showLoader();
    this.auth.signInWithPopup(this.getProvider()).then((res) => {
      if (res) {
        this.router.navigate(['']);
      }
    });
  }
  login_anon() {
    this.api.showLoader();
    this.auth.signInAnonymously().then(() => {
      this.router.navigate(['']);
    });
  }
  logout() {
    this.auth.signOut();
  }
}
