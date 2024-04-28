import { Component } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ChangeDetectorRef } from '@angular/core';
import { trigger, transition, style, animate, query, stagger, animateChild } from '@angular/animations';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
animations: [
  trigger('cardAnimation', [
    transition('* => *', [ // each time the binding value changes
      query(':leave', [
        stagger(100, [
          animate('0.5s', style({ opacity: 0 }))
        ])
      ], { optional: true }),
      query(':enter', [
        style({ opacity: 0 }),
        stagger(100, [
          animate('0.5s', style({ opacity: 1 }))
        ])
      ], { optional: true })
    ])
  ])
]
})
export class AppComponent {
  cards = [
    { title: 'Card 1', content: 'Content for card 1', selected: false },
    { title: 'Card 2', content: 'Content for card 2', selected: false },
    { title: 'Card 3', content: 'Content for card 3', selected: false },
    { title: 'Card 4', content: 'Content for card 4', selected: false },
    // Add more cards as needed
  ];

  constructor(private cdr: ChangeDetectorRef) {}
  selectedCardIndices: number[] = [];

  toggleSelect(index: number): void {
    console.log('Toggling selection for index:', index);
    this.cards[index].selected = !this.cards[index].selected;
    console.log(`Card at index ${index} selected:`, this.cards[index].selected);
  
    if (this.cards[index].selected) {
      this.selectedCardIndices.push(index);
    } else {
      const selectedIndex = this.selectedCardIndices.indexOf(index);
      if (selectedIndex !== -1) {
        this.selectedCardIndices.splice(selectedIndex, 1);
      }
    }
    console.log('Current selected card indices:', this.selectedCardIndices);
  }  

  isFirstSelected(index: number): boolean {
    // Check if this card is the first in the sorted list of selected indices
    return this.selectedCardIndices[0] === index;
  }

  isLastSelected(index: number): boolean {
    // Check if this card is the last in the sorted list of selected indices
    return this.selectedCardIndices[this.selectedCardIndices.length - 1] === index;
  }

  deleteSelectedCards(): void {
    console.log('Deleting selected cards', this.selectedCardIndices);
    this.cards = this.cards.filter((_, index) => !this.selectedCardIndices.includes(index));
    this.selectedCardIndices = [];
    console.log('Remaining cards:', this.cards);
  }

  drop(event: CdkDragDrop<{ title: string; content: string; selected: boolean }[]>): void {
    console.log('Dragged from index', event.previousIndex, 'to index', event.currentIndex);
    console.log('Cards before move:', JSON.stringify(this.cards));
    
    if (event.previousContainer === event.container) {
      moveItemInArray(this.cards, event.previousIndex, event.currentIndex);
      console.log('Cards after move:', JSON.stringify(this.cards));
    } else {
      console.log('Attempted to drag between different containers');
    }
    
    // This might be useful if there are other manipulations or checks you want to perform
    console.log('Updated cards array:', this.cards);
  }
  
}