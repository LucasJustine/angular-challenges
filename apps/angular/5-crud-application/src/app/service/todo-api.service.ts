import { HttpClient } from '@angular/common/http';
import { Service, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Todo } from '../model/todo.model';

@Service()
export class TodoApiService {
  private http = inject(HttpClient);
  private baseUrl = 'https://jsonplaceholder.typicode.com/todos';

  getTodos(): Observable<Todo[]> {
    return this.http.get<Todo[]>(this.baseUrl);
  }

  updateTodo(id: number, payload: Partial<Todo>): Observable<Todo> {
    return this.http.put<Todo>(
      `${this.baseUrl}/${id}`,
      JSON.stringify(payload),
      {
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      },
    );
  }

  deleteTodo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
