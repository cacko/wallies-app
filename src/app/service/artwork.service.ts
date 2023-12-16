import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { ApiType, WallEntity } from '../entity/api.entity';
import {
  ActivatedRouteSnapshot,
  ResolveFn,
  RouterStateSnapshot,
} from '@angular/router';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ArtworkService {
  constructor(private api: ApiService) {}

  getArtwork(id: string): any {
    return this.api.fetch(ApiType.ARTWORK, id).pipe(
      map((res: any) => {
        console.log(res);
        return res.body;
      })
    );
  }
}

export const artworkResolver: ResolveFn<WallEntity> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const id = route.paramMap.get('id')!;
  return inject(ArtworkService).getArtwork(id);
};
