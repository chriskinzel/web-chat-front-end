import {Component, ElementRef, EventEmitter, Output, ViewChild} from '@angular/core';
import {faArrowCircleUp} from '@fortawesome/free-solid-svg-icons/faArrowCircleUp';

@Component({
  selector: 'chat-input',
  templateUrl: './chat-input.component.html',
  styleUrls: ['./chat-input.component.css']
})
export class ChatInputComponent {
  @Output() message = new EventEmitter<string>();

  public readonly faArrowCircleUp = faArrowCircleUp;

  @ViewChild('input') textboxElementRef: ElementRef;

  public emitMessage(event?: Event) {
    if (event) {
      event.preventDefault();
    }
    this.message.emit(this.textbox.innerText.trim());
    this.textbox.innerText = '';
  }

  public get isMultilineText(): boolean {
    return /[\r\n]/g.test(this.textbox.innerText) && this.textbox.innerText.length > 1;
  }

  private get textbox(): HTMLElement {
    return this.textboxElementRef.nativeElement;
  }
}
