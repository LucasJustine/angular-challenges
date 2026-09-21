import { NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { CityStore } from '../../data-access/city.store';
import {
  FakeHttpService,
  randomCity,
} from '../../data-access/fake-http.service';
import { CardContentChildDirective } from '../../ui/card/card-content-child.directive';
import { CardComponent } from '../../ui/card/card.component';
import { ListItemComponent } from '../../ui/list-item/list-item.component';

@Component({
  selector: 'app-city-card',
  template: `
    <app-card
      [list]="cities()"
      customClass="bg-light-blue"
      (onAddNewItem)="onAddNewCity()">
      <img ngSrc="assets/img/city.png" width="200" height="200" />
      <ng-template appCardContentChild let-city>
        <app-list-item
          [name]="city.name"
          [id]="city.id"
          (onDeleteItem)="onDeleteStudent($event)"></app-list-item>
      </ng-template>
    </app-card>
  `,
  imports: [
    CardComponent,
    CardContentChildDirective,
    ListItemComponent,
    NgOptimizedImage,
  ],

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CityCardComponent implements OnInit {
  private http = inject(FakeHttpService);
  private store = inject(CityStore);

  cities = this.store.cities;

  ngOnInit(): void {
    this.http.fetchCities$.subscribe((c) => this.store.addAll(c));
  }

  onDeleteStudent(id: number) {
    this.store.deleteOne(id);
  }

  onAddNewCity() {
    this.store.addOne(randomCity());
  }
}
