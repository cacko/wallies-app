import {
  Component,
  Input,
  OnInit,
  ChangeDetectionStrategy
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiType, WallCategory, WallEntity } from 'src/app/entity/api.entity';
import {
  flatten,
  orderBy,
  uniq,
  pull,
  isEmpty,
  isString
} from 'lodash-es';
import { distanceFrom } from 'src/app/entity/colors';
import { ApiService } from 'src/app/service/api.service';
import { UserService } from 'src/app/service/user.service';
import { ArtworksService } from 'src/app/service/artworks.service';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { LoaderService } from 'src/app/service/loader.service';
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

  items = new PhotoDataSource(this.service, this.loader)
  loading = true;
  colors = '';

  constructor(
    private activatedRoute: ActivatedRoute,
    private apiService: ApiService,
    private service: ArtworksService,
    private loader: LoaderService
  ) {

  }

  ngOnInit() {
    this.loader.show();
    this.activatedRoute.fragment.subscribe({
      next: (data: any) => {
        this.items.loaded.subscribe(res => {
          if (res) {
            this.filterBy = JSON.parse(data);
            this.items.filterBy(this.filterBy);
          }
        })
      },
    });
    this.items.loaded.subscribe(res => {
      if (res) {
        const photos = this.items.getData();
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
      }
    });
  }

  updateLayout() {
    setTimeout(() => { });
  }

  onScrollChange($event: number) {
    this.updateLayout();
  }
}
export class PhotoDataSource extends DataSource<WallEntity | undefined> {
  private _length = 10000;
  private _pageSize = 100;
  private _cachedData = Array.from<WallEntity>({ length: this._length });
  private _fetchedPages = new Set<number>();
  private readonly _dataStream = new BehaviorSubject<(WallEntity | undefined)[]>(this._cachedData);
  private readonly _subscription = new Subscription();
  private loadedSubject = new BehaviorSubject<boolean>(false);
  loaded = this.loadedSubject.asObservable();
  constructor(
    private api: ArtworksService,
    private loader: LoaderService
  ) {
    super();
  }

  connect(collectionViewer: CollectionViewer): Observable<(WallEntity | undefined)[]> {
    this._subscription.add(
      collectionViewer.viewChange.subscribe(range => {
        const startPage = this._getPageForIndex(range.start);
        const endPage = this._getPageForIndex(range.end - 1);
        const promises = [];
        for (let i = startPage; i <= endPage; i++) {
          promises.push(this._fetchPage(i));
        }
        Promise.all(promises).then(() => {
          this.loader.hide();
          this._subscription.unsubscribe();
          setTimeout(() => {
            const lastPage = Math.floor(this._length / this._pageSize);
            const tasks = [];
            for (let i = endPage; i <= lastPage; i++) {
              tasks.push(this._fetchPage(i));
            }
            Promise.all(tasks).then(() => {
              this.loadedSubject.next(true);
            });
          });
        })

      }),
    );
    return this._dataStream;
  }

  getData(): WallEntity[] {
    return this._cachedData;
  }

  filterBy(filter: RouteFilter): void {
    const items = [...this._cachedData];
    if (items.length > 0) {
      const categories = isEmpty(filter?.c)
        ? Object.values(WallCategory).filter(isString)
        : filter.c;
      const colors = filter?.h || [];
      const results = items.filter(
        (p) =>
          categories?.includes(p.category) &&
          (!colors.length ||
            Math.min(
              ...p.colors.split(',').map((pc, idx) => distanceFrom(colors, pc))
            ) < 60)
      );
      this._dataStream.next(results);
    }
  }

  disconnect(): void {
    this._subscription.unsubscribe();
  }

  private _getPageForIndex(index: number): number {
    return Math.floor(index / this._pageSize);
  }

  private _fetchPage(page: number):Promise<void> {
    if (this._fetchedPages.has(page)) {
      return Promise.resolve();
    }
    this._fetchedPages.add(page);
    return new Promise((resolve) => {
      this.api.fetch(this._pageSize, page + 1).subscribe({
        next: (data: any) => {
          if (this._length == 10000) {
            this._length = this.api.total;
            this._cachedData = Array.from<WallEntity>({ length: this._length });
          }
          const photos = data as WallEntity[];
          this._cachedData.splice(
            page * this._pageSize,
            this._pageSize,
            ...photos,
          );
          resolve();
          this._dataStream.next(this._cachedData);
        }
      })});
  }
}

