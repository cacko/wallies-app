import { Injectable } from '@angular/core';
import { Observable, Subject, delay, tap, expand, reduce, EMPTY } from 'rxjs';
import { ApiConfig, ApiType, WSLoading } from '../entity/api.entity';
import {
  HttpClient,
  HttpErrorResponse,
  HttpEvent,
  HttpEventType,
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
  findIndex,
  isArray,
  filter,
  map,
  isUndefined,
  isNumber,
  find,
  isArrayLike,
  concat,

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
  colorsSubject = new Subject<string>();
  colors = this.colorsSubject.asObservable();
  errorSubject = new Subject<string>();
  error = this.errorSubject.asObservable();
  userToken = '';
  constructor(private httpClient: HttpClient) { }

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

  // post(
  //   type: ApiType,
  //   body: FormData
  // ): Observable<UploadResponse> {
  //   const req = new HttpRequest("POST", `${ApiConfig.BASE_URI}/${type}`, {
  //     body,
  //     headers: { "X-User-Token": this.userToken },
  //     reportProgress: true
  //   });
  //   return this.httpClient.request(req).pipe(
  //     map((res: HttpEvent<any>) => {
  //       switch (res.type) {
  //         case HttpEventType.Response:
  //           const responseFromBackend = res.body;
  //           return {
  //             body: responseFromBackend,
  //             status: UploadStatus.UPLOADED
  //           };
  //         case HttpEventType.UploadProgress:
  //           const uploadProgress = +Math.round((100 * res.loaded) / (res.total || 1));
  //           return {
  //             status: UploadStatus.IN_PROGRESS,
  //             progress: uploadProgress
  //           };
  //         default:
  //           return of({ status: UploadStatus.ERROR, progress: 0 });
  //       }
  //     })
  //   );
  // }


  private process(data: any, type: ApiType) {

    const cacheKey = this.cacheKey(type);
    const cached = this.inCache(cacheKey) || [];

    if (isArray(data)) {
      const cachedIds = map(cached, 'id');
      cached.push(...filter(data, (d) => !cachedIds.includes(d.id)));
      data
        .filter((d) => cachedIds.includes(d.id))
        .forEach((d) => {
          const idx = findIndex(cached, { id: d.id });
          if (isNumber(idx)) {
            cached[idx] = d;
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

    if (isArray(data)) {
      return cached.filter((c: any) => !c.deleted);
    } else {
      const returnId = 'id' in data ? data.id : '';
      return find(cached, { id: returnId });
    }

  }




  fetch(
    type: ApiType,
    query: string = '',
    params: Params = {}
  ): Observable<any> {
    return new Observable((subscriber: any) => {
      let id = query;

      const cacheKey = this.cacheKey(type);
      const cached = this.inCache(cacheKey) || [];
      if (cached.length) {
        params['last_modified'] = head(
          orderBy(cached, ['last_modified'], ['desc'])
        ).last_modified;
      }

      this.httpClient
        .get(`${ApiConfig.BASE_URI}/${type}/${id}`, {
          headers: { 'X-User-Token': this.userToken },
          params: omitBy(params, isUndefined),
          observe: 'response',
        })
        .pipe(
          expand((res) => {
            const nextPage = res.headers.get('x-pagination-next');
            const pageNo = parseInt(String(res.headers.get('x-pagination-page')));
            return nextPage
              ? this.httpClient.get(nextPage, {
                headers: { 'X-User-Token': this.userToken },
                observe: 'response',
              }).pipe(delay(pageNo * 200))
              : EMPTY;
          }),
          reduce((acc, current): any => {
            const data = current.body || {};
            const pageNo = parseInt(String(current.headers.get('x-pagination-page')));
            return isArrayLike(data) ? concat(acc, data) : data;
          }, [])
        )
        .subscribe({
          next: (data: any) => {
            subscriber.next(this.process(data, type));
          },
          error: (error: any) => console.debug(error),
        });
    });
  }

  private cacheKey(type: ApiType): string {
    return md5(`${type}`);
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
