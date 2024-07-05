import { Component, OnInit } from '@angular/core';
import { SwUpdate, VersionEvent } from '@angular/service-worker';
import { MatSnackBar } from '@angular/material/snack-bar';
import { interval } from 'rxjs';
import { UserService } from './service/user.service';
import { ActivatedRoute, Router, Event, EventType, RouterModule } from '@angular/router';
import { Platform } from '@angular/cdk/platform';
import { some } from 'lodash-es';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from './service/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { LoaderService } from './service/loader.service';
import { CommonModule } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ColorsComponent } from './components/colors/colors.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { AvatarComponent } from './components/avatar/avatar.component';
import { LoaderComponent } from './components/loader/loader.component';

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
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    ColorsComponent,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatMenuModule,
    RouterModule,
    AvatarComponent,
    LoaderComponent
  ]
})
export class AppComponent implements OnInit {
  updating = false;
  connected = false;
  selectedCategories: string[] = [];
  selectedColors: string[] = [];
  colors = '';
  $user = this.user.user;

  constructor(
    private swUpdate: SwUpdate,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    public user: UserService,
    public router: Router,
    public platform: Platform,
    private api: ApiService,
    private activatedRoute: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private loader: LoaderService
  ) {
    this.loader.show();
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
    this.user.init();
    this.colors = '';
    this.spinner.show();

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
          return this.loader.show();

        case EventType.NavigationEnd:
        case EventType.NavigationCancel:
        case EventType.NavigationError:
        case EventType.NavigationSkipped:
          return this.loader.hide();
      };
    });
  }

  get isMobile(): boolean {
    return some([this.platform.ANDROID, this.platform.IOS]);
  }

  logout() {
    this.user.logout().then(() => this.router.navigateByUrl("/login"));
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
