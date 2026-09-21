import { Injectable, signal } from '@angular/core';
import { Todo } from '../model/todo.model';

@Injectable({
  providedIn: 'root',
})
export class TodoStore {
  private _todos = signal<Todo[]>([]);

  readonly todos = this._todos.asReadonly();

  addAll(todos: Todo[]) {
    this._todos.set(todos);
  }

  update(id: number, todoUpdated: Todo) {
    this._todos.update((todos) => {
      return todos.map((todo) => (todo.id === id ? todoUpdated : todo));
    });
  }
}
