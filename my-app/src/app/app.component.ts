import { Component } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

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
    { title: 'Card 4', content: 'Content for card 3', selected: false },
    // Add more cards as needed
  ];

  selectedCardIndices: number[] = [];

  
  toggleSelect(index: number): void {
    this.cards[index].selected = !this.cards[index].selected;
    if (this.cards[index].selected) {
      this.selectedCardIndices.push(index); // Add index to selected indices if selected
    } else {
      const selectedIndex = this.selectedCardIndices.indexOf(index);
      if (selectedIndex !== -1) {
        this.selectedCardIndices.splice(selectedIndex, 1); // Remove index from selected indices if deselected
      }
    }
  }

  isSelected(index: number): boolean {
    return this.selectedCardIndices.includes(index);
  }
}






