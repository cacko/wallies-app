import { Component, Inject } from '@angular/core';
import { snakeCase } from 'lodash-es';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { WallEntity } from 'src/app/entity/api.entity';

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
    @Inject(DIALOG_DATA)
    public data: WallEntity
  ) {}

  get imageFilename(): string | null {
    return `${snakeCase(this.data.title)}}.png`;
  }

  onClipboard() {
    this.snackbar.open('Parameters copied', 'Ok', { duration: 1000 });
  }

  downloadImage() {
    this.buttonDisabled = true;
    const canvas = document.createElement('canvas');
    const image = new Image();
    image.setAttribute('crossorigin', 'anonymous');
    image.src = this.data.raw_src;
    image.addEventListener('load', () => {
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      canvas.getContext('2d')?.drawImage(image, 0, 0);
      const dataURL = canvas.toDataURL('image/png');
      // const zeroth = {
      //   [piexif.ImageIFD.ImageDescription]: deburr(this.data.caption || ''),
      // };
      // const exifObj = { '0th': zeroth };
      // const exifbytes = piexif.dump(exifObj);
      // const dataURLWithExif = piexif.insert(exifbytes, dataURL);

      const link = document.createElement('a');
      link.download = this.imageFilename || '';
      link.href = dataURL;
      link.setAttribute('target', '_blank');
      link.click();
      link.remove();
      this.buttonDisabled = false;
    });
  }
}
