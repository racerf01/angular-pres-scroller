import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlideScrollComponent } from './slide-scroll.component';

describe('SlideScrollComponent', () => {
  let component: SlideScrollComponent;
  let fixture: ComponentFixture<SlideScrollComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SlideScrollComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SlideScrollComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
