import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NavButtonComponent } from './nav-button.component';
import { ScrollService } from './scroll.service';

@Component({
  imports: [NavButtonComponent],
  selector: 'app-home',
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <nav-button href="/foo" class="fixed top-3 left-1/2">Foo Page</nav-button>
    <div id="top" class="h-screen bg-gray-500">
      Empty
      <nav-button (click)="scrollService.scrollTo('bottom')">
        Scroll Bottom
      </nav-button>
    </div>
    <div id="bottom" class="h-screen bg-blue-300">
      I want to scroll each
      <nav-button (click)="scrollService.scrollTo('top')">
        Scroll Top
      </nav-button>
    </div>
  `,
})
export class HomeComponent {
  scrollService = inject(ScrollService);
}
