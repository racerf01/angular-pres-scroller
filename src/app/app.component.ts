import { Component, ViewChild, ElementRef, AfterViewInit, Renderer2, HostListener } from '@angular/core';
import { CdkDragDrop, CdkDragStart, CdkDragEnd, moveItemInArray } from '@angular/cdk/drag-drop';
import {MatCardModule} from '@angular/material/card';
import { SelectContainerComponent } from 'ngx-drag-to-select';
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

  //////////////////////////////////////////////////////////////////////////////////////////////

  @HostListener('wheel', ['$event']) onMouseWheel(event: WheelEvent) {
    // console.log('Mouse wheel event:', event);

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

///////////////////////////////////////////////////////////////////
  selectedCardIndices: number[] = [];

  onSelectionChange(selectedItems: Card[]) {
    // Preserve the selection state of previously selected cards
    const previouslySelectedIndices = this.selectedCardIndices.slice();

    // Clear the selectedCardIndices array
    this.selectedCardIndices = [];

    // Set selected state to true for items that are selected
    selectedItems.forEach((item: Card) => {
        const index = this.cards.findIndex(card => card === item);
        if (index !== -1) {
            const card = this.cards[index];
            card.selected = true;
            if (!this.selectedCardIndices.includes(index)) {
                this.selectedCardIndices.push(index); // Add index to selectedCardIndices if not already present
            }
        }
    });

    // Remove deselected cards from the preview
    this.removeSelectedCardsFromPreview();

    // Clone selected cards to the preview
    this.cloneSelectedCardsToPreview();

    // Preserve the selection state of previously selected cards only if more than one card is selected
    if (selectedItems.length > 1) {
        previouslySelectedIndices.forEach(index => {
            if (!this.selectedCardIndices.includes(index)) {
                // The card was previously selected but is not selected anymore
                this.cards[index].selected = true;
                this.selectedCardIndices.push(index);
            }
        });
    }

    // Sort selectedCardIndices to ensure they are in ascending order based on their position in the cards array
    this.selectedCardIndices.sort((a, b) => a - b);
}






  isFirstSelected(index: number): boolean {
    return this.selectedCardIndices[0] === index;
  }

  isLastSelected(index: number): boolean {
    return this.selectedCardIndices[this.selectedCardIndices.length - 1] === index;
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

  /////////////////////////////////////////////////////////////////////////////////////////////

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

  /////////////////////////////////////////////////////////////////////////////////

  constructor(private renderer: Renderer2) {}

  onDragStarted(event: CdkDragStart) {
    // Set the opacity of selected cards to 0 during drag
    this.selectedCardIndices.forEach(index => {
      const cardElement = document.querySelector(`.draggable-container:nth-child(${index + 1}) .card`);
      if (cardElement) {
        this.renderer.addClass(cardElement, 'selected-card-dragging');
        
        // Hide the delete button when dragging starts
        const deleteButton = cardElement.querySelector('.deleteButton');
        if (deleteButton) {
          this.renderer.addClass(deleteButton, 'hide-delete-button');
        }
      }
    });
  }
  
  onDragEnded() {
    // Remove the opacity style and show the delete button when drag ends
    const selectedCardElements = document.querySelectorAll('.selected-card-dragging');
    selectedCardElements.forEach(element => {
      this.renderer.removeClass(element, 'selected-card-dragging');
      
      // Show the delete button
      const deleteButton = element.querySelector('.deleteButton');
      if (deleteButton) {
        this.renderer.removeClass(deleteButton, 'hide-delete-button');
      }
    });
  }
  

/////////////////////////////////////////////////////////////////////////////////////////// 

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



  ///////////////////////////////////////////////

  addMoreCards() {
    // Add logic to add more cards here
    // For example, you can push new card objects into the cards array
    this.cards.push(
      { id: this.cards.length + 1, title: "New Slide", selected: false },
      // Add more cards as needed
    );
  }
}