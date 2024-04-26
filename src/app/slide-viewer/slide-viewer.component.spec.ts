import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlideViewerComponent } from './slide-viewer.component';

describe('SlideViewerComponent', () => {
  let component: SlideViewerComponent;
  let fixture: ComponentFixture<SlideViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SlideViewerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SlideViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
