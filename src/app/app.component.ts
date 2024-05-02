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
  previewCards: any[] = [];

  toggleSelect(index: number): void {
    this.cards[index].selected = !this.cards[index].selected;
    if (this.cards[index].selected) {
      this.selectedCardIndices.push(index);
      this.cloneSelectedCardsToPreview();
    } else {
      const selectedIndex = this.selectedCardIndices.indexOf(index);
      if (selectedIndex !== -1) {
        this.selectedCardIndices.splice(selectedIndex, 1);
        this.removeSelectedCardsFromPreview();
      }
    }
    // Sort selectedCardIndices to ensure they are in ascending order based on their position in the cards array
    this.selectedCardIndices.sort((a, b) => a - b);
  }

  addToPreview(index: number): void {
    this.previewCards.push(this.cards[index]);
  }

  removeFromPreview(index: number): void {
    this.previewCards = this.previewCards.filter(card => card.id !== this.cards[index].id);
  }

  areAnyCardsSelected(): boolean {
    return this.cards.some(card => card.selected);
  }

  isFirstSelected(index: number): boolean {
    return this.selectedCardIndices[0] === index;
  }

  isLastSelected(index: number): boolean {
    return this.selectedCardIndices[this.selectedCardIndices.length - 1] === index;
  }

  onDragStarted(event: CdkDragStart): void {
    this.selectedCardIndices = [parseInt(event.source.data)];
  }

  cloneSelectedCardsToPreview() {
    const previewContainer = document.querySelector('.preview');
    if (previewContainer) {
      previewContainer.innerHTML = ''; // Clear existing preview cards
  
      this.selectedCardIndices.forEach(index => {
        const cardContainer = document.querySelector(`.draggable-container:nth-child(${index + 1})`);
        if (cardContainer) {
          const clonedCardContainer = cardContainer.cloneNode(true) as Element;
          clonedCardContainer.querySelectorAll('.drag-delete-buttons').forEach((el: Element) => el.remove()); // Remove drag-delete buttons
          previewContainer.appendChild(clonedCardContainer);
        }
      });
    }
  }
  
  removeSelectedCardsFromPreview() {
    const previewContainer = document.querySelector('.preview');
    if (previewContainer) {
      this.selectedCardIndices.forEach(index => {
        const previewCard = previewContainer.querySelector(`.draggable-container:nth-child(${index + 1})`);
        if (previewCard) {
          previewCard.remove();
        }
      });
    }
  }

  drop(event: CdkDragDrop<string[]>) {
    // Log the order of the array before moving the cards
    console.log('Array order before moving:', this.cards.map(card => card.id));
  
    // Calculate the delta between the previous and current index to determine the movement distance
    const delta = event.currentIndex - event.previousIndex;
  
    // Move each selected card in the array by the same delta
    this.selectedCardIndices.forEach((index, i) => {
      const newIndex = index + delta;
      // Ensure the new index is within the bounds of the array
      if (newIndex >= 0 && newIndex < this.cards.length) {
        // Update the position of the card in the array
        moveItemInArray(this.cards, index, newIndex);
        // Update the selected card index to reflect the new position
        this.selectedCardIndices[i] = newIndex;
      }
    });
  
    // Log the order of the array after moving the cards
    console.log('Array order after moving:', this.cards.map(card => card.id));
  
    // Clear selected state for all cards
    this.cards.forEach(card => card.selected = false);
    
    // Set selected state only for the dragged cards
    this.selectedCardIndices.forEach(index => {
      this.cards[index].selected = true;
    });
  }
  
  
  
  
}
