import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { IonicModule } from '@ionic/angular';

import { TaskRepository, CategoryRepository } from './core/domain/repositories/todo.repository';
import { FirebaseTaskRepository, FirebaseCategoryRepository } from './core/infrastructure/repositories/firebase-todo.repository';
import { FormsModule } from '@angular/forms';

import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    IonicModule.forRoot(),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule
  ],
  providers: [
    { provide: TaskRepository, useClass: FirebaseTaskRepository },
    { provide: CategoryRepository, useClass: FirebaseCategoryRepository }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
