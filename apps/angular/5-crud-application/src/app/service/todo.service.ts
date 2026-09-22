import { inject, Injectable, signal } from '@angular/core';
import { finalize } from 'rxjs/operators'; // Importer finalize
import { Todo } from '../model/todo.model';
import { TodoApiService } from './todo-api.service';

@Injectable({
  providedIn: 'root',
})
export class TodoStore {
  private api = inject(TodoApiService);
  private _todos = signal<Todo[]>([]);
  private _errors = signal<Record<number, string | null>>({});
  private _loading = signal<boolean>(false);
  private _updating = signal<Record<number, boolean>>({});

  readonly todos = this._todos.asReadonly();
  readonly errors = this._errors.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly updating = this._updating.asReadonly();

  isProcessingTodo(todoId: number): boolean {
    return this._updating().hasOwnProperty(todoId) && this._updating()[todoId];
  }

  todoHasError(todoId: number): boolean {
    return (
      this._errors().hasOwnProperty(todoId) && this._errors()[todoId] !== null
    );
  }

  private processingTodo(todoId: number): void {
    this._updating.update((updating) => ({
      ...updating,
      [todoId]: true,
    }));

    this._errors.update((errors) => ({
      ...errors,
      [todoId]: null,
    }));
  }

  private setError(todoId: number, errorMessage: string): void {
    this._errors.update((errors) => ({
      ...errors,
      [todoId]: errorMessage,
    }));
  }

  private endProcessingTodo(todoId: number): void {
    this._updating.update((updating) => ({
      ...updating,
      [todoId]: false,
    }));
  }

  loadTodos(): void {
    this._errors.set({});
    const loadingTimer = setTimeout(() => this._loading.set(true), 200);

    this.api
      .getTodos()
      .pipe(
        finalize(() => {
          clearTimeout(loadingTimer);
          this._loading.set(false);
        }),
      )
      .subscribe({
        next: (todos) => this._todos.set(todos),
        error: (error) => {
          this.setError(
            -1,
            error.message || 'An error occurred while loading todos',
          );
        },
      });
  }

  updateTodo(todo: Todo, newTitle: string): void {
    const payload = {
      ...todo,
      title: newTitle,
      completed: !todo.completed,
    };

    this.processingTodo(todo.id);

    this.api
      .updateTodo(todo.id, payload)
      .pipe(
        finalize(() => {
          this.endProcessingTodo(todo.id);
        }),
      )
      .subscribe({
        next: (updatedTodo) => {
          const updatedTodos = this._todos().map((t) =>
            t.id === updatedTodo.id ? updatedTodo : t,
          );
          this._todos.set(updatedTodos);
        },
        error: (error) => {
          this.setError(todo.id, error.message || 'An error occurred');
        },
      });
  }

  deleteTodo(todoId: number): void {
    this.processingTodo(todoId);

    this.api
      .deleteTodo(todoId)
      .pipe(
        finalize(() => {
          this.endProcessingTodo(todoId);
        }),
      )
      .subscribe({
        next: () => {
          const updatedTodos = this._todos().filter((t) => t.id !== todoId);
          this._todos.set(updatedTodos);
        },
        error: (error) => {
          this.setError(todoId, error.message || 'An error occurred');
        },
      });
  }
}
