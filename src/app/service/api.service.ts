import { Injectable, inject } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ApiConfig, ApiType } from '../entity/api.entity';
import { HttpClient } from '@angular/common/http';
import { Params } from '@angular/router';
import {
  omitBy,
  isUndefined,
} from 'lodash-es';
import { LoaderService } from './loader.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  colorsSubject = new Subject<string>();
  colors = this.colorsSubject.asObservable();
  errorSubject = new Subject<string>();
  error = this.errorSubject.asObservable();
  userToken = '';
  constructor(
    private httpClient: HttpClient = inject(HttpClient),
    private loader: LoaderService
  ) { }


  fetch(
    type: ApiType,
    query: string = '',
    params: Params = {}
  ): Observable<any> {
    this.loader.show();
    return new Observable((subscriber: any) => {
      let id = query;
      this.httpClient
        .get(`${ApiConfig.BASE_URI}/${type}/${id}`, {
          headers: { 'X-User-Token': this.userToken },
          params: omitBy(params, isUndefined),
          observe: 'response',
        })
        .subscribe({
          next: (data: any) => {
            this.loader.hide();
            subscriber.next(data);
          },
          error: (error: any) => console.debug(error),
        });
    });
  }
}
