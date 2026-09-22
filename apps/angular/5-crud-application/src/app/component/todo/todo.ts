import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Todo } from '../../model/todo.model';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.html',
  styleUrls: ['./todo.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [MatProgressSpinnerModule],
})
export class TodoComponent {
  public readonly todo = input.required<Todo>();
  public readonly loading = input<boolean>(false);
  public readonly error = input<string | null>(null);
  public readonly onUpdateTodo = output<number>();
  public readonly onDeleteTodo = output<number>();

  updateTodo() {
    this.onUpdateTodo.emit(this.todo().id);
  }

  deleteTodo() {
    this.onDeleteTodo.emit(this.todo().id);
  }

  completedClass = computed(() => {
    return this.todo().completed ? 'completed' : 'incompleted';
  });
}
