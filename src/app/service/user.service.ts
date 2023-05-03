import { Injectable } from "@angular/core";
import { Auth, User, onAuthStateChanged } from "@angular/fire/auth";
import { Subject } from "rxjs";
import { ApiService } from "./api.service";
@Injectable({ providedIn: "root" })
export class UserService {

  private userSubject = new Subject<User | null>();
  user = this.userSubject.asObservable();

  constructor(
    auth: Auth,
    api: ApiService
  ) {
    onAuthStateChanged(auth, (user: User | null) => {
      console.log(user);
      if (!user) {
        this.userSubject.next(null);
        api.hideLoader();
        return;
      }
      this.userSubject.next(user)
    });
  }
}
