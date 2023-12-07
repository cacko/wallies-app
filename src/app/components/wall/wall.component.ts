import {
  Component,
  Input,
  OnInit,
  ChangeDetectionStrategy
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WallEntity } from 'src/app/entity/api.entity';
import {
  flatten,
  orderBy,
  uniq,
  pull
} from 'lodash-es';
import { distanceFrom } from 'src/app/entity/colors';
import { ApiService } from 'src/app/service/api.service';
import { UserService } from 'src/app/service/user.service';
import { ArtworksService } from 'src/app/service/artworks.service';

interface RouteDataEntity {
  data?: WallEntity[];
}

export interface RouteFilter {
  c?: string[];
  h?: string[];
}

@Component({
  selector: 'app-wall',
  templateUrl: './wall.component.html',
  styleUrls: ['./wall.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class WallComponent implements OnInit {
  @Input() filterBy: RouteFilter = { c: [] };

  items: WallEntity[] = [];
  loading = true;
  colors = '';

  constructor(
    private activatedRoute: ActivatedRoute,
    private apiService: ApiService,
    private service: ArtworksService
  ) {}

  ngOnInit() {
    this.apiService.showLoader();
    this.activatedRoute.fragment.subscribe({
      next: (data: any) => {
        this.filterBy = JSON.parse(data);
      },
    });
    this.service.getArtworks().subscribe({
      next: (data:  WallEntity[]) => {
        const photos = orderBy(
          data as WallEntity[],
          ['last_modified'],
          ['desc']
        );
        this.items = photos;
        const allColors = uniq(flatten(photos.map(p => p.colors.split(","))));
        const colors = photos
          .map((p) => p.colors)
          .reduce((res: string[], clrs: string) => {
            for (const clr of clrs.split(',')) {
              if (distanceFrom(pull(allColors, clr), clr) > 60) {
                res.push(clr);
              }
            }
            return res;
          }, [])
          .join(',');
        this.apiService.colorsSubject.next(colors);
        this.apiService.hideLoader();
      },
    });
  }

  updateLayout() {
    setTimeout(() => {});
  }

  onScrollChange() {
    this.updateLayout();
  }
}
