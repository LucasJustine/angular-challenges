import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-subscription',
  imports: [AsyncPipe],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <div>TestId: {{ testId }}</div>
    <div>Permission: {{ permission }}</div>
    <div>User: {{ user }}</div>
  `,
})
export default class TestComponent {
  private activatedRoute = inject(ActivatedRoute);

  @Input() testId!: string;
  @Input() permission!: string;
  @Input() user!: string;
}
