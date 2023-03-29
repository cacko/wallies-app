import { Injectable } from '@angular/core';
import { Observable, Subject, tap, map, of } from 'rxjs';
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
import { isEmpty, omitBy } from 'lodash-es';
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

  fetch(type: ApiType, query: string = "", params: Params = {}): Observable<any> {
    let id = query;

    const cacheKey = this.cacheKey(type, id, params);

    // const cached = this.inCache(cacheKey);

    // if (cached) {
    //   return of(cached);
    // }
    return this.httpClient
      .get(`${ApiConfig.BASE_URI}/${type}/${id}`, {
        params: omitBy(params, isEmpty),
      })
      .pipe(
        map((data: any) => {
          // if (data) {
          //   localStorage.setItem(
          //     cacheKey,
          //     JSON.stringify({ data: data, timestamp: moment() })
          //   );
          // }
          return data;
        })
      );
  }

  private cacheKey(type: ApiType, id: string, params: Params = {}): string {
    return md5(`${type}-${id}-${JSON.stringify(params)}`);
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
