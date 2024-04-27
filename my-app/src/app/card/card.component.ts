import { Component, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent {
  @Input() card: any;
  @Input() isSelected: boolean = false;
  @Input() isFirstSelected: boolean = false;
  @Input() isLastSelected: boolean = false;
  @Output() cardSelected = new EventEmitter<any>();

  toggleSelect(event: Event): void {
    event.stopPropagation(); // Prevent the event from bubbling up
    this.card.selected = !this.card.selected;
    this.cardSelected.emit(this.card); // Emit the selected card data
  }

  toggleDrag(event: Event): void {
    event.stopPropagation(); // Prevent drag event from bubbling when toggling drag mode
  }
}
