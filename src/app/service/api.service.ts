import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
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
import { isEmpty, omitBy, orderBy, head, isObject } from 'lodash-es';
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
        params['last_modified'] = head(orderBy(cached, ['last_modified'], ['desc'])
          ).last_modified;
      }
      this.httpClient
        .get(`${ApiConfig.BASE_URI}/${type}/${id}`, {
          params: omitBy(params, isEmpty)
        })
        .subscribe({
          next: (data: any) => {
            if (isObject(data)) {
              cached.push(data);
            }
            else if (data.length) {
              cached.push(...data);
            } else {
              throw Error("no data");
            }
            localStorage.setItem(
              cacheKey,
              JSON.stringify({ data: cached, timestamp: moment() })
            );
            subscriber.next(cached);
          },
          error: (error: any) => console.debug(error)
        })
    });
  }

  private cacheKey(type: ApiType, id: string,): string {
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
