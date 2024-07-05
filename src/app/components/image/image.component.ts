import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Dialog } from '@angular/cdk/dialog';
import { fromEvent } from 'rxjs';
import { WallEntity } from '../../entity/api.entity';
import { MatCardModule } from "@angular/material/card"
import { CommonModule, NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  standalone: true,
  styleUrls: ['./image.component.scss'],
  imports: [
    CommonModule,
    MatCardModule,
    NgOptimizedImage

  ]
})
export class ImageComponent implements OnInit {
  src: string = '';
  contentType: string = '';
  caption: string = '';

  @Output() layout = new EventEmitter<boolean>();
  constructor(public dialog: Dialog) { }

  ngOnInit(): void {
    const img = new Image();
    img.src = this.data.webp_src;
    fromEvent(img, 'load').subscribe((_) => this.layout.emit(true));
    this.caption = this.data.title || '';
  }

  @Input() data!: WallEntity;
  @Input() query!: string;

}
