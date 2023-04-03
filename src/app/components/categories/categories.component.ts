import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { MatChipListboxChange } from '@angular/material/chips';
import { isString } from 'lodash-es';
import { WallCategory } from 'src/app/entity/api.entity';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
})
export class CategoriesComponent implements OnInit {
  ngOnInit(): void {
  }
  readonly categories: string[] = Object.values(WallCategory).filter(isString);
  @Input() selected: string[] = [];

  @Output() change = new EventEmitter<string[]>();

  onChange(ev: MatChipListboxChange) {
    this.change.emit(ev.value);
  }
}
