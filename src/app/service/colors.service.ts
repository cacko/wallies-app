import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ColorsService {

  selectedSubject = new BehaviorSubject<string[]>([]);
  $selected = this.selectedSubject.asObservable();

  colorsSubject = new BehaviorSubject<string|null>(null);
  $colors = this.colorsSubject.asObservable();

  constructor() { }


  get selected() {
    return this.selectedSubject.value || [];
  }

  get colors() {
    return this.colorsSubject.value || null;
  }
}
