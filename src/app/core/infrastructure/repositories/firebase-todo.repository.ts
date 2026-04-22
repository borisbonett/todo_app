import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { Task, Category } from '../../domain/models/todo.model';
import { TaskRepository, CategoryRepository } from '../../domain/repositories/todo.repository';

@Injectable({
  providedIn: 'root'
})
export class FirebaseTaskRepository implements TaskRepository {
  private readonly collectionName = 'Task';

  constructor(private firestore: AngularFirestore) {}

  /**
   * Obtiene todas las tareas de la colección 'tasks' en Firestore.
   * Se utiliza valueChanges para obtener un flujo de datos en tiempo real.
   * Se mapea la fecha de creación desde el Timestamp de Firestore.
   */
  getTasks(): Observable<Task[]> {
    console.log('FirebaseTaskRepository: getTasks() called');
    return this.firestore.collection<Task>(this.collectionName).valueChanges({ idField: 'id' }).pipe(
      map(tasks => {
        console.log('FirebaseTaskRepository: Tasks received from Firestore:', tasks);
        return tasks.map(task => ({
          ...task,
          createdAt: (task.createdAt as any)?.toDate ? (task.createdAt as any).toDate() : task.createdAt
        }));
      })
    );
  }

  /**
   * Guarda o actualiza una lista de tareas en Firestore.
   * Utiliza un batch para sincronizar los cambios de forma atómica.
   */
  saveTasks(tasks: Task[]): Observable<void> {
    const batch = this.firestore.firestore.batch();
    tasks.forEach(task => {
      const docRef = this.firestore.collection(this.collectionName).doc(task.id).ref;
      batch.set(docRef, { 
        ...task, 
        createdAt: task.createdAt instanceof Date ? task.createdAt : new Date() 
      }, { merge: true });
    });
    return from(batch.commit());
  }

  /**
   * Elimina una tarea específica de Firestore por su ID.
   */
  deleteTask(id: string): Observable<void> {
    console.log(`FirebaseTaskRepository: Eliminando tarea con ID: ${id}`);
    return from(this.firestore.collection(this.collectionName).doc(id).delete());
  }
}

@Injectable({
  providedIn: 'root'
})
export class FirebaseCategoryRepository implements CategoryRepository {
  private readonly collectionName = 'Category';

  constructor(private firestore: AngularFirestore) {}

  /**
   * Obtiene todas las categorías de la colección 'categories' en Firestore.
   */
  getCategories(): Observable<Category[]> {
    console.log('FirebaseCategoryRepository: getCategories() called');
    return this.firestore.collection<Category>(this.collectionName).valueChanges({ idField: 'id' }).pipe(
      map(cats => {
        console.log('FirebaseCategoryRepository: Categories received from Firestore:', cats);
        return cats;
      })
    );
  }

  /**
   * Guarda o actualiza una lista de categorías en Firestore usando un batch.
   */
  saveCategories(categories: Category[]): Observable<void> {
    const batch = this.firestore.firestore.batch();
    categories.forEach(cat => {
      const docRef = this.firestore.collection(this.collectionName).doc(cat.id).ref;
      batch.set(docRef, cat, { merge: true });
    });
    return from(batch.commit());
  }

  /**
   * Elimina una categoría específica de Firestore por su ID.
   */
  deleteCategory(id: string): Observable<void> {
    console.log(`FirebaseCategoryRepository: Eliminando categoría con ID: ${id}`);
    return from(this.firestore.collection(this.collectionName).doc(id).delete());
  }
}