import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, map, Observable, take, tap } from 'rxjs';
import { Task, Category } from '../../domain/models/todo.model';
import { TaskRepository, CategoryRepository } from '../../domain/repositories/todo.repository';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  private categoriesSubject = new BehaviorSubject<Category[]>([]);
  private filterSubject = new BehaviorSubject<string | null>(null);

  // Observables para la datos cuan hay cambios UI
  tasks$ = this.tasksSubject.asObservable();
  categories$ = this.categoriesSubject.asObservable();
  currentFilter$ = this.filterSubject.asObservable();

  // Flujo combinado para tareas filtradas
  filteredTasks$: Observable<Task[]> = combineLatest([
    this.tasks$,
    this.currentFilter$
  ]).pipe(
    map(([tasks, filterId]) => {
      if (!filterId) return tasks;
      return tasks.filter(t => t.categoryId === filterId);
    })
  );

  constructor(
    private taskRepo: TaskRepository,
    private categoryRepo: CategoryRepository
  ) {
    this.loadInitialData();
  }

  private loadInitialData() {
    this.taskRepo.getTasks().pipe(take(1)).subscribe(tasks => this.tasksSubject.next(tasks));
    this.categoryRepo.getCategories().pipe(take(1)).subscribe(cats => {
      if (cats.length === 0) {
        // Categoría predeterminada si no existe ninguna.
        cats = [{ id: 'default', name: 'General', color: '#3880ff' }];
        this.categoryRepo.saveCategories(cats).subscribe();
      }
      this.categoriesSubject.next(cats);
    });
  }

  // Operaciones de tareas
  addTask(title: string, categoryId?: string) {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title,
      completed: false,
      categoryId,
      createdAt: new Date()
    };
    const updated = [...this.tasksSubject.value, newTask];
    this.updateTasks(updated);
  }

  toggleTask(id: string) {
    const updated = this.tasksSubject.value.map(t => 
      t.id === id ? { ...t, completed: !t.completed } : t
    );
    this.updateTasks(updated);
  }

  updateTask(id: string, title: string, categoryId?: string) {
    const updated = this.tasksSubject.value.map(t => 
      t.id === id ? { ...t, title, categoryId } : t
    );
    this.updateTasks(updated);
  }

  deleteTask(id: string) {
    const updated = this.tasksSubject.value.filter(t => t.id !== id);
    this.updateTasks(updated);
  }

  private updateTasks(tasks: Task[]) {
    this.taskRepo.saveTasks(tasks).pipe(take(1)).subscribe(() => {
      this.tasksSubject.next(tasks);
    });
  }

  // Operaciones de categoría
  addCategory(name: string, color: string) {
    const newCat: Category = { id: crypto.randomUUID(), name, color };
    const updated = [...this.categoriesSubject.value, newCat];
    this.updateCategories(updated);
  }

  updateCategory(id: string, name: string, color: string) {
    const updated = this.categoriesSubject.value.map(c => 
      c.id === id ? { ...c, name, color } : c
    );
    this.updateCategories(updated);
  }

  deleteCategory(id: string) {
    const updated = this.categoriesSubject.value.filter(c => c.id !== id);
    // Tareas de limpieza con esta categoría
    const updatedTasks = this.tasksSubject.value.map(t => 
      t.categoryId === id ? { ...t, categoryId: undefined } : t
    );
    this.updateCategories(updated);
    this.updateTasks(updatedTasks);
  }

  private updateCategories(cats: Category[]) {
    this.categoryRepo.saveCategories(cats).pipe(take(1)).subscribe(() => {
      this.categoriesSubject.next(cats);
    });
  }

  // Operaciones de filtrado
  setFilter(categoryId: string | null) {
    this.filterSubject.next(categoryId);
  }
}
