import { Component } from '@angular/core';
import { CdkDragDrop, CdkDragStart, moveItemInArray } from '@angular/cdk/drag-drop';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  cards = [
    { id: 1, selected: false },
    { id: 2, selected: false },
    { id: 3, selected: false },
    { id: 4, selected: false },
    { id: 5, selected: false },
    { id: 6, selected: false },
    { id: 7, selected: false },
    { id: 8, selected: false },
    { id: 9, selected: false },
    // Add more cards as needed
  ];

  selectedCardIndices: number[] = [];
  isDraggableContainerEnabled = false;
  
  toggleSelect(index: number): void {
    this.cards[index].selected = !this.cards[index].selected;
    if (this.cards[index].selected) {
      this.selectedCardIndices.push(index);
    } else {
      const selectedIndex = this.selectedCardIndices.indexOf(index);
      if (selectedIndex !== -1) {
        this.selectedCardIndices.splice(selectedIndex, 1);
      }
    }
    // Sort selectedCardIndices to ensure they are in ascending order based on their position in the cards array
    this.selectedCardIndices.sort((a, b) => a - b);
  }
  areAnyCardsSelected(): boolean {
    return this.cards.some(card => card.selected);
  }

  isFirstSelected(index: number): boolean {
    // Check if this card is the first in the sorted list of selected indices
    return this.selectedCardIndices[0] === index;
  }

  isLastSelected(index: number): boolean {
    // Check if this card is the last in the sorted list of selected indices
    return this.selectedCardIndices[this.selectedCardIndices.length - 1] === index;
  }

  onDragStarted(event: CdkDragStart): void {
    // Ensure only one item is dragged at a time
    this.selectedCardIndices = [parseInt(event.source.data)];
  }













  drop(event: CdkDragDrop<string[]>) {
    // Reorder the cards array
    moveItemInArray(this.cards, event.previousIndex, event.currentIndex);
  
    // Update selectedCardIndices to reflect the new order of selected cards
    this.selectedCardIndices = this.selectedCardIndices.map(index =>
      index === event.previousIndex
        ? event.currentIndex
        : index > event.previousIndex && index <= event.currentIndex
        ? index - 1
        : index < event.previousIndex && index >= event.currentIndex
        ? index + 1
        : index
    );
  }
  
  
}
