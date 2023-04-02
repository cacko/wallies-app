import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoaderComponent } from './components/loader/loader.component';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatListModule } from '@angular/material/list';
import { TextFieldModule } from '@angular/cdk/text-field';
import { FIREBASE_OPTIONS } from '@angular/fire/compat';
import {
  MatFormFieldModule,
  MAT_FORM_FIELD_DEFAULT_OPTIONS,
} from '@angular/material/form-field';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { LoginComponent } from './components/login/login.component';
import { SETTINGS as AUTH_SETTINGS } from '@angular/fire/compat/auth';
import { AvatarComponent } from './components/avatar/avatar.component';
import { ImageComponent } from './components/message/image/image.component';
import { ImageZoomComponent } from './components/message/image-zoom/image-zoom.component';
import { SafePipeModule } from 'safe-pipe';
import { PlatformModule } from '@angular/cdk/platform';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatRippleModule } from '@angular/material/core';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MomentModule } from 'ngx-moment';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { ApiService } from './service/api.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { WallComponent } from './components/wall/wall.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { NgxFlexMasonryGridModule } from '@offensichtbar-codestock/ngx-flex-masonry-grid';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

const MaterialModules = [
  MatInputModule,
  MatSnackBarModule,
  MatCardModule,
  MatDividerModule,
  MatProgressBarModule,
  MatButtonModule,
  MatIconModule,
  OverlayModule,
  MatAutocompleteModule,
  MatBottomSheetModule,
  MatListModule,
  TextFieldModule,
  MatFormFieldModule,
  MatExpansionModule,
  MatMenuModule,
  ClipboardModule,
  MatDialogModule,
  PlatformModule,
  MatTooltipModule,
  MatRippleModule,
  DragDropModule,
  MatToolbarModule,
  ScrollingModule,
  MatProgressSpinnerModule,
];

@NgModule({
  declarations: [
    AppComponent,
    LoaderComponent,
    LoginComponent,
    AvatarComponent,
    ImageComponent,
    ImageZoomComponent,
    WallComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000',
    }),
    BrowserAnimationsModule,
    ReactiveFormsModule,
    SafePipeModule,
    MomentModule,
    HttpClientModule,
    NgxFlexMasonryGridModule,
    LazyLoadImageModule,
    ...MaterialModules,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    LoggerModule.forRoot({
      level: environment.production
        ? NgxLoggerLevel.INFO
        : NgxLoggerLevel.DEBUG,
    }),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiService,
      multi: true,
    },
    {
      provide: AUTH_SETTINGS,
      useValue: { appVerificationDisabledForTesting: true },
    },
    { provide: FIREBASE_OPTIONS, useValue: environment.firebase },
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { subscriptSizing: 'dynamic' },
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
