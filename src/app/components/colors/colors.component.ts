import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatButtonToggleChange, MatButtonToggleModule } from '@angular/material/button-toggle';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../..//service/api.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { ColorsService } from '../../service/colors.service';

@Component({
  selector: 'app-colors',
  templateUrl: './colors.component.html',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatRippleModule
  ]
})
export class ColorsComponent implements OnInit {
  @Input() vertical: boolean = false;
  @Output() selected = new EventEmitter<string[]>();

  items: string[] = [];
  selectedCategories: string[] = [];
  selectedColors: string[] = [];
  customColors: string[] = [];
  colors?: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private colorService: ColorsService
  ) {

  }

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
        } catch (err) { }
      },
    });
    this.colorService.$colors.subscribe((colors) => {
      this.items = (this.colorService.colors || '').split(',').map((c) => c.trim());
      console.log(this.items);
    })

  }

  getStyle(color: string) {
    return {
      'background-color': `#${color}`,
    };
  }

  onChange(ev: MatButtonToggleChange) {
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
