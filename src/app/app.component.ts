import { Component, Renderer2, HostListener } from '@angular/core';
import { CdkDragDrop, CdkDragStart } from '@angular/cdk/drag-drop';
import 'smoothscroll-polyfill';

interface Card {
  id: number;
  title: string;
  selected: boolean;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  cards: Card[] = [
    { id: 1, title: "Slide 1", selected: false },
    { id: 2, title: "Slide 2", selected: false },
    { id: 3, title: "Slide 3", selected: false },
    { id: 4, title: "Slide 4", selected: false },
    { id: 5, title: "Slide 5", selected: false },
    { id: 6, title: "Slide 6", selected: false },
    { id: 7, title: "Slide 7", selected: false },
    { id: 8, title: "Slide 8", selected: false },
    { id: 9, title: "Slide 9", selected: false },
    // Add more cards as needed
  ];

  selectMode = false;

  @HostListener('wheel', ['$event']) onMouseWheel(event: WheelEvent) {
    if (event.deltaY !== 0) {
      event.preventDefault();
      this.scrollHorizontally(event.deltaY);
    }
  }

  private scrollHorizontally(deltaY: number) {
    const element = document.querySelector('html'); // Select scrollable element by class or id
    if (element) {
      element.scrollBy({
        left: deltaY,
        behavior: 'smooth'
      });
    }
  }

  selectedCardIndices: number[] = [];
  firstSelectedIndex: number = -1;
  lastSelectedIndex: number = -1;

  onSelectionChange(selectedItems: Card[]) {
    this.selectedCardIndices = [];
    this.firstSelectedIndex = -1;
    this.lastSelectedIndex = -1;

    // Preserve the selection state of previously selected cards
    const previouslySelectedIndices = this.selectedCardIndices.slice();

    // Clear the selectedCardIndices array
    this.selectedCardIndices = [];

    this.updateSelectedCardIndices(selectedItems);

    // Set selected state to true for items that are selected
    selectedItems.forEach((item: Card, index: number) => {
      const cardIndex = this.cards.findIndex(card => card === item);
      if (cardIndex !== -1) {
        this.selectedCardIndices.push(cardIndex);
        this.cards[cardIndex].selected = true;
      }
    });

    // Update first and last selected indices
    if (this.selectedCardIndices.length > 0) {
      this.firstSelectedIndex = Math.min(...this.selectedCardIndices);
      this.lastSelectedIndex = Math.max(...this.selectedCardIndices);
    }

    // Remove deselected cards from the preview
    this.removeSelectedCardsFromPreview();

    // Clone selected cards to the preview
    this.cloneSelectedCardsToPreview();

    // Update selectMode based on the number of selected items
    this.selectMode = selectedItems.length > 1;

    // Preserve the selection state of previously selected cards only if more than one card is selected
    if (selectedItems.length > 1) {
        previouslySelectedIndices.forEach(index => {
            if (!this.selectedCardIndices.includes(index)) {
                this.cards[index].selected = true;
                this.selectedCardIndices.push(index);
            }
        });
    }

    // Sort selectedCardIndices to ensure they are in ascending order based on their position in the cards array
    this.selectedCardIndices.sort((a, b) => a - b);

  }

  updateSelectedCardIndices(selectedItems: Card[]) {
    this.selectedCardIndices = [];
    selectedItems.forEach((item: Card) => {
      const index = this.cards.findIndex(card => card === item);
      if (index !== -1) {
        this.selectedCardIndices.push(index);
      }
    });
  }

  isFirstSelected(index: number): boolean {
    return index === this.firstSelectedIndex;
  }

  isLastSelected(index: number): boolean {
    return index === this.lastSelectedIndex;
  }

  deleteSelectedCards() {
    console.log('Deleting selected cards'); // Log deletion action

    // Remove selected cards from the array
    this.selectedCardIndices.sort((a, b) => b - a); // Sort indices in descending order to prevent index shifting
    this.selectedCardIndices.forEach(index => {
      this.cards.splice(index, 1);
    });

    // Clear selected indices array and update preview
    this.selectedCardIndices = [];
    // this.removeSelectedCardsFromPreview();
  }

  areAnyCardsSelected(): boolean {
    return this.cards.some(card => card.selected);
  }

  shouldDisplayButtonUnderFirstCard(): boolean {
    // Check if any cards are selected
    if (this.areAnyCardsSelected()) {
      // Check if the first selected card index is equal to the current index
      return this.selectedCardIndices[0] === 0;
    }
    return false;
  }

  cloneSelectedCardsToPreview() {
    try {
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
    } catch (error) {
      console.error('Error:', error);
    }
  }

  removeSelectedCardsFromPreview() {
    const previewContainer = document.querySelector('.preview');
    if (previewContainer) {
      this.selectedCardIndices.forEach(index => {
        const previewCard = previewContainer.querySelector(`.card-preview:nth-child(${index + 1})`);
        if (previewCard) {
          previewCard.remove();
        }
      });
    }
  }

  constructor(private renderer: Renderer2) {}

  onDragStarted(event: CdkDragStart) {
    this.selectedCardIndices.forEach(index => {
      const cardElement = document.querySelector(`.draggable-container:nth-child(${index + 1}) .card`) as HTMLElement;
      if (cardElement) {
        this.renderer.addClass(cardElement, 'selected-card-dragging');
        const deleteButton = cardElement.querySelector('.deleteButton') as HTMLElement;
        if (deleteButton) {
          this.renderer.addClass(deleteButton, 'hide-delete-button');
        }
      }
    });
  }

  onDragEnded() {
    const selectedCardElements = document.querySelectorAll('.selected-card-dragging');
    selectedCardElements.forEach(element => {
      const cardElement = element as HTMLElement;
      this.renderer.removeClass(cardElement, 'selected-card-dragging');
      const deleteButton = cardElement.querySelector('.deleteButton') as HTMLElement;
      if (deleteButton) {
        this.renderer.removeClass(deleteButton, 'hide-delete-button');
      }
    });
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousIndex !== event.currentIndex) {
      console.log('Array order before moving:', this.cards.map(card => card.id));

      // Create a copy of the selected cards
      const selectedCards = this.selectedCardIndices.map(index => this.cards[index]);

      // Remove the selected cards from the original array
      this.selectedCardIndices.sort((a, b) => b - a); // Sort in descending order to prevent index shifting
      this.selectedCardIndices.forEach(index => this.cards.splice(index, 1));

      // Calculate the adjusted drop position
      const dropPosition = event.currentIndex < event.previousIndex ? event.currentIndex : event.currentIndex + 1 - selectedCards.length;

      // Insert the selected cards at the new location
      this.cards.splice(dropPosition, 0, ...selectedCards);

      // Update the selectedCardIndices array to reflect the new positions of the selected cards
      this.selectedCardIndices = Array.from({ length: selectedCards.length }, (_, i) => dropPosition + i);

      console.log('Array order after moving:', this.cards.map(card => card.id));

      // Clear selected state for all cards
      this.cards.forEach(card => card.selected = false);

      // Set selected state only for the dragged cards
      this.selectedCardIndices.forEach(index => {
        this.cards[index].selected = true;
      }); 
    }
  }

  addMoreCards() {
    this.cards.push(
      { id: this.cards.length + 1, title: "New Slide", selected: false },
      // Add more cards as needed
    );
  }
}