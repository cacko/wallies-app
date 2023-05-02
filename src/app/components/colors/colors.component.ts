import { Component, Input, OnInit } from '@angular/core';
import { MatChipListboxChange } from '@angular/material/chips';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-colors',
  templateUrl: './colors.component.html',
  styleUrls: ['./colors.component.scss'],
})
export class ColorsComponent implements OnInit {
  @Input() colors: string = '';

  items: string[] = [];
  selectedCategories: string[] = [];
  selectedColors: string[] = [];

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.fragment.subscribe({
      next: (data: any) => {
        try {
          const filter = JSON.parse(data);
          this.selectedCategories = filter?.c || [];
          this.selectedColors = filter?.h || [];
        } catch (err) {}
      },
    });
    this.items = this.colors.split(',').map((c) => c.trim());
  }

  getStyle(color: string) {
    return {
      'background-color': `#${color}`,
    };
  }

  onChange(ev: MatChipListboxChange) {
    this.selectedColors = ev.value;
    this.router.navigate([''], {
      fragment: JSON.stringify({
        c: this.selectedCategories,
        h: this.selectedColors,
      }),
    });
  }
}
