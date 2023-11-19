import { Injectable, inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { ApiType, WallEntity } from '../entity/api.entity';
import { ActivatedRouteSnapshot } from '@angular/router';
import { RouterStateSnapshot } from '@angular/router';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class ArtworksService {
  constructor(private api: ApiService) {}

  getArtworks(): any {
    return this.api.fetch(ApiType.ARTWORKS, '', {limit: 20});
  }
}

export const artworksResolver: ResolveFn<WallEntity[]> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  return inject(ArtworksService).getArtworks();
};
