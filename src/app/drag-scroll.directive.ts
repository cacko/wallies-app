import { CommonModule, DOCUMENT } from "@angular/common";
import {
  AfterViewInit,
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  Inject,
  Input,
  OnDestroy,
  Renderer2,
} from "@angular/core";
import { cloneWith } from "lodash-es";
import { fromEvent, Subscription } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Directive({
  selector: '[appDragScroll]',
  standalone: true
})
export class DragScrollDirective implements AfterViewInit, OnDestroy {

  private element !: HTMLImageElement;
  private subscriptions: Subscription[] = [];

  private readonly DEFAULT_DRAGGING_BOUNDARY_QUERY = "body";
  @Input() boundaryQuery = this.DEFAULT_DRAGGING_BOUNDARY_QUERY;

  constructor(
    @Inject(ElementRef) private elementRef: ElementRef,
    @Inject(Renderer2) private renderer: Renderer2,
    @Inject(DOCUMENT) private document: any
  ) { }

  ngAfterViewInit(): void {
    this.element = this.elementRef.nativeElement as HTMLImageElement;
  }

  @HostListener('window:resize')
  onResize() {
    this.ngOnDestroy();
    this.initDrag();
  }


  @HostListener('load')
  onLoad() {
    this.initDrag();
  }

  @Input() set reset(realSize: boolean | null) {
    if (!this.element) {
      return;
    }
    realSize && this.renderer.setStyle(this.element, "object-position", "center center");
  }

  initDrag(): void {
    const dragStart$ = fromEvent<any>(this.element, "mousedown", { passive: true });
    const dragEnd$ = fromEvent<any>(this.document, "mouseup", { passive: true });
    const drag$ = fromEvent<any>(this.document, "mousemove", { passive: true }).pipe(
      takeUntil(dragEnd$)
    );


    let initialX: number,
      initialY: number,
      parent = this.element.parentElement,
      parentHeight = parent?.clientHeight || 1,
      parentWidth = parent?.clientWidth || 1,
      aspectRatio = this.element.naturalWidth / this.element.naturalHeight,
      clientRatio = parentWidth / parentHeight,
      isScrollX = aspectRatio > clientRatio,
      isScrollY = aspectRatio < clientRatio,
      currentX = -(parentHeight * aspectRatio - this.element.clientWidth) / 2,
      currentY = -(parentWidth / aspectRatio - this.element.clientHeight) / 2;


    const maxX = parentWidth - this.element.clientWidth,
      maxY = parentHeight - this.element.clientHeight;

    let dragSub !: Subscription;

    const getClientX = (event: MouseEvent) => {
      event.stopPropagation();
      return event.clientX;
    }

    const getClientY = (event: any) => {
      event.stopPropagation();
      return event.clientY;
    }

    const dragStartSub = dragStart$.subscribe((event: MouseEvent) => {

      initialX = getClientX(event) - currentX;
      initialY = getClientY(event) - currentY;

      this.renderer.addClass(this.element, "dragging");

      dragSub = drag$.subscribe((event: any) => {

        if (isScrollX) {
          const x = Math.min(0, Math.max(getClientX(event) - initialX, maxX));
          currentX = x;
          return this.renderer.setStyle(this.element, "object-position", `${x}px center`);
        }

        if (isScrollY) {
          const y = Math.min(0, Math.max(getClientY(event) - initialY, maxY));
          currentY = y;
          return this.renderer.setStyle(this.element, "object-position", `center ${y}px`);
        }
        return;
      });
    });

    const dragEndSub = dragEnd$.subscribe(() => {
      initialX = currentX;
      initialY = currentY;
      this.renderer.removeClass(this.element, "dragging");
      if (dragSub) {
        dragSub.unsubscribe();
      }
    });

    this.subscriptions.push.apply(this.subscriptions, [
      dragStartSub,
      dragSub,
      dragEndSub,
    ]);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s?.unsubscribe());
  }


}
