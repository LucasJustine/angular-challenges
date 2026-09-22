import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { randText } from '@ngneat/falso';
import { TodoComponent } from './component/todo/todo';
import { Todo } from './model/todo.model';
import { TodoStore } from './service/todo.service';

@Component({
  imports: [TodoComponent, MatProgressSpinnerModule],
  selector: 'app-root',
  template: `
    @if (store.loading()) {
      <mat-spinner></mat-spinner>
    } @else if (store.errors()[-1]) {
      <div class="error">Error loading todos: {{ store.errors()[-1] }}</div>
    } @else {
      @for (todo of todos(); track todo.id) {
        <app-todo
          [todo]="todo"
          [loading]="store.isProcessingTodo(todo.id)"
          [error]="store.errors()[todo.id]"
          (onUpdateTodo)="update($event)"
          (onDeleteTodo)="delete($event)"></app-todo>
      } @empty {
        <div>No todos available.</div>
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [],
})
export class AppComponent implements OnInit {
  public readonly store = inject(TodoStore);

  todos = this.store.todos;

  ngOnInit(): void {
    this.store.loadTodos();
  }

  update(todoId: number) {
    const todo: Todo | undefined = this.todos().find((t) => t.id === todoId);
    if (!todo) return;
    this.store.updateTodo(todo, randText());
  }

  delete(todoId: number) {
    const todo: Todo | undefined = this.todos().find((t) => t.id === todoId);
    if (!todo) return;
    this.store.deleteTodo(todoId);
  }
}
