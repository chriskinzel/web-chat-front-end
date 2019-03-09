import {ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, NgZone, Output, ViewChild} from '@angular/core';
import {faArrowCircleUp} from '@fortawesome/free-solid-svg-icons/faArrowCircleUp';

@Component({
  selector: 'chat-input',
  templateUrl: './chat-input.component.html',
  styleUrls: ['./chat-input.component.css']
})
export class ChatInputComponent {
  @Input() placeholder: string;
  @Input() disabled = false;

  @Output() message = new EventEmitter<string>();

  public readonly faArrowCircleUp = faArrowCircleUp;

  @ViewChild('input') textboxElementRef: ElementRef;

  private messageHistory: string[] = [''];
  private historyPointer = -1;

  constructor(private changeDetector: ChangeDetectorRef,
              private ngZone: NgZone) {}

  public emitMessage(event?: Event) {
    if (event) {
      event.preventDefault();
    }

    this.messageHistory.push(this.textbox.innerText);
    this.historyPointer = -1;

    this.message.emit(this.textbox.innerText.trim());
    this.textbox.innerText = '';
  }

  public onBlur() {
    this.textbox.innerText = this.textbox.innerText.trim();
    this.changeDetector.detectChanges();
  }

  public previousMessage() {
    if (this.messageHistory.length >= 1) {
      this.historyPointer = Math.min(this.historyPointer + 1, this.messageHistory.length - 1);
      const historyIndex = this.messageHistory.length - this.historyPointer - 1;

      this.textbox.innerText = this.messageHistory[historyIndex];

      this.ngZone.runOutsideAngular(() => {
        setTimeout(() => {
          this.placeCaretAtEnd();
        }, 0);
      });
    }
  }

  public advanceMessage() {
    if (this.messageHistory.length >= 1) {
      this.historyPointer = Math.max(this.historyPointer - 1, -1);
      const historyIndex = this.messageHistory.length - this.historyPointer - 1;

      if (this.historyPointer === -1) {
        this.textbox.innerText = '';
      } else {
        this.textbox.innerText = this.messageHistory[historyIndex];
      }

      this.ngZone.runOutsideAngular(() => {
        setTimeout(() => {
          this.placeCaretAtEnd();
        }, 0);
      });
    }
  }

  public get isMultilineText(): boolean {
    return /[\r\n]/g.test(this.textbox.innerText) && this.textbox.innerText.length > 1;
  }

  /**
   * Code from https://stackoverflow.com/questions/4233265/contenteditable-set-caret-at-the-end-of-the-text-cross-browser
   */
  private placeCaretAtEnd() {
    this.textbox.focus();
    if (typeof window.getSelection !== 'undefined'
      && typeof document.createRange !== 'undefined') {
      const range = document.createRange();
      range.selectNodeContents(this.textbox);
      range.collapse(false);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    } else if (typeof (document.body as any).createTextRange !== 'undefined') {
      const textRange = (document.body as any).createTextRange();
      textRange.moveToElementText(this.textbox);
      textRange.collapse(false);
      textRange.select();

    }
  }

  private get textbox(): HTMLElement {
    return this.textboxElementRef.nativeElement;
  }
}
