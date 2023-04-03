import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WallCategory, WallEntity } from 'src/app/entity/api.entity';
import { isEmpty, isString, orderBy } from 'lodash-es';
import { ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { Observable, Subject, Subscriber, interval, of } from 'rxjs';
import { NgxFlexMasonryGridComponent } from '@offensichtbar-codestock/ngx-flex-masonry-grid';

interface RouteDataEntity {
  data?: WallEntity[];
}

interface RouteFilter {
  c?: string[];
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
        );
        this.items = photos;
        this.doFilter();
      },
    });
  }

  private doFilter() {
    if (this.items.length > 0) {
      const categories =
       isEmpty(this.filter?.c)
          ? Object.values(WallCategory).filter(isString)
          : this.filter.c;
      this.photos = this.items.filter((p) => categories?.includes(p.category));
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
