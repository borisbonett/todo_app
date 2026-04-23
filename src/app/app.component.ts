import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Observable } from 'rxjs';
import { TodoService } from './core/application/services/todo.service';
import { Task, Category } from './core/domain/models/todo.model';
import { AlertController, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  tasks$: Observable<Task[]>;
  categories$: Observable<Category[]>;
  currentFilter$: Observable<string | null>;

  newTaskTitle: string = '';
  selectedCategoryId: string = 'default';

  constructor(
    private todoService: TodoService,
    private alertCtrl: AlertController,
    private platform: Platform
  ) {
    this.tasks$ = this.todoService.filteredTasks$;
    this.categories$ = this.todoService.categories$;
    this.currentFilter$ = this.todoService.currentFilter$;
  }

  ngOnInit() {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      console.log('AppComponent: Platform ready, initializing Firebase...');
      this.todoService.init(); // Iniciamos Firebase después de que la app cargó

      if ((window as any).navigator && (window as any).navigator.splashscreen) {
        (window as any).navigator.splashscreen.hide();
      }
    });
  }
  // Task Actions

  addTask() {
    if (this.newTaskTitle.trim()) {
      this.todoService.addTask(this.newTaskTitle, this.selectedCategoryId);
      this.newTaskTitle = '';
    }
  }

  toggleTask(task: Task) {
    this.todoService.toggleTask(task.id);
  }

  deleteTask(task: Task) {
    this.todoService.deleteTask(task.id);
  }

  async editTask(task: Task) {
    const categories = await new Promise<Category[]>(resolve =>
      this.categories$.subscribe(c => resolve(c))
    );

    const alert = await this.alertCtrl.create({
      header: 'Edit Task',
      inputs: [
        { name: 'title', type: 'text', value: task.title, placeholder: 'Task Title' }
      ],
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Save',
          handler: (data) => {
            if (data.title) {
              this.todoService.updateTask(task.id, data.title, task.categoryId);
            }
          }
        }
      ]
    });
    await alert.present();
  }

  // Category Actions
  async openCategoryManager() {
    const categories = await new Promise<Category[]>(resolve =>
      this.categories$.subscribe(c => resolve(c))
    );

    const alert = await this.alertCtrl.create({
      header: 'Manage Categories',
      inputs: [
        { name: 'name', type: 'text', placeholder: 'Category Name' },
        { name: 'color', type: 'text', placeholder: 'Color (Hex)', value: '#3880ff' }
      ],
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Add',
          handler: (data) => {
            if (data.name) this.todoService.addCategory(data.name, data.color);
          }
        }
      ]
    });

    await alert.present();
  }

  async editCategory(category: Category) {
    const alert = await this.alertCtrl.create({
      header: 'Edit Category',
      inputs: [
        { name: 'name', type: 'text', value: category.name },
        { name: 'color', type: 'text', value: category.color }
      ],
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Save',
          handler: (data) => {
            if (data.name) this.todoService.updateCategory(category.id, data.name, data.color);
          }
        },
        {
          text: 'Delete',
          cssClass: 'alert-danger',
          handler: () => {
            this.todoService.deleteCategory(category.id);
          }
        }
      ]
    });
    await alert.present();
  }

  getCategoryColor(categoryId?: string, categories: Category[] | null = []): string {
    if (!categories) return '#ccc';
    const cat = categories.find(c => c.id === categoryId);
    return cat ? cat.color : '#ccc';
  }

  getCategoryName(categoryId?: string, categories: Category[] | null = []): string {
    if (!categories) return '';
    const cat = categories.find(c => c.id === categoryId);
    return cat ? cat.name : 'Uncategorized';
  }
}

