import { Observable } from 'rxjs';
import { Task, Category } from '../models/todo.model';

export abstract class TaskRepository {
  deleteTask(id: string) {
    throw new Error('Method not implemented.');
  }
  abstract getTasks(): Observable<Task[]>;
  abstract saveTasks(tasks: Task[]): Observable<void>;
}

export abstract class CategoryRepository {
  deleteCategory(id: string) {
    throw new Error('Method not implemented.');
  }
  abstract getCategories(): Observable<Category[]>;
  abstract saveCategories(categories: Category[]): Observable<void>;
}
