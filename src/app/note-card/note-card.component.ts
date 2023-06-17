import {AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, Renderer2, ViewChild} from '@angular/core';

@Component({
  selector: 'app-note-card',
  templateUrl: './note-card.component.html',
  styleUrls: ['./note-card.component.scss']
})
export class NoteCardComponent implements AfterViewInit {
  @Input() title?: string;
  @Input() body?: string;
  @Input() link?: string;

  @Output('delete') deleteEvent: EventEmitter<void> = new EventEmitter<void>();

  @ViewChild('truncator') truncator?: ElementRef<HTMLElement>;
  @ViewChild('bodyText') bodyText?: ElementRef<HTMLElement>;

  constructor(private renderer: Renderer2) {
  }

  ngAfterViewInit() {
    if(this.truncator && this.bodyText) {
      let style = window.getComputedStyle(this.bodyText.nativeElement);
      let viewableHeight = parseInt(style.getPropertyValue("height"), 10);
      if (this.bodyText.nativeElement.scrollHeight > viewableHeight) {
        console.log(1)
        this.renderer.setStyle(this.truncator.nativeElement, 'display', 'block');
      } else {
        console.log(2)

        this.renderer.setStyle(this.truncator.nativeElement, 'display', 'none');
      }
    }
  }

  onXButtonClick() {
    this.deleteEvent.emit()
  }
}
