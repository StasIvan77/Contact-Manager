import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContactsListComponent } from './contacts-list/contacts-list.component';
import { ContactDetailComponent } from './contact-detail/contact-detail.component';
import { ContactAddComponent } from './contact-add/contact-add.component';

const routes: Routes = [
  { path: '', redirectTo: '/contacts', pathMatch: 'full' },
  { path: 'contacts', component: ContactsListComponent },
  { path: 'contact/:id', component: ContactDetailComponent }, // персональний шлях для деталей контакту з параметром :id
  { path: 'contacts/edit/:id', component: ContactAddComponent }, // Доданий маршрут для редагування
  { path: 'contacts/new', component: ContactAddComponent },
  { path: '**', redirectTo: '/contacts', pathMatch: 'full' } // Обробка невідомих URL

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
