import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, map, Observable, startWith, tap } from 'rxjs';
import { Task, Category } from '../../domain/models/todo.model';
import { TaskRepository, CategoryRepository } from '../../domain/repositories/todo.repository';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  private categoriesSubject = new BehaviorSubject<Category[]>([]);
  private filterSubject = new BehaviorSubject<string | null>(null);

  // Observables for the UI
  tasks$ = this.tasksSubject.asObservable();
  categories$ = this.categoriesSubject.asObservable();
  currentFilter$ = this.filterSubject.asObservable();

  // Combined stream for filtered tasks
  filteredTasks$: Observable<Task[]> = combineLatest([
    this.tasks$,
    this.currentFilter$
  ]).pipe(
    map(([tasks, filterId]) => {
      if (!filterId) return tasks;
      return tasks.filter(t => t.categoryId === filterId);
    }),
    startWith([]) // Fuerza una emisión inicial vacía
  );

  constructor(
    private taskRepo: TaskRepository,
    private categoryRepo: CategoryRepository
  ) {
    // Ya no llamamos a loadInitialData() aquí para no bloquear el inicio
  }

  public init() {
    this.loadInitialData();
  }

  /**
   * Carga los datos iniciales desde Firebase.
   * Se suscribe a los flujos de datos para obtener actualizaciones en tiempo real.
   */
  private loadInitialData() {
    console.log('TodoService: loadInitialData() started');

    // Agregamos startWith([]) para que la UI no se bloquee esperando a Firebase
    this.taskRepo.getTasks().pipe(
      tap(tasks => console.log('TodoService: Received tasks:', tasks?.length || 0))
    ).subscribe({
      next: tasks => this.tasksSubject.next(tasks || []),
      error: err => console.error('TodoService: Error loading tasks:', err)
    });

    this.categoryRepo.getCategories().pipe(
      tap(cats => console.log('TodoService: Received categories:', cats?.length || 0))
    ).subscribe({
      next: cats => {
        if (cats && cats.length === 0) {
          console.log('TodoService: No categories found, creating default');
          const defaultCats = [{ id: 'default', name: 'General', color: '#3880ff' }];
          this.categoryRepo.saveCategories(defaultCats).subscribe();
          this.categoriesSubject.next(defaultCats);
        } else {
          this.categoriesSubject.next(cats || []);
        }
      },
      error: err => console.error('TodoService: Error loading categories:', err)
    });
  }

  // Task Operations
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

  /**
   * Elimina una tarea de Firebase.
   */
  deleteTask(id: string) {
    this.taskRepo.deleteTask(id).subscribe();
  }

  /**
   * Sincroniza la lista de tareas con Firebase.
   */
  private updateTasks(tasks: Task[]) {
    this.taskRepo.saveTasks(tasks).subscribe();
  }

  // Category Operations
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

  /**
   * Elimina una categoría de Firebase.
   */
  deleteCategory(id: string) {
    this.categoryRepo.deleteCategory(id).subscribe();
  }

  /**
   * Sincroniza la lista de categorías con Firebase.
   */
  private updateCategories(cats: Category[]) {
    this.categoryRepo.saveCategories(cats).subscribe();
  }

  // Filter Operations
  setFilter(categoryId: string | null) {
    this.filterSubject.next(categoryId);
  }
}
