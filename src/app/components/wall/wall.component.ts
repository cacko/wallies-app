import {
  AfterContentInit,
  AfterViewInit,
  Component,
  OnChanges,
  OnInit,
  Renderer2,
  SimpleChanges,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WallEntity } from 'src/app/entity/api.entity';
import { findIndex } from 'lodash-es';
import { ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { interval } from 'rxjs';
import {
  CdkVirtualForOf,
  CdkVirtualScrollViewport,
  CdkVirtualScrollableElement,
} from '@angular/cdk/scrolling';

interface RouteDataEntity {
  data?: WallEntity[];
}

@Component({
  selector: 'app-wall',
  templateUrl: './wall.component.html',
  styleUrls: ['./wall.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WallComponent implements OnInit {
  photos: WallEntity[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe({
      next: (data: RouteDataEntity) => {
        const photos = data.data as WallEntity[];
        this.photos.unshift(...photos);
      },
    });
  }

  onDelete(photo: WallEntity, $event: any) {
    const pos = findIndex(this.photos, { title: photo.title });
    this.photos.splice(pos, 1);
  }

}
