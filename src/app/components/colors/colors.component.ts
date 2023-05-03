import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatChipListboxChange } from '@angular/material/chips';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-colors',
  templateUrl: './colors.component.html',
  styleUrls: ['./colors.component.scss'],
})
export class ColorsComponent implements OnInit {
  @Input() colors: string = '';
  @Output() selected = new EventEmitter<string[]>();

  items: string[] = [];
  selectedCategories: string[] = [];
  selectedColors: string[] = [];
  customColors: string[] = [];

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.fragment.subscribe({
      next: (data: any) => {
        try {
          const filter = JSON.parse(data);
          this.selectedCategories = filter?.c || [];
          this.selectedColors = filter?.h || [];
          this.selectedColors
            .filter((sc) => !this.items.includes(sc))
            .forEach((sc) => this.customColors.push(sc) && this.items.push(sc));
          this.customColors
            .filter((cc) => !this.selectedColors.includes(cc))
            .forEach(
              (cc) =>
                this.items.splice(this.items.indexOf(cc), 1) &&
                this.customColors.splice(this.customColors.indexOf(cc), 1)
            );
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
    this.selected.emit(this.selectedColors);
    this.router.navigate([''], {
      fragment: JSON.stringify({
        c: this.selectedCategories,
        h: this.selectedColors,
      }),
    });
  }
}
