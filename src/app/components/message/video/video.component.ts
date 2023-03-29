import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { fromEvent } from 'rxjs';
import { MessagePartEntity } from 'src/app/entity/chat.entity';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss'],
})
export class VideoComponent implements AfterViewInit {
  public playing = false;
  @Output() layout = new EventEmitter<boolean>();

  ngAfterViewInit(): void {
    const videoEl = this.video?.nativeElement;
    fromEvent(videoEl, 'loadedmetadata').subscribe((_) =>
      this.layout.emit(true)
    );
    videoEl.addEventListener('play', (event: any) => {
      this.playing = true;
    });
    videoEl.addEventListener('ended', (event: any) => {
      this.playing = false;
    });
    videoEl.addEventListener('pause', (event: any) => {
      this.playing = false;
    });
  }

  @Input() data!: MessagePartEntity;
  @ViewChild('video', { static: false }) video: ElementRef | undefined;
}
