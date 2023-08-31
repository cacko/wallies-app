import { Injectable } from "@angular/core";
import { Auth, User, onAuthStateChanged } from "@angular/fire/auth";
import { Subject } from "rxjs";
import { ApiService } from "./api.service";
import { Admins } from "../entity/user.entity";
@Injectable({ providedIn: "root" })
export class UserService {

  private userSubject = new Subject<User | null>();
  user = this.userSubject.asObservable();

  isAdmin: boolean = false;

  constructor(
    auth: Auth,
    api: ApiService
  ) {
    onAuthStateChanged(auth, (user: User | null) => {
      if (!user) {
        this.userSubject.next(null);
        this.isAdmin = false;
        api.hideLoader();
        return;
      }
      this.isAdmin = Admins.includes(user?.email || "");
      this.userSubject.next(user);
    });
  }
}
