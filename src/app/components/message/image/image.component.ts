import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Dialog } from '@angular/cdk/dialog';
import { ImageZoomComponent } from '../image-zoom/image-zoom.component';
import { fromEvent } from 'rxjs';
import { WallEntity } from 'src/app/entity/api.entity';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss'],
})
export class ImageComponent implements OnInit {
  src: string = '';
  contentType: string = '';
  caption: string = '';

  @Output() layout = new EventEmitter<boolean>();
  @Output() pendingDelete = new EventEmitter<boolean>();

  constructor(public dialog: Dialog) {}

  ngOnInit(): void {
    const img = new Image();
    img.src = this.data.webp_src;
    fromEvent(img, 'load').subscribe(_ => this.layout.emit(true));
    // this.src = this.data.content;
    // this.contentType = this.data.contentType || 'image/webp';
    // this.caption = this.data.caption || '';
  }

  @Input() data!: WallEntity;
  @Input() query!: string;

  openDialog(): void {
    const dialogRef = this.dialog.open<string>(ImageZoomComponent, {
      panelClass: 'image-zoom-panel',
      backdropClass: 'image-zoom-backdrop',
      hasBackdrop: true,
      autoFocus: 'dialog',
      data: {
        src: this.src,
        query: this.query,
        caption: this.caption,
      },
    });

    dialogRef.closed.subscribe((result) => {});
  }
}
