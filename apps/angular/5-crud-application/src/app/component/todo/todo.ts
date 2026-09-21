import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.html',
  styleUrls: ['./todo.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class TodoComponent {
  public id = input.required<number>();
  public text = input.required<string>();
  public completed = input<boolean>(false);
  readonly onUpdateTodo = output<number>();

  updateTodo() {
    this.onUpdateTodo.emit(this.id());
  }

  completedClass = computed(() => {
    return this.completed() ? 'completed' : 'incompleted';
  });
}
