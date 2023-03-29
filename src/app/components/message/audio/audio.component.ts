import { Component, Input } from '@angular/core';
import { MessagePartEntity } from 'src/app/entity/chat.entity';

@Component({
  selector: 'app-audio',
  templateUrl: './audio.component.html',
  styleUrls: ['./audio.component.scss']
})
export class AudioComponent {

  @Input() data!: MessagePartEntity;

}
