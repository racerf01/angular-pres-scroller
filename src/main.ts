import { bootstrapApplication } from '@angular/platform-browser';
import { SlideComponent } from './app/slide/slide.component';

bootstrapApplication(SlideComponent)
  .catch((err) => console.error(err));
