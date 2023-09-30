import { NgModule } from '@angular/core';
import { RouterModule, Routes, ActivatedRouteSnapshot,RouterStateSnapshot  } from '@angular/router';
import {
  AngularFireAuthGuard,
  redirectUnauthorizedTo,
  redirectLoggedInTo,
} from '@angular/fire/compat/auth-guard';
import { LoginComponent } from './components/login/login.component';
import { WallComponent } from './components/wall/wall.component';
import { artworksResolver } from './service/artworks.service';
import { ViewComponent } from './components/view/view.component';
import { artworkResolver } from './service/artwork.service';

// const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);
// const redirectLoggedInToHome = () => redirectLoggedInTo(['w']);

/** add redirect URL to login */
const redirectUnauthorizedToLogin = (next: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  return redirectUnauthorizedTo(`/login?redirectTo=${state.url}`);
};

/** Uses the redirectTo query parameter if available to redirect logged in users, or defaults to '/' */
const redirectLoggedInToPreviousPage = (next: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  let redirectUrl = '/';
  try {
    const redirectToUrl = new URL(state.url, location.origin);
    const params = new URLSearchParams(redirectToUrl.search);
    redirectUrl = params.get('redirectTo') || '/';
  } catch (err) {
    // invalid URL
  }
  return redirectLoggedInTo(redirectUrl);
};

const routes: Routes = [
  {
    path: '',
    component: WallComponent,
    pathMatch: 'full',
    resolve: {
      data: artworksResolver,
    },
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin },
  },
  {
    path: 'v/:id',
    component: ViewComponent,
    pathMatch: 'full',
    resolve: {
      data: artworkResolver,
    },
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin },
  },
  {
    path: 'login',
    component: LoginComponent,
    pathMatch: 'full',
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectLoggedInToPreviousPage },
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
