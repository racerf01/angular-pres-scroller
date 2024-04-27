import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  cards = [
    { title: 'Card 1', content: 'Content for card 1', selected: false },
    { title: 'Card 2', content: 'Content for card 2', selected: false },
    { title: 'Card 3', content: 'Content for card 3', selected: false },
    { title: 'Card 4', content: 'Content for card 4', selected: false },
    // Add more cards as needed
  ];

  selectedCardIndices: number[] = [];

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

  isFirstSelected(index: number): boolean {
    // Check if this card is the first in the sorted list of selected indices
    return this.selectedCardIndices[0] === index;
  }

  isLastSelected(index: number): boolean {
    // Check if this card is the last in the sorted list of selected indices
    return this.selectedCardIndices[this.selectedCardIndices.length - 1] === index;
  }
}
