import { Injectable } from "@angular/core";
import { Auth, User, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, authState, signInAnonymously, signOut } from "@angular/fire/auth";
import { EMPTY, Observable, Subject } from "rxjs";
import { ApiService } from "./api.service";
import { Admins } from "../entity/user.entity";
import { LoaderService } from "./loader.service";
@Injectable({ providedIn: "root" })
export class UserService {

  public readonly user: Observable<User | null> = EMPTY;

  isAdmin: boolean = false;

  constructor(
    private auth: Auth,
    private api: ApiService,
    private loader: LoaderService
  ) {
    this.user = authState(this.auth);
  }

  async googeLogin() {
    this.loader.show();
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    const result = await signInWithPopup(this.auth, provider);
    const user = result.user;
    const credential = GoogleAuthProvider.credentialFromResult(result);

  }
  async login_anon() {
    const result = await signInAnonymously(this.auth);
    const user = result.user;
  }


  async logout() {
    return await signOut(this.auth);

  }

}
