import { Observable } from 'rxjs';
import { Task, Category } from '../models/todo.model';

export abstract class TaskRepository {
  abstract getTasks(): Observable<Task[]>;
  abstract saveTasks(tasks: Task[]): Observable<void>;
  abstract deleteTask(id: string): Observable<void>;
}

export abstract class CategoryRepository {
  abstract getCategories(): Observable<Category[]>;
  abstract saveCategories(categories: Category[]): Observable<void>;
  abstract deleteCategory(id: string): Observable<void>;
}
