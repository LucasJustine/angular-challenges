import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { delay, of, throwError } from 'rxjs';
import { Todo } from '../model/todo.model';
import { TodoApiService } from './todo-api.service';
import { TodoStore } from './todo.service';

describe('TodoStore', () => {
  let store: TodoStore;

  let apiSpy: {
    getTodos: jest.Mock;
    updateTodo: jest.Mock;
    deleteTodo: jest.Mock;
  };

  beforeEach(() => {
    apiSpy = {
      getTodos: jest.fn(),
      updateTodo: jest.fn(),
      deleteTodo: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [TodoStore, { provide: TodoApiService, useValue: apiSpy }],
    });

    store = TestBed.inject(TodoStore);
  });

  it('devrait être créé avec les valeurs par défaut', () => {
    expect(store).toBeTruthy();
    expect(store.todos()).toEqual([]);
    expect(store.loading()).toBe(false);
    expect(store.errors()).toEqual({});
  });

  describe('loadTodos', () => {
    it('devrait charger les todos avec succès sans afficher le loading si très rapide', () => {
      const mockTodos: Todo[] = [
        { id: 1, title: 'Test Todo', completed: false, userId: 1 },
      ];

      apiSpy.getTodos.mockReturnValue(of(mockTodos));

      store.loadTodos();

      expect(store.todos()).toEqual(mockTodos);
      expect(store.loading()).toBe(false);
    });

    it('devrait afficher le loading si la requête prend plus de 200ms', fakeAsync(() => {
      const mockTodos: Todo[] = [
        { id: 1, title: 'Test Todo', completed: false, userId: 1 },
      ];

      apiSpy.getTodos.mockReturnValue(of(mockTodos).pipe(delay(300)));

      store.loadTodos();

      tick(200);
      expect(store.loading()).toBe(true);

      tick(100);
      expect(store.loading()).toBe(false);
      expect(store.todos()).toEqual(mockTodos);
    }));

    it('devrait gérer une erreur lors du chargement', () => {
      const errorMessage = 'Erreur serveur';
      apiSpy.getTodos.mockReturnValue(
        throwError(() => new Error(errorMessage)),
      );

      store.loadTodos();

      expect(store.todos()).toEqual([]);
      expect(store.errors()[-1]).toEqual(errorMessage);
    });
  });

  describe('updateTodo', () => {
    it('devrait mettre à jour un todo', () => {
      const initialTodo: Todo = {
        id: 1,
        title: 'Ancien titre',
        completed: false,
        userId: 1,
      };
      const updatedTodo: Todo = {
        id: 1,
        title: 'Nouveau titre',
        completed: true,
        userId: 1,
      };

      apiSpy.getTodos.mockReturnValue(of([initialTodo]));
      store.loadTodos();

      apiSpy.updateTodo.mockReturnValue(of(updatedTodo));

      store.updateTodo(initialTodo, 'Nouveau titre');

      expect(apiSpy.updateTodo).toHaveBeenCalledWith(1, {
        id: 1,
        title: 'Nouveau titre',
        completed: true,
        userId: 1,
      });
      expect(store.todos()).toEqual([updatedTodo]);
      expect(store.isProcessingTodo(1)).toBe(false);
    });

    it('devrait gérer les erreurs de mise à jour', () => {
      const initialTodo: Todo = {
        id: 1,
        title: 'Test',
        completed: false,
        userId: 1,
      };
      apiSpy.getTodos.mockReturnValue(of([initialTodo]));
      store.loadTodos();

      apiSpy.updateTodo.mockReturnValue(
        throwError(() => new Error('Erreur update')),
      );

      store.updateTodo(initialTodo, 'Nouveau');

      expect(store.todoHasError(1)).toBe(true);
      expect(store.errors()[1]).toEqual('Erreur update');
      expect(store.isProcessingTodo(1)).toBe(false);
    });
  });

  describe('deleteTodo', () => {
    it('devrait supprimer un todo', () => {
      const todo1: Todo = {
        id: 1,
        title: 'Todo 1',
        completed: false,
        userId: 1,
      };
      const todo2: Todo = {
        id: 2,
        title: 'Todo 2',
        completed: false,
        userId: 1,
      };

      apiSpy.getTodos.mockReturnValue(of([todo1, todo2]));
      store.loadTodos();

      apiSpy.deleteTodo.mockReturnValue(of(undefined as any));

      store.deleteTodo(1);

      expect(apiSpy.deleteTodo).toHaveBeenCalledWith(1);
      expect(store.todos()).toEqual([todo2]);
      expect(store.isProcessingTodo(1)).toBe(false);
    });
  });
});
