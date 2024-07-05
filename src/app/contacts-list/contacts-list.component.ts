import { Component, OnInit } from '@angular/core';
import { Contact } from '../shared/contact.model';
import { ContactService } from '../shared/contact.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'app-contacts-list',
  templateUrl: './contacts-list.component.html',
  styleUrls: ['./contacts-list.component.scss'],
  standalone: true,
  imports: [ MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    CommonModule,
    RouterModule,
    MatCardModule
  ]

})
export class ContactsListComponent implements OnInit {
  contacts: Contact[] = [];
  searchTerm: string = '';
  filteredContacts: Contact[] = [];

  sortOrder: 'asc' | 'desc' = 'asc'; 


  constructor(private contactService: ContactService) { }

  ngOnInit(): void {
    this.contacts = this.contactService.getAllContacts();
    this.sortContacts(); 
  }

  sortContacts(): void {
    this.contacts.sort((a, b) => {
      const nameA = a.firstName.toLowerCase();
      const nameB = b.firstName.toLowerCase();
      
      if (this.sortOrder === 'asc') {
        return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
      } else {
        return nameA > nameB ? -1 : nameA < nameB ? 1 : 0;
      }
    });
    this.applyFilter(); // Після сортування застосовуємо фільтр
  }

  toggleSortOrder(): void {
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    this.sortContacts();
  }

  applyFilter(): void {
    this.filteredContacts = this.contacts.filter(contact =>
      contact.firstName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      contact.lastName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      contact.phoneNumber.includes(this.searchTerm)
    );
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.contacts = this.contactService.getAllContacts();
  }
}
