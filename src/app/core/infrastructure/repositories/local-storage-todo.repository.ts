import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Task, Category } from '../../domain/models/todo.model';
import { TaskRepository, CategoryRepository } from '../../domain/repositories/todo.repository';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageTaskRepository implements TaskRepository {
  private readonly STORAGE_KEY = 'todo_tasks';

  getTasks(): Observable<Task[]> {
    const tasks = localStorage.getItem(this.STORAGE_KEY);
    return of(tasks ? JSON.parse(tasks) : []);
  }

  saveTasks(tasks: Task[]): Observable<void> {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(tasks));
    return of(undefined);
  }
}

@Injectable({
  providedIn: 'root'
})
export class LocalStorageCategoryRepository implements CategoryRepository {
  private readonly STORAGE_KEY = 'todo_categories';

  getCategories(): Observable<Category[]> {
    const categories = localStorage.getItem(this.STORAGE_KEY);
    return of(categories ? JSON.parse(categories) : []);
  }

  saveCategories(categories: Category[]): Observable<void> {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(categories));
    return of(undefined);
  }
}