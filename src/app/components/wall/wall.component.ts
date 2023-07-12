import {
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WallEntity } from 'src/app/entity/api.entity';
import {
  orderBy,
} from 'lodash-es';
import { ChangeDetectionStrategy } from '@angular/core';
import { distanceFrom } from 'src/app/entity/colors';
import {
  FixedSizeVirtualScrollStrategy,
  VIRTUAL_SCROLL_STRATEGY,
} from '@angular/cdk/scrolling';
import { ApiService } from 'src/app/service/api.service';

export class CustomVirtualScrollStrategy extends FixedSizeVirtualScrollStrategy {
  constructor() {
    super(10, 20, 50);
  }
}
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
  providers: [
    { provide: VIRTUAL_SCROLL_STRATEGY, useClass: CustomVirtualScrollStrategy },
  ],
})
export class WallComponent implements OnInit {
  @Input() filterBy: RouteFilter = { c: [] };

  items: WallEntity[] = [];
  loading = true;
  colors = '';

  constructor(
    private activatedRoute: ActivatedRoute,
    private apiService: ApiService
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
