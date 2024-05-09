import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CdkDragDrop, CdkDragStart, moveItemInArray } from '@angular/cdk/drag-drop';
import {MatCardModule} from '@angular/material/card';
import { SelectContainerComponent } from 'ngx-drag-to-select';


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

  selectedCardIndices: number[] = [];

  onSelectionChange(selectedItems: Card[]) {
    // Reset all selected states to false
    this.cards.forEach(card => card.selected = false);

    // Clear the selectedCardIndices array
    this.selectedCardIndices = [];

    // Set selected state to true for items that are selected
    selectedItems.forEach((item: Card) => {
        const index = this.cards.findIndex(card => card === item);
        if (index !== -1) {
            const card = this.cards[index];
            card.selected = true;
            this.selectedCardIndices.push(index); // Add index to selectedCardIndices
            // this.cloneSelectedCardsToPreview(); 
        }
    });

    // Sort selectedCardIndices to ensure they are in ascending order based on their position in the cards array
    this.selectedCardIndices.sort((a, b) => a - b);
}

  isFirstSelected(index: number): boolean {
    return this.selectedCardIndices[0] === index;
  }

  isLastSelected(index: number): boolean {
    return this.selectedCardIndices[this.selectedCardIndices.length - 1] === index;
  }


}  