import { Injectable } from '@angular/core';
import { Observable, Subject, findIndex, tap } from 'rxjs';
import { ApiConfig, ApiType, WSLoading } from '../entity/api.entity';
import {
  HttpClient,
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import * as moment from 'moment';
import { Params } from '@angular/router';
import {
  omitBy,
  orderBy,
  head,
  isObject,
  isArray,
  filter,
  map,
  isUndefined,
  isNumber,
} from 'lodash-es';
import * as md5 from 'md5';

interface CacheEntry {
  timestamp: moment.Moment;
  data: any;
}

@Injectable({
  providedIn: 'root',
})
export class ApiService implements HttpInterceptor {
  private loaderSubject = new Subject<WSLoading>();
  loading = this.loaderSubject.asObservable();
  errorSubject = new Subject<string>();
  error = this.errorSubject.asObservable();
  constructor(private httpClient: HttpClient) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this.showLoader();
    return next.handle(req).pipe(
      tap(
        (event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
            this.onEnd();
          }
        },
        (err: HttpErrorResponse) => {
          this.onEnd();
          this.errorSubject.next(err.message);
        }
      )
    );
  }
  private onEnd(): void {
    this.hideLoader();
  }

  public showLoader(): void {
    this.loaderSubject.next(WSLoading.BLOCKING_ON);
  }
  public hideLoader(): void {
    this.loaderSubject.next(WSLoading.BLOCKING_OFF);
  }

  fetch(
    type: ApiType,
    query: string = '',
    params: Params = {}
  ): Observable<any> {
    return new Observable((subscriber: any) => {
      let id = query;

      const cacheKey = this.cacheKey(type, id);
      const cached = this.inCache(cacheKey) || [];
      if (cached.length) {
        params['last_modified'] = head(
          orderBy(cached, ['last_modified'], ['desc'])
        ).last_modified;
      }
      this.httpClient
        .get(`${ApiConfig.BASE_URI}/${type}/${id}`, {
          params: omitBy(params, isUndefined),
        })
        .subscribe({
          next: (data: any) => {
            if (isArray(data)) {
              const cachedIds = map(cached, 'id');
              cached.push(...filter(data, (d) => !cachedIds.includes(d.id)));
              data
                .filter((d) => cachedIds.includes(d.id))
                .forEach((d) => {
                  const idx = findIndex(cached, { id: d.id });
                  if (isNumber(idx)) {
                    cached[idx] = Object.assign(cached[idx], d);
                  }
                });
            } else if (isObject(data)) {
              cached.push(data);
            } else {
              return;
            }
            localStorage.setItem(
              cacheKey,
              JSON.stringify({ data: cached, timestamp: moment() })
            );
            subscriber.next(cached.filter((c: any) => !c.deleted));
          },
          error: (error: any) => console.debug(error),
        });
    });
  }

  private cacheKey(type: ApiType, id: string): string {
    return md5(`${type}-${id}`);
  }

  private inCache(key: string): any {
    const cached: string | null = localStorage.getItem(key);

    if (!cached) {
      return null;
    }

    const entry: CacheEntry = JSON.parse(cached);

    return entry.data;
  }
}
