import { Injectable } from '@angular/core';
import { ApiType, WallEntity } from '../entity/api.entity';
import { ApiService } from './api.service';
import { tap, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ArtworksService {

  total = 0;

  constructor(private api: ApiService) { }

  fetch(limit: number, page: number): any {
    return this.api.fetch(ApiType.ARTWORKS, '', { limit, page }).pipe(
      tap((res) => {
        if (!this.total) {
          this.total = res.headers.get('x-pagination-total')
        }
      }),
      map((res: any) => res.body));
  }
}
