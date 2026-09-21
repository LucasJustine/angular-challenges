import { HttpClient } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { randText } from '@ngneat/falso';
import { TodoComponent } from './component/todo/todo';
import { Todo } from './model/todo.model';
import { TodoStore } from './service/todo.service';

@Component({
  imports: [TodoComponent],
  selector: 'app-root',
  template: `
    @for (todo of todos(); track todo.id) {
      <app-todo
        [id]="todo.id"
        [text]="todo.title"
        [completed]="todo.completed"
        (onUpdateTodo)="update($event)"></app-todo>
    }
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: [],
})
export class AppComponent implements OnInit {
  private http = inject(HttpClient);
  private store = inject(TodoStore);

  todos = this.store.todos;

  ngOnInit(): void {
    this.http
      .get<Todo[]>('https://jsonplaceholder.typicode.com/todos')
      .subscribe((todos) => {
        this.store.addAll(todos);
      });
  }

  update(todoId: number) {
    const todo: Todo | undefined = this.todos().find((t) => t.id === todoId);
    if (!todo) {
      return;
    }
    this.http
      .put<Todo>(
        `https://jsonplaceholder.typicode.com/todos/${todo.id}`,
        JSON.stringify({
          todo: todo.id,
          title: randText(),
          userId: todo.userId,
          completed: !todo.completed,
        }),
        {
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
          },
        },
      )
      .subscribe((todoUpdated: any) => {
        this.store.update(todoUpdated.id, todoUpdated);
      });
  }
}
