import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { head, snakeCase } from 'lodash-es';
import { WallCategory, WallEntity } from 'src/app/entity/api.entity';
import { saveAs } from 'file-saver';

interface RouteDataEntity {
  data?: WallEntity[];
}

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss'],
})
export class ViewComponent implements OnInit {
  data!: WallEntity;
  buttonDisabled = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private snackbar: MatSnackBar
  ) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe({
      next: (data: RouteDataEntity) => {
          this.data = head(data.data) || {  title: "",
            raw_src: "",
            web_uri: "",
            webp_src: "",
            category: WallCategory.ABSTRACT,
            colors: "",
            last_modified: 0};
      },
    });
  }

  get imageFilename(): string {
    return `${snakeCase(this.data.title)}.png`;
  }

  getImageStyle(): {
    [key: string]: string;
  } {
    return {"background-image": `url("${this.data.webp_src}")`};
  }

  onClipboard() {
    this.snackbar.open('Parameters copied', 'Ok', { duration: 1000 });
  }

  downloadImage() {
    this.buttonDisabled = true;
    saveAs(this.data.raw_src, this.imageFilename);
    this.buttonDisabled = false;
  }
}
