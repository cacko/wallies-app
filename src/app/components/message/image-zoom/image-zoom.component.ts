import { Component, Inject, Renderer2 } from '@angular/core';
import { snakeCase, uniqueId, deburr } from 'lodash-es';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

declare var piexif: any;


export interface ImageZoomEntity {
  src: string;
  query: string;
  caption?: string;
}

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
    public data: ImageZoomEntity,
    private renderer: Renderer2
  ) {
    const script = this.renderer.createElement('script');
    this.renderer.setAttribute(script, 'src', 'assets/piexif.js');
    this.renderer.appendChild(document.head, script);
  }

  get imageFilename(): string | null {
    // const rand = faker.random.words(3);
    return `${snakeCase("!23")}_${uniqueId()}.jpg`;
  }

  onClipboard() {
    this.snackbar.open('Parameters copied', 'Ok', { duration: 1000 });
  }

  downloadImage() {
    this.buttonDisabled = true;
    const canvas = document.createElement('canvas');
    const image = new Image();
    image.setAttribute('crossorigin', 'anonymous');
    image.src = this.data.src;
    image.addEventListener('load', () => {
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      canvas.getContext('2d')?.drawImage(image, 0, 0);
      const dataURL = canvas.toDataURL('image/jpeg', 0.9);
      const zeroth = {
        [piexif.ImageIFD.ImageDescription]: deburr(this.data.caption || ''),
      };
      const exifObj = { '0th': zeroth };
      const exifbytes = piexif.dump(exifObj);
      const dataURLWithExif = piexif.insert(exifbytes, dataURL);

      const link = document.createElement('a');
      link.download = this.imageFilename || '';
      link.href = dataURLWithExif;
      link.setAttribute('target', '_blank');
      link.click();
      link.remove();
      this.buttonDisabled = false;
    });
  }
}
