import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent {
  @Input() card: any;
  @Input() isFirstSelected!: Function;
  @Input() isLastSelected!: Function;
  @Output() toggle = new EventEmitter<number>();

  toggleSelect(event: Event): void {
    event.stopPropagation(); // Prevent event bubbling
    this.toggle.emit(); // Emit toggle event
  }
}


