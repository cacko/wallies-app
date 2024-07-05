import { Component, inject, isDevMode, OnInit } from '@angular/core';
import { SwUpdate, VersionEvent } from '@angular/service-worker';
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
import { Analytics, setAnalyticsCollectionEnabled } from '@angular/fire/analytics';
import { ColorsService } from './service/colors.service';


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
  $user = this.user.user;

  $colors = this.colorsService.$colors;
  $selectedColors = this.colorsService.$selected;

  constructor(
    private swUpdate: SwUpdate,
    private analytics: Analytics = inject(Analytics),
    public dialog: MatDialog,
    public user: UserService,
    public router: Router,
    public platform: Platform,
    private api: ApiService,
    private activatedRoute: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private loader: LoaderService,
    private colorsService: ColorsService
  ) {
    setAnalyticsCollectionEnabled(this.analytics, true);
    this.loader.show();
    if (isDevMode() === false) {
      this.swUpdate.versionUpdates.subscribe((evt: VersionEvent) => {
        if (evt.type == 'VERSION_READY') {
          this.swUpdate
            .activateUpdate()
            .then(() => document.location.reload())
        }
      });
      interval(120000).subscribe(() => this.swUpdate.checkForUpdate());
    }
    this.api.colors.subscribe({
      next: (colors: string) => {
        this.colorsService.colorsSubject.next(colors);
      }
    });
  }

  hideSpinner() {
    this.spinner.hide();
  }

  ngOnInit(): void {
    this.user.init();
    this.colorsService.colorsSubject.next(null);
    this.spinner.show();

    this.activatedRoute.fragment.subscribe({
      next: (data: any) => {
        try {
          const filter = JSON.parse(data);
          this.selectedCategories = filter?.c || [];
          this.colorsService.selectedSubject.next(filter?.h || []);
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
        h: this.colorsService.selected
      }),
    });
  }


}
