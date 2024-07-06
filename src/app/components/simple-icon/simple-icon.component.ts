import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { SimpleIcon } from 'simple-icons';

@Component({
  selector: 'app-simple-icon',
  templateUrl: './simple-icon.component.html',
  standalone: true,
  imports: [CommonModule],
})
export class SimpleIconComponent implements OnInit {
  @Input() icon!: SimpleIcon;

  constructor(private elementRef: ElementRef) {}


  ngOnInit(): void {
    const nativeElement = this.elementRef.nativeElement;
    nativeElement.innerHTML = this.icon.svg;
    nativeElement.style.fill = `#${this.icon.hex}`;
  }
}
