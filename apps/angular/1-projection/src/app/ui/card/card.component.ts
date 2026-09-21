import { NgTemplateOutlet } from '@angular/common';
import { Component, contentChild, input, output } from '@angular/core';
import { ListItemComponent } from '../list-item/list-item.component';
import { CardContentChildDirective } from './card-content-child.directive';

@Component({
  selector: 'app-card',
  template: `
    <div
      class="flex w-fit flex-col gap-3 rounded-md border-2 border-black p-4"
      [class]="customClass()">
      <ng-content />
      <section>
        @for (item of list(); track item) {
          <ng-template #defaultOption>
            <app-list-item
              [name]="item.firstName"
              [id]="item.id"></app-list-item>
          </ng-template>

          <ng-container
            *ngTemplateOutlet="
              templateRef()?.template || defaultOption;
              context: { $implicit: item }
            "></ng-container>
        }
      </section>

      <button
        class="rounded-sm border border-blue-500 bg-blue-300 p-2"
        (click)="addNewItem()">
        Add
      </button>
    </div>
  `,
  imports: [ListItemComponent, NgTemplateOutlet],
})
export class CardComponent {
  readonly list = input<any[] | null>(null);
  readonly customClass = input('');
  public templateRef = contentChild(CardContentChildDirective);

  onAddNewItem = output<void>();

  addNewItem() {
    this.onAddNewItem.emit();
  }
}
