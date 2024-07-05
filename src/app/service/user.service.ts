import { Injectable, inject } from "@angular/core";
import { Auth, User, GoogleAuthProvider, signInWithPopup, authState, signInAnonymously, signOut } from "@angular/fire/auth";
import { EMPTY, Observable } from "rxjs";
import { ApiService } from "./api.service";
import { LoaderService } from "./loader.service";
@Injectable({ providedIn: "root" })
export class UserService {

  public user: Observable<User | null> = authState(this.auth);

  isAdmin: boolean = false;

  constructor(
    private auth: Auth = inject(Auth),
    private loader: LoaderService
  ) {

  }

  init() {
  }

  async googeLogin() {
    this.loader.show();
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    const result = await signInWithPopup(this.auth, provider);
    return result;
  }
  async login_anon() {
    return await signInAnonymously(this.auth);
  }


  logout() {
    return signOut(this.auth);
  }

}
