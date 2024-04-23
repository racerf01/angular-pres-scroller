import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-slide-scroll',
  standalone: true,
  imports: [],
  templateUrl: './slide-scroll.component.html',
  styleUrl: './slide-scroll.component.css'
})
export class SlideScrollComponent {
  @Input() index!: number;
  isSelected: boolean = false;

  toggleSelection() {
    this.isSelected = !this.isSelected;
  }
}
