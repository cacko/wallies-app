import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WallCategory, WallEntity } from 'src/app/entity/api.entity';
import { chunk, isEmpty, isString, orderBy } from 'lodash-es';
import { ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { of } from 'rxjs';
import { NgxFlexMasonryGridComponent } from '@offensichtbar-codestock/ngx-flex-masonry-grid';
import { distance, distanceFrom } from 'src/app/entity/colors';

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
})
export class WallComponent implements OnInit {
  items: WallEntity[] = [];
  photos: WallEntity[] = [];
  filter: RouteFilter = { c: [] };
  loading = true;
  colors = '';
  @ViewChild(NgxFlexMasonryGridComponent) masonry?: NgxFlexMasonryGridComponent;
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
        ).filter((w) => !w.deleted);
        this.items = photos;
        this.colors = photos
          .map((p) => p.colors)
          .reduce((res: string[], clrs: string) => {
            for (const clr of clrs.split(',')) {
              if (distanceFrom(res, clr) > 70) {
                res.push(clr);
              }
            }
            return res;
          }, [])
          .join(',');
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
      this.photos = this.items.filter(
        (p) =>
          categories?.includes(p.category) &&
          (!colors.length ||
            Math.min(
              ...p.colors.split(',').map((pc) => distanceFrom(colors, pc))
            ) < 40)
      );
      this.updateLayout();
    }
  }

  getPhotos() {
    return of(this.photos);
  }

  updateLayout() {
    setTimeout(() => {
      this.masonry?.forceUpdateLayout();
    });
  }

  onDelete(photo: WallEntity, $event: any) {
    // const pos = findIndex(this.photos, { title: photo.title });
    // this.photos.splice(pos, 1);
  }

  itemLoaded($event: any) {
    // console.log('Item loaded ',$event)
    // this.updateLayout();
  }

  itemRemoved($event: any) {
    // console.log('Item removed ',$event)
  }

  itemsLoaded($event: any) {
    // console.log('Count loaded items',$event)
  }

  layoutComplete($event: any) {
    // console.log('layoutComplete',$event)
  }
}
