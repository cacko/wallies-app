import { NgOptimizedImage } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { User } from "@angular/fire/auth";
import { MatRippleModule } from '@angular/material/core';

interface ImageStyle {
  [key: string]: string
}


@Component({
    selector: 'app-avatar',
    templateUrl: './avatar.component.html',
    standalone: true,
    imports: [
    NgOptimizedImage,
    MatRippleModule
]
})
export class AvatarComponent  implements OnInit {
  @Input() user !: User;

  imageStyle: ImageStyle = {};

  constructor() { }

  ngOnInit(): void {

  }

}
