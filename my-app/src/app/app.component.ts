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
    // Add more cards as needed
  ];

  selectedCardIndices: number[] = [];

  addCard(): void {
    const nextCardNum = this.cards.length + 1;
    this.cards.push({ title: `Card ${nextCardNum}`, content: `Content for card ${nextCardNum}`, selected: false });
  }

  deleteSelectedCards(): void {
    this.selectedCardIndices.sort((a, b) => b - a); // Sort indices in descending order
    this.selectedCardIndices.forEach(index => {
      this.cards.splice(index, 1); // Remove the card at each index
    });
    this.selectedCardIndices = []; // Clear selected indices after deletion
  }

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
  
  handleDrag(event: any): void {
    // Implement your drag handling logic here
    console.log('Drag event handled', event);
  }
  

  isFirstSelectedCard(index: number): boolean {
    return this.isSelected(index) && this.selectedCardIndices[0] === index;
  }

  isLastSelectedCard(index: number): boolean {
    return this.isSelected(index) && this.selectedCardIndices[this.selectedCardIndices.length - 1] === index;
  }

  drop(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.cards, event.previousIndex, event.currentIndex);
  }
}






