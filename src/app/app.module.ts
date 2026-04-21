import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { IonicModule } from '@ionic/angular';

import { TaskRepository, CategoryRepository } from './core/domain/repositories/todo.repository';
import { LocalStorageTaskRepository, LocalStorageCategoryRepository } from './core/infrastructure/repositories/local-storage-todo.repository';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    IonicModule.forRoot()
  ],
  providers: [
    { provide: TaskRepository, useClass: LocalStorageTaskRepository },
    { provide: CategoryRepository, useClass: LocalStorageCategoryRepository }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
