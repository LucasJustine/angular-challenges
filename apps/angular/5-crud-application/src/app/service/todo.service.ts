import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Todo } from '../model/todo.model';

@Injectable({
  providedIn: 'root',
})
export class TodoStore {
  private http = inject(HttpClient);
  private _todos = signal<Todo[]>([]);

  readonly todos = this._todos.asReadonly();

  loadTodos(): void {
    this.http
      .get<Todo[]>('https://jsonplaceholder.typicode.com/todos')
      .subscribe((todos) => {
        this._todos.set(todos);
      });
  }

  updateTodoApi(todo: Todo, newTitle: string): void {
    this.http
      .put<Todo>(
        `https://jsonplaceholder.typicode.com/todos/${todo.id}`,
        JSON.stringify({
          ...todo,
          title: newTitle,
        }),
        {
          headers: { 'Content-type': 'application/json; charset=UTF-8' },
        },
      )
      .subscribe((todoUpdated: Todo) => {
        this._todos.update((todos) =>
          todos.map((t) => (t.id === todoUpdated.id ? todoUpdated : t)),
        );
      });
  }
}
