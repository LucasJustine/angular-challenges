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
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [],
})
export class AppComponent implements OnInit {
  private store = inject(TodoStore);

  todos = this.store.todos;

  ngOnInit(): void {
    this.store.loadTodos();
  }

  update(todoId: number) {
    const todo: Todo | undefined = this.todos().find((t) => t.id === todoId);
    if (!todo) return;

    this.store.updateTodoApi(todo, randText());
  }
}
