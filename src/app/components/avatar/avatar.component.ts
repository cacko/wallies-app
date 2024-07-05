import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { User } from "@angular/fire/auth";
import { MatRippleModule } from '@angular/material/core';
// import multiavatar from "@multiavatar/multiavatar";
// import md5 from 'md5';
// const b64encode = window.btoa;

interface ImageStyle {
  [key: string]: string
}


@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  standalone: true,
  imports: [
    CommonModule,
    NgOptimizedImage,
    MatRippleModule
  ],
})
export class AvatarComponent  {
  @Input() user !: User;

  imageStyle: ImageStyle = {};

  constructor() { }

  ngOnInit(): void {
    // this.imageStyle = { "background-image": `url(${this.getMultiavatar()})` };
    // const canvas = document.createElement('canvas');
    // const image = new Image();
    // image.setAttribute("crossorigin", "anonymous");
    // image.src = this.user?.photoURL || "";
    // image.addEventListener("load", () => {
    //   canvas.width = image.naturalWidth;
    //   canvas.height = image.naturalHeight;
    //   canvas.getContext('2d')?.drawImage(image, 0, 0);
    //   const data64 = canvas.toDataURL("image/jpeg", 0.9);
    //   this.imageStyle = { "background-image": `url(${data64})` };
    // });
  }

  // getMultiavatar(): string {
  //   const key = md5(`${this.user?.email}${this.user?.uid}`);
  //   let avatar = localStorage.getItem(`avatar-${key}`);
  //   if (!avatar) {
  //     const svg = multiavatar(key);
  //     avatar = `data:image/svg+xml;base64,${b64encode(svg)}`;
  //     localStorage.setItem(key, avatar);
  //   }
  //   return avatar || "";
  // }
}
