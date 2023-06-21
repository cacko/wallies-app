import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WallCategory, WallEntity } from 'src/app/entity/api.entity';
import { chunk, isEmpty, isString, orderBy } from 'lodash-es';
import { ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { of, Observable, Subject } from 'rxjs';
import { ColorsSubject, distance, distanceFrom } from 'src/app/entity/colors';
import { ColorComparison, parseColor } from '@baggie/color';
import {
  FixedSizeVirtualScrollStrategy,
  VIRTUAL_SCROLL_STRATEGY,
} from '@angular/cdk/scrolling';

export class CustomVirtualScrollStrategy extends FixedSizeVirtualScrollStrategy {
  constructor() {
    super(10, 20, 50);
  }
}
interface RouteDataEntity {
  data?: WallEntity[];
}

interface RouteFilter {
  c?: string[];
  h?: string[];
}

@Component({
  selector: 'app-wall',
  templateUrl: './wall.component.html',
  styleUrls: ['./wall.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: VIRTUAL_SCROLL_STRATEGY, useClass: CustomVirtualScrollStrategy },
  ],
})
export class WallComponent implements OnInit {
  items: WallEntity[] = [];
  private subject = new Subject<WallEntity[]>();
  photos: WallEntity[] = [];
  filter: RouteFilter = { c: [] };
  loading = true;
  colors = '';
  constructor(private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.fragment.subscribe({
      next: (data: any) => {
        this.filter = JSON.parse(data);
        this.doFilter();
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
        ColorsSubject.next(
          photos
            .map((p) => p.colors)
            .reduce((res: string[], clrs: string) => {
              for (const clr of clrs.split(',')) {
                if (distanceFrom(res, clr) > 100) {
                  res.push(clr);
                }
              }
              return res;
            }, [])
            .join(',')
        );
        this.doFilter();
      },
    });
  }

  private doFilter() {
    if (this.items.length > 0) {
      const categories = isEmpty(this.filter?.c)
        ? Object.values(WallCategory).filter(isString)
        : this.filter.c;
      const colors = this.filter?.h || [];
      this.photos = (this.items.filter(
        (p) =>
          categories?.includes(p.category) &&
          (!colors.length ||
            Math.min(
              ...p.colors.split(',').map((pc) => distanceFrom(colors, pc))
            ) < 40)
      ));
      this.updateLayout();
    }
  }

  updateLayout() {
    setTimeout(() => {
    });
  }

  onScrollChange() {
    this.updateLayout();
  }
}
