import { AfterContentInit, Component, ElementRef, Input } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { MessagePartEntity, EmojiRegex } from 'src/app/entity/chat.entity';

@Component({
  selector: 'app-text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.scss'],
})
export class TextComponent {
  text: string = '';
  isOverflown: boolean = false;
  realign = false;

  public constructor(
    private logger: NGXLogger,
    private elementRef: ElementRef
  ) {}

  @Input() set data(entry: MessagePartEntity) {
    let txt = entry.content;
    this.realign = entry.realign || false;
    if (entry.realign) {
      txt = txt
        .split('\n')
        .map((content) => {
          const spaceInFront = content.startsWith(' ');
          const spaceAtBack = content.endsWith(' ');
          const normalized = content
            .split(' ')
            .filter((t) => t.length)
            .map(
              (t) => `<div ${t.endsWith('"') ? 'cnt="time"' : ''}>${t}</div>`
            )
            .join('');
          if (spaceAtBack === spaceInFront) {
            return `<div pos="center" rep="row">${normalized}</div>`;
          }
          if (spaceAtBack) {
            return `<div pos="left"  rep="row">${normalized}</div>`;
          }
          if (spaceInFront) {
            return `<div pos="right"  rep="row">${normalized}</div>`;
          }
          return `<div pos="left" rep="row">${normalized}</div>`;
        })
        .join('');
    }

    this.text = txt.replace(
      EmojiRegex,
      (match) => `<span class="emoji">${match}</span>`
    );

    setTimeout(
      () =>
        (this.isOverflown =
          this.elementRef.nativeElement.scrollHeight >
          this.elementRef.nativeElement.clientHeight)
    );
  }
}
