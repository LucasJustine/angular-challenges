import { NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import {
  FakeHttpService,
  randStudent,
} from '../../data-access/fake-http.service';
import { StudentStore } from '../../data-access/student.store';
import { CardContentChildDirective } from '../../ui/card/card-content-child.directive';
import { CardComponent } from '../../ui/card/card.component';
import { ListItemComponent } from '../../ui/list-item/list-item.component';

@Component({
  selector: 'app-student-card',
  template: `
    <app-card
      [list]="students()"
      (onAddNewItem)="onAddNewStudent()"
      customClass="bg-light-green">
      <img ngSrc="assets/img/student.webp" width="200" height="200" />
      <ng-template appCardContentChild let-student>
        <app-list-item
          [name]="student.firstName"
          [id]="student.id"
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
export class StudentCardComponent implements OnInit {
  private http = inject(FakeHttpService);
  private store = inject(StudentStore);

  students = this.store.students;

  ngOnInit(): void {
    this.http.fetchStudents$.subscribe((s) => this.store.addAll(s));
  }

  onDeleteStudent(id: number) {
    this.store.deleteOne(id);
  }

  onAddNewStudent() {
    this.store.addOne(randStudent());
  }
}
