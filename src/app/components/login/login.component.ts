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
  login_google() {
    this.api.showLoader();
    if (window.location.hostname == 'localhost') {
      this.auth.signInWithRedirect(new firebase.auth.GoogleAuthProvider());
    } else {
      this.auth
        .signInWithPopup(new firebase.auth.GoogleAuthProvider())
        .then((res) => {
          if (res) {
            this.router.navigate(['']);
          }
        });
    }
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
