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

  @ViewChild(CdkVirtualScrollableElement) wrapper?: CdkVirtualScrollableElement;
  constructor(
    private activatedRoute: ActivatedRoute,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe({
      next: (data: RouteDataEntity) => {
        const photos = data.data as WallEntity[];
        this.photos.push(...photos);
        // interval(1000).subscribe(() => {
        setTimeout(() => {
          const wrapper = this.wrapper
            ?.getElementRef()
            .nativeElement.querySelector('.cdk-virtual-scroll-content-wrapper');
          this.renderer.setStyle(wrapper, 'display', 'grid');
          this.renderer.setStyle(
            wrapper,
            'grid-template-columns',
            'repeat(auto-fit, minmax(35em, 1fr)'
          );
          this.renderer.setStyle(wrapper, 'grid-auto-flow', 'dense');
        });

      },
    });
  }

  onDelete(photo: WallEntity, $event: any) {
    const pos = findIndex(this.photos, { title: photo.title });
    this.photos.splice(pos, 1);
  }

  getStyle(item: WallEntity): { [key: string]: string } {
    return {
      'background-src': `url(${item.webp_src})`,
    };
  }
}
