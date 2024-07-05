import { AfterViewInit, Component, ElementRef, inject, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../service/user.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ArtworksService } from '../../service/artworks.service';
import { WallEntity } from '../../entity/api.entity';
import { hex2rgb } from '../../entity/colors';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule
  ]
})
export class LoginComponent implements OnInit, AfterViewInit {

  private redirectTo: string = "/";

  constructor(
    private artworks: ArtworksService,
    public user: UserService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private element: ElementRef = inject(ElementRef),
    private renderer: Renderer2 = inject(Renderer2)
  ) { }



  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((qp: any) => {
      this.redirectTo = qp.redirectTo || "/";
      this.artworks.fetch(1, -1).subscribe((res: WallEntity[]) => {
        const img = res.pop();
        const colors = (img?.colors.split(",") || ["#000", "#000", "#000"]).map(c1 => hex2rgb(c1));
        const bgStyle = `linear-gradient(rgba(${colors[0].join(",")}, 0.2), rgb(${colors[1].join(",")}), rgba(${colors[2].join(",")}, 0.2))`;
        img && this.renderer.setStyle(
          this.element.nativeElement,
          "background-image",
          `url(${img.webp_src}),${bgStyle}`
        );
      });

    });
  }

  ngAfterViewInit(): void {

  }


  login_google() {
    this.user.googeLogin().then((r) => this.router.navigateByUrl(this.redirectTo)
    ).catch((err) => this.router.navigateByUrl(window.location.href));
  }


  login_anon() {
    this.user.login_anon().then((r) => this.router.navigateByUrl(this.redirectTo)).catch((err) => this.router.navigateByUrl(window.location.href));
  }

  logout() {
    this.user.logout().then((r) => this.router.navigateByUrl("/login"));
  }
}