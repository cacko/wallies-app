import { Component, OnInit } from '@angular/core';
import { SwUpdate, VersionEvent } from '@angular/service-worker';
import { MatSnackBar } from '@angular/material/snack-bar';
import { interval } from 'rxjs';
import { UserService } from './service/user.service';
import { Auth } from '@angular/fire/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { Platform } from '@angular/cdk/platform';
import { slice, some } from 'lodash-es';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from './service/api.service';
import { WSLoading } from './entity/api.entity';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ColorsObserver } from './entity/colors';

enum SearchOriginator {
  BUTTON = 1,
  ESC = 2,
  ENTER = 3,
  SLASH = 4,
  INIT = 5,
  BACKDROP = 6,
}

const SEARCH_STATES = ['search', 'search_off'];

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  loading = true;
  updating = false;
  connected = false;
  selectedCategories: string[] = [];
  selectedColors: string[] = [];
  colors = '';

  constructor(
    private swUpdate: SwUpdate,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    public user: UserService,
    private auth: Auth,
    public router: Router,
    public platform: Platform,
    private api: ApiService,
    private activatedRoute: ActivatedRoute
  ) {
    this.api.showLoader();
    if (this.swUpdate.isEnabled) {
      this.swUpdate.versionUpdates.subscribe((evt: VersionEvent) => {
        if (evt.type == 'VERSION_READY') {
          this.updating = true;
          this.snackBar
            .open('Update is available', 'Update')
            .onAction()
            .subscribe(() =>
              this.swUpdate
                .activateUpdate()
                .then(() => document.location.reload())
            );
        }
      });
      interval(10000).subscribe(() => {
        this.swUpdate.checkForUpdate();
      });
    }
    this.api.loading.subscribe((res) => {
      setTimeout(() => {
        [WSLoading.BLOCKING_OFF, WSLoading.BLOCKING_ON].includes(res) &&
          (this.loading = WSLoading.BLOCKING_ON === res);
      });
    });
  }

  ngOnInit(): void {
    this.user.user.subscribe((user) => {
      this.api.hideLoader();
    });
    ColorsObserver.subscribe({
      next: (colors: string) => {
        this.colors = colors;
      }
    });
    this.activatedRoute.fragment.subscribe({
      next: (data: any) => {
        try {
          const filter = JSON.parse(data);
          this.selectedCategories = filter?.c || [];
          this.selectedColors = filter?.h || [];
        } catch (err) {}
      },
    });
  }

  get isMobile(): boolean {
    return some([this.platform.ANDROID, this.platform.IOS]);
  }

  logout() {
    this.auth.signOut().then(() => this.router.navigateByUrl('/login'));
  }

  onCategoryChange(selected: string[]) {
    this.selectedCategories = selected;
    this.router.navigate([''], {
      fragment: JSON.stringify({
        c: this.selectedCategories,
        h: this.selectedColors,
      }),
    });
  }

  onColorChange(selected: string[]) {
    this.selectedColors = selected;
    this.router.navigate([''], {
      fragment: JSON.stringify({
        c: this.selectedCategories,
        h: this.selectedColors,
      }),
    });
  }
}
