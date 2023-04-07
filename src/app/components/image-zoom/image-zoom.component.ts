import { Component, Inject } from '@angular/core';
import { snakeCase } from 'lodash-es';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { WallEntity } from 'src/app/entity/api.entity';
import { saveAs } from 'file-saver';
import { Router } from '@angular/router';

@Component({
  selector: 'app-image-zoom',
  templateUrl: './image-zoom.component.html',
  styleUrls: ['./image-zoom.component.scss'],
})
export class ImageZoomComponent {
  buttonDisabled = false;

  constructor(
    public dialogRef: DialogRef<string>,
    private snackbar: MatSnackBar,
    private router: Router,
    @Inject(DIALOG_DATA)
    public data: WallEntity
  ) {}

  get imageFilename(): string {
    return `${snakeCase(this.data.title)}.png`;
  }

  onClipboard() {
    this.snackbar.open('Parameters copied', 'Ok', { duration: 1000 });
  }

  downloadImage() {
    this.buttonDisabled = true;
    saveAs(this.data.raw_src, this.imageFilename);
    this.buttonDisabled = false;
  }

  goToView() {
    this.dialogRef.close();
    this.router.navigate(['/v', this.data.id]);
  }
}
