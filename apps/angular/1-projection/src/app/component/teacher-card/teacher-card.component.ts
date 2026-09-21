import { NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import {
  FakeHttpService,
  randTeacher,
} from '../../data-access/fake-http.service';
import { TeacherStore } from '../../data-access/teacher.store';
import { CardContentChildDirective } from '../../ui/card/card-content-child.directive';
import { CardComponent } from '../../ui/card/card.component';
import { ListItemComponent } from '../../ui/list-item/list-item.component';

@Component({
  selector: 'app-teacher-card',
  template: `
    <app-card
      [list]="teachers()"
      customClass="bg-light-red"
      (onAddNewItem)="onAddNewTeacher()">
      <img ngSrc="assets/img/teacher.png" width="200" height="200" />
      <ng-template appCardContentChild let-item>
        <app-list-item
          [name]="item.firstName"
          [id]="item.id"
          (onDeleteItem)="onDeleteTeacher($event)"></app-list-item>
      </ng-template>
    </app-card>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    CardComponent,
    CardContentChildDirective,
    ListItemComponent,
    NgOptimizedImage,
  ],
})
export class TeacherCardComponent implements OnInit {
  private http = inject(FakeHttpService);
  private store = inject(TeacherStore);

  teachers = this.store.teachers;

  ngOnInit(): void {
    this.http.fetchTeachers$.subscribe((t) => this.store.addAll(t));
  }

  onDeleteTeacher(id: number) {
    this.store.deleteOne(id);
  }

  onAddNewTeacher() {
    this.store.addOne(randTeacher());
  }
}
