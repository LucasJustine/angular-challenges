import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HeavyComputationPipe } from './pipe/heavy-computation.pipe';
@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    @for (person of persons; track person) {
      {{ person | heavyComputation: $index }}
    }
  `,
  imports: [HeavyComputationPipe],
})
export class AppComponent {
  persons = ['toto', 'jack'];
}
