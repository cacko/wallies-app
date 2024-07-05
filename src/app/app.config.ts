import { ApplicationConfig, provideZoneChangeDetection, isDevMode } from "@angular/core";
import { provideRouter } from "@angular/router";

import { routes } from "./app-routes"
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";
import { initializeApp, provideFirebaseApp } from "@angular/fire/app";
import { getAuth, provideAuth } from "@angular/fire/auth";
import { getAnalytics, provideAnalytics, ScreenTrackingService, UserTrackingService } from "@angular/fire/analytics";
import { provideHttpClient } from "@angular/common/http";
import { provideServiceWorker } from "@angular/service-worker";


export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes), provideAnimationsAsync(),
    provideFirebaseApp(() => initializeApp({
      "apiKey": "AIzaSyDV5Qk9WT8Dh8Ire32Zh1wCyvuYDz5vlvI",
      "authDomain": "wallies-7710c.firebaseapp.com",
      "projectId": "wallies-7710c",
      "storageBucket": "wallies-7710c.appspot.com",
      "messagingSenderId": "1078171198485",
      "appId": "1:1078171198485:web:1584c6b4b8c8d11e471a1c"
    })),
    provideAuth(() => getAuth()),
    provideAnalytics(() => getAnalytics()),
    ScreenTrackingService, UserTrackingService,
    provideHttpClient(),
    provideServiceWorker("ngsw-worker.js", {
      enabled: !isDevMode(),
      registrationStrategy: "registerWhenStable:30000"
    })]
};
