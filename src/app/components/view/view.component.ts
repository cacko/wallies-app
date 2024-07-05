import { Component, HostListener, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { snakeCase } from 'lodash-es';
import { WallEntity } from '../../entity/api.entity';
import { saveAs } from 'file-saver';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { DragScrollDirective } from '../../drag-scroll.directive';

interface RouteDataEntity {
  data?: WallEntity;
}

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatTooltipModule,
    MatButtonModule,
    DragScrollDirective
  ]
})
export class ViewComponent implements OnInit {
  data!: WallEntity;
  buttonDisabled = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private snackbar: MatSnackBar,
    private router: Router
  ) { }

  ngOnInit() {
    this.activatedRoute.data.subscribe({
      next: (data: RouteDataEntity) => {
        const item = data.data as WallEntity;
        this.data = item;
      },
    });
  }

  get imageFilename(): string {
    return `${snakeCase(this.data.title)}.png`;
  }

  getImageStyle(): {
    [key: string]: string;
  } {
    return { 'background-image': `url("${this.data.webp_src}")` };
  }

  onClipboard() {
    this.snackbar.open('Parameters copied', 'Ok', { duration: 1000 });
  }

  downloadImage() {
    this.buttonDisabled = true;
    saveAs(this.data.raw_src, this.imageFilename);
    this.buttonDisabled = false;
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEscape() {
    this.router.navigateByUrl("/");
  }
}
