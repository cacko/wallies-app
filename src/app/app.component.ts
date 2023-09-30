import { AfterContentChecked, Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { SwUpdate, VersionEvent } from '@angular/service-worker';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, Subject, interval } from 'rxjs';
import { UserService } from './service/user.service';
import { Auth } from '@angular/fire/auth';
import { ActivatedRoute, OnSameUrlNavigation, Router, Event, EventType } from '@angular/router';
import { Platform } from '@angular/cdk/platform';
import { some } from 'lodash-es';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from './service/api.service';
import { WSLoading } from './entity/api.entity';
import { NgxSpinnerService } from 'ngx-spinner';

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
    private activatedRoute: ActivatedRoute,
    private spinner: NgxSpinnerService
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
    this.api.colors.subscribe({
      next: (colors: string) => {
        this.colors = colors;
      }
    });
  }

  hideSpinner() {
    this.spinner.hide();
  }

  ngOnInit(): void {
    this.colors = '';
    this.spinner.show();
    this.user.user.subscribe((user) => {
      user?.getIdToken().then((res) => {
        this.api.userToken = res;
        console.debug(res);
      });
      this.api.hideLoader();
    });

    this.activatedRoute.fragment.subscribe({
      next: (data: any) => {
        try {
          const filter = JSON.parse(data);
          this.selectedCategories = filter?.c || [];
          this.selectedColors = filter?.h || [];
        } catch (err) { }
      },
    });

    this.router.events.subscribe((ev: Event) => {
      switch (ev.type) {
        case EventType.NavigationStart:
          return this.api.showLoader();

        case EventType.NavigationEnd:
        case EventType.NavigationCancel:
        case EventType.NavigationError:
        case EventType.NavigationSkipped:
          return this.api.hideLoader();
      };
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
