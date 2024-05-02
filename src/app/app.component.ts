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
    moveItemInArray(this.cards, event.previousIndex, event.currentIndex);
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
