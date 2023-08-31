import {
  Component,
  Input,
  OnInit,
  ChangeDetectionStrategy
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WallEntity } from 'src/app/entity/api.entity';
import {
  orderBy,
} from 'lodash-es';
import { distanceFrom } from 'src/app/entity/colors';
import { ApiService } from 'src/app/service/api.service';
import { UserService } from 'src/app/service/user.service';

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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WallComponent implements OnInit {
  @Input() filterBy: RouteFilter = { c: [] };

  items: WallEntity[] = [];
  loading = true;
  colors = '';

  constructor(
    private activatedRoute: ActivatedRoute,
    private apiService: ApiService,
  ) {}

  ngOnInit() {
    this.activatedRoute.fragment.subscribe({
      next: (data: any) => {
        this.filterBy = JSON.parse(data);
      },
    });
    this.activatedRoute.data.subscribe({
      next: (data: RouteDataEntity) => {
        const photos = orderBy(
          data.data as WallEntity[],
          ['last_modified'],
          ['desc']
        );
        this.items = photos;
        const colors = photos
          .map((p) => p.colors)
          .reduce((res: string[], clrs: string) => {
            for (const clr of clrs.split(',')) {
              if (distanceFrom(res, clr) > 100) {
                res.push(clr);
              }
            }
            return res;
          }, [])
          .join(',');
        this.apiService.colorsSubject.next(colors);
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
